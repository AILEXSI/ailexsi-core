/**
 * MemoryDomain — Phase 06
 * All writes go through EventStore. Versions are immutable.
 * Projection is rebuildable from events (AAS-54).
 */

import { randomUUID } from "node:crypto";
import type {
  UUID,
  Timestamp,
  Version,
  DomainEvent,
  EventEnvelope,
  MemoryCell,
  MemoryVersion,
  MemoryContent,
  MemoryContext,
  MemoryMeaning,
  Provenance,
  Evidence,
  TemporalMetadata,
  LifecycleMetadata,
  LifecycleState,
} from "@ailexsi/contracts";
import {
  MemoryCellSchema,
  ProvenanceSchema,
  TemporalMetadataSchema,
  zeroCognitiveState,
  EventValidationError,
} from "@ailexsi/contracts";
import type { EventStore } from "@ailexsi/eventstore";

const AGGREGATE_TYPE = "Memory";

export type MemoryEventType =
  | "MemoryCreated"
  | "MemoryUpdated"
  | "MemoryArchived"
  | "MemoryRestored";

export interface CreateMemoryCommand {
  content: MemoryContent;
  context?: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence?: Evidence[];
  lifecycleState?: LifecycleState;
  timestamps?: Partial<TemporalMetadata>;
  idempotencyKey: string;
  correlationId?: UUID;
  causationId?: UUID;
  createdBy?: string;
  /** Optional fixed id for deterministic tests / replay */
  memoryId?: UUID;
}

export interface UpdateMemoryCommand {
  content?: MemoryContent;
  context?: MemoryContext;
  meaning?: MemoryMeaning;
  provenance?: Provenance;
  evidence?: Evidence[];
  changeReason?: string;
  idempotencyKey: string;
  correlationId?: UUID;
  causationId?: UUID;
  createdBy?: string;
}

export interface LifecycleCommand {
  reason?: string;
  idempotencyKey: string;
  correlationId?: UUID;
  causationId?: UUID;
  createdBy?: string;
}

interface MemoryCreatedPayload {
  memoryId: UUID;
  shortId: string;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  lifecycle: LifecycleMetadata;
  timestamps: TemporalMetadata;
  createdBy: string;
}

interface MemoryUpdatedPayload {
  memoryId: UUID;
  version: Version;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  timestamps: TemporalMetadata;
  previousVersion: Version;
  changeReason?: string;
  createdBy: string;
}

interface MemoryLifecyclePayload {
  memoryId: UUID;
  version: Version;
  previousVersion: Version;
  lifecycle: LifecycleMetadata;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  timestamps: TemporalMetadata;
  createdBy: string;
}

function nowTs(): Timestamp {
  return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

function shortIdFrom(uuid: string): string {
  return uuid.replace(/-/g, "").slice(0, 8);
}

function buildTimestamps(
  partial: Partial<TemporalMetadata> | undefined,
  base: Timestamp
): TemporalMetadata {
  return {
    createdAt: partial?.createdAt ?? base,
    observedAt: partial?.observedAt ?? base,
    validFrom: partial?.validFrom ?? base,
    validTo: partial?.validTo ?? null,
    confirmedAt: partial?.confirmedAt ?? base,
    deprecatedAt: partial?.deprecatedAt ?? null,
  };
}

export class MemoryDomain {
  /** In-memory projection: current cell + ordered versions. Rebuildable. */
  private cells = new Map<UUID, MemoryCell>();
  private versions = new Map<UUID, MemoryVersion[]>();

  constructor(
    private readonly store: EventStore,
    private readonly producer = "memory-domain",
    private readonly environment: "development" | "test" | "production" = "test"
  ) {}

  /** Clear projection (for AAS-54 replay tests). */
  clearProjection(): void {
    this.cells.clear();
    this.versions.clear();
  }

  /** Rebuild projection from a list of envelopes (AAS-54). */
  rebuildFromEvents(envelopes: EventEnvelope[]): void {
    this.clearProjection();
    const ordered = [...envelopes].sort((a, b) => {
      if (a.event.aggregateId !== b.event.aggregateId) {
        return a.event.aggregateId.localeCompare(b.event.aggregateId);
      }
      return a.event.aggregateVersion - b.event.aggregateVersion;
    });
    for (const env of ordered) {
      this.applyEvent(env);
    }
  }

  async create(cmd: CreateMemoryCommand): Promise<MemoryCell> {
    const prov = ProvenanceSchema.safeParse(cmd.provenance);
    if (!prov.success) {
      throw new EventValidationError(`Invalid Provenance: ${prov.error.message}`);
    }

    const ts = nowTs();
    const memoryId = cmd.memoryId ?? randomUUID();
    const timestamps = buildTimestamps(cmd.timestamps, ts);
    TemporalMetadataSchema.parse(timestamps);

    const lifecycle: LifecycleMetadata = {
      state: cmd.lifecycleState ?? "active",
      changedAt: ts,
    };

    const payload: MemoryCreatedPayload = {
      memoryId,
      shortId: shortIdFrom(memoryId),
      content: cmd.content,
      context: cmd.context ?? {},
      meaning: cmd.meaning,
      provenance: cmd.provenance,
      evidence: cmd.evidence ?? [],
      lifecycle,
      timestamps,
      createdBy: cmd.createdBy ?? "system",
    };

    const event: DomainEvent<MemoryCreatedPayload> = {
      eventId: randomUUID(),
      eventType: "MemoryCreated",
      aggregateId: memoryId,
      aggregateType: AGGREGATE_TYPE,
      aggregateVersion: 1,
      timestamp: ts,
      payload,
      causationId: cmd.causationId,
      correlationId: cmd.correlationId,
      idempotencyKey: cmd.idempotencyKey,
    };

    const envelope: EventEnvelope<MemoryCreatedPayload> = {
      event,
      schemaVersion: "0.1.0",
      producer: this.producer,
      environment: this.environment,
    };

    const result = await this.store.append(envelope);
    this.applyEvent(result.envelope);
    const cell = this.cells.get(memoryId);
    if (!cell) throw new Error("Projection missing after create");
    MemoryCellSchema.parse(cell);
    return cell;
  }

  async get(memoryId: UUID): Promise<MemoryCell | null> {
    return this.cells.get(memoryId) ?? null;
  }

  async update(memoryId: UUID, cmd: UpdateMemoryCommand): Promise<MemoryCell> {
    const current = this.cells.get(memoryId);
    if (!current) throw new EventValidationError(`Memory ${memoryId} not found`);
    if (current.lifecycle.state === "archived") {
      throw new EventValidationError("Cannot update archived memory; restore first");
    }

    const ts = nowTs();
    const nextVersion = current.currentVersion + 1;

    const provenance = cmd.provenance ?? current.provenance;
    ProvenanceSchema.parse(provenance);

    const timestamps: TemporalMetadata = {
      ...current.timestamps,
      observedAt: ts,
      confirmedAt: ts,
    };

    const payload: MemoryUpdatedPayload = {
      memoryId,
      version: nextVersion,
      content: cmd.content ?? current.content,
      context: cmd.context ?? current.context,
      meaning: cmd.meaning !== undefined ? cmd.meaning : current.meaning,
      provenance,
      evidence: cmd.evidence ?? current.evidence,
      timestamps,
      previousVersion: current.currentVersion,
      changeReason: cmd.changeReason,
      createdBy: cmd.createdBy ?? "system",
    };

    const event: DomainEvent<MemoryUpdatedPayload> = {
      eventId: randomUUID(),
      eventType: "MemoryUpdated",
      aggregateId: memoryId,
      aggregateType: AGGREGATE_TYPE,
      aggregateVersion: nextVersion,
      timestamp: ts,
      payload,
      causationId: cmd.causationId,
      correlationId: cmd.correlationId,
      idempotencyKey: cmd.idempotencyKey,
    };

    const envelope: EventEnvelope<MemoryUpdatedPayload> = {
      event,
      schemaVersion: "0.1.0",
      producer: this.producer,
      environment: this.environment,
    };

    const result = await this.store.append(envelope);
    this.applyEvent(result.envelope);
    const cell = this.cells.get(memoryId);
    if (!cell) throw new Error("Projection missing after update");
    return cell;
  }

  async archive(memoryId: UUID, cmd: LifecycleCommand): Promise<MemoryCell> {
    return this.lifecycleTransition(memoryId, "archived", "MemoryArchived", cmd);
  }

  async restore(memoryId: UUID, cmd: LifecycleCommand): Promise<MemoryCell> {
    return this.lifecycleTransition(memoryId, "active", "MemoryRestored", cmd);
  }

  async getHistory(memoryId: UUID): Promise<MemoryVersion[]> {
    return [...(this.versions.get(memoryId) ?? [])];
  }

  private async lifecycleTransition(
    memoryId: UUID,
    state: LifecycleState,
    eventType: MemoryEventType,
    cmd: LifecycleCommand
  ): Promise<MemoryCell> {
    const current = this.cells.get(memoryId);
    if (!current) throw new EventValidationError(`Memory ${memoryId} not found`);

    const ts = nowTs();
    const nextVersion = current.currentVersion + 1;
    const lifecycle: LifecycleMetadata = {
      state,
      changedAt: ts,
      reason: cmd.reason,
    };

    const timestamps: TemporalMetadata = {
      ...current.timestamps,
      observedAt: ts,
      confirmedAt: ts,
      deprecatedAt: state === "archived" ? ts : current.timestamps.deprecatedAt,
    };

    const payload: MemoryLifecyclePayload = {
      memoryId,
      version: nextVersion,
      previousVersion: current.currentVersion,
      lifecycle,
      content: current.content,
      context: current.context,
      meaning: current.meaning,
      provenance: current.provenance,
      evidence: current.evidence,
      timestamps,
      createdBy: cmd.createdBy ?? "system",
    };

    const event: DomainEvent<MemoryLifecyclePayload> = {
      eventId: randomUUID(),
      eventType,
      aggregateId: memoryId,
      aggregateType: AGGREGATE_TYPE,
      aggregateVersion: nextVersion,
      timestamp: ts,
      payload,
      causationId: cmd.causationId,
      correlationId: cmd.correlationId,
      idempotencyKey: cmd.idempotencyKey,
    };

    const envelope: EventEnvelope<MemoryLifecyclePayload> = {
      event,
      schemaVersion: "0.1.0",
      producer: this.producer,
      environment: this.environment,
    };

    const result = await this.store.append(envelope);
    this.applyEvent(result.envelope);
    const cell = this.cells.get(memoryId);
    if (!cell) throw new Error("Projection missing after lifecycle transition");
    return cell;
  }

  private applyEvent(envelope: EventEnvelope): void {
    const { event } = envelope;
    if (event.aggregateType !== AGGREGATE_TYPE) return;

    switch (event.eventType) {
      case "MemoryCreated": {
        const p = event.payload as MemoryCreatedPayload;
        const cell: MemoryCell = {
          identity: {
            id: p.memoryId,
            shortId: p.shortId,
            version: 1,
            canonical: true,
          },
          content: p.content,
          context: p.context,
          meaning: p.meaning,
          provenance: p.provenance,
          evidence: p.evidence,
          lifecycle: p.lifecycle,
          timestamps: p.timestamps,
          cognitiveState: zeroCognitiveState(event.timestamp),
          relationRefs: [],
          currentVersion: 1,
        };
        this.cells.set(p.memoryId, cell);
        const ver: MemoryVersion = {
          memoryId: p.memoryId,
          version: 1,
          content: p.content,
          context: p.context,
          meaning: p.meaning,
          provenance: p.provenance,
          evidence: p.evidence,
          timestamps: p.timestamps,
          createdAt: event.timestamp,
          createdBy: p.createdBy,
        };
        this.versions.set(p.memoryId, [ver]);
        break;
      }
      case "MemoryUpdated": {
        const p = event.payload as MemoryUpdatedPayload;
        const prev = this.cells.get(p.memoryId);
        if (!prev) return;
        const cell: MemoryCell = {
          ...prev,
          identity: { ...prev.identity, version: p.version },
          content: p.content,
          context: p.context,
          meaning: p.meaning,
          provenance: p.provenance,
          evidence: p.evidence,
          timestamps: p.timestamps,
          cognitiveState: zeroCognitiveState(event.timestamp),
          currentVersion: p.version,
        };
        this.cells.set(p.memoryId, cell);
        const ver: MemoryVersion = {
          memoryId: p.memoryId,
          version: p.version,
          content: p.content,
          context: p.context,
          meaning: p.meaning,
          provenance: p.provenance,
          evidence: p.evidence,
          timestamps: p.timestamps,
          createdAt: event.timestamp,
          createdBy: p.createdBy,
          previousVersion: p.previousVersion,
          changeReason: p.changeReason,
        };
        const list = this.versions.get(p.memoryId) ?? [];
        list.push(ver);
        this.versions.set(p.memoryId, list);
        break;
      }
      case "MemoryArchived":
      case "MemoryRestored": {
        const p = event.payload as MemoryLifecyclePayload;
        const prev = this.cells.get(p.memoryId);
        if (!prev) return;
        const cell: MemoryCell = {
          ...prev,
          identity: { ...prev.identity, version: p.version },
          lifecycle: p.lifecycle,
          timestamps: p.timestamps,
          cognitiveState: zeroCognitiveState(event.timestamp),
          currentVersion: p.version,
        };
        this.cells.set(p.memoryId, cell);
        const ver: MemoryVersion = {
          memoryId: p.memoryId,
          version: p.version,
          content: p.content,
          context: p.context,
          meaning: p.meaning,
          provenance: p.provenance,
          evidence: p.evidence,
          timestamps: p.timestamps,
          createdAt: event.timestamp,
          createdBy: p.createdBy,
          previousVersion: p.previousVersion,
          changeReason: p.lifecycle.reason,
        };
        const list = this.versions.get(p.memoryId) ?? [];
        list.push(ver);
        this.versions.set(p.memoryId, list);
        break;
      }
      default:
        break;
    }
  }
}
