/**
 * Phase 06 unit tests — Memory contracts + MemoryDomain
 * Uses a minimal in-memory EventStore double (no Postgres required).
 */

import { describe, it, expect, beforeEach } from "vitest";
import { randomUUID } from "node:crypto";
import {
  ProvenanceSchema,
  TemporalMetadataSchema,
  MemoryCellSchema,
  zeroCognitiveState,
  type EventEnvelope,
  type DomainEvent,
  type Provenance,
} from "../../packages/contracts/src/index.js";
import type { EventStore, AppendResult } from "../../packages/infrastructure/eventstore/src/event-store.js";
import { MemoryDomain } from "../../packages/core/memory/src/index.js";

class InMemoryEventStore implements EventStore {
  private events: EventEnvelope[] = [];
  private byKey = new Map<string, EventEnvelope>();

  async append(envelope: EventEnvelope): Promise<AppendResult> {
    const existing = this.byKey.get(envelope.event.idempotencyKey);
    if (existing) {
      return { appended: false, event: existing.event, envelope: existing };
    }
    const current = this.events.filter(
      (e) => e.event.aggregateId === envelope.event.aggregateId
    );
    const maxV = current.reduce((m, e) => Math.max(m, e.event.aggregateVersion), 0);
    if (envelope.event.aggregateVersion !== maxV + 1) {
      throw Object.assign(new Error("version conflict"), {
        code: envelope.event.aggregateVersion <= maxV ? "CONCURRENCY_CONFLICT" : "ORDERING_VIOLATION",
      });
    }
    this.events.push(envelope);
    this.byKey.set(envelope.event.idempotencyKey, envelope);
    return { appended: true, event: envelope.event, envelope };
  }

  async getCurrentVersion(aggregateId: string): Promise<number> {
    return this.events
      .filter((e) => e.event.aggregateId === aggregateId)
      .reduce((m, e) => Math.max(m, e.event.aggregateVersion), 0);
  }

  async getByAggregate(aggregateId: string): Promise<EventEnvelope[]> {
    return this.events
      .filter((e) => e.event.aggregateId === aggregateId)
      .sort((a, b) => a.event.aggregateVersion - b.event.aggregateVersion);
  }

  async getStream(): Promise<EventEnvelope[]> {
    return [...this.events];
  }

  async getByEventId(eventId: string): Promise<EventEnvelope | null> {
    return this.events.find((e) => e.event.eventId === eventId) ?? null;
  }

  async getByIdempotencyKey(key: string): Promise<EventEnvelope | null> {
    return this.byKey.get(key) ?? null;
  }

  all(): EventEnvelope[] {
    return [...this.events];
  }
}

function baseProvenance(): Provenance {
  return {
    sourceType: "user",
    capturedAt: "2026-08-08T12:00:00.000Z",
    parentMemoryIds: [],
    evidenceIds: [],
  };
}

describe("Memory contracts schemas", () => {
  it("accepts valid Provenance", () => {
    expect(ProvenanceSchema.safeParse(baseProvenance()).success).toBe(true);
  });

  it("rejects empty sourceType", () => {
    const bad = { ...baseProvenance(), sourceType: "" };
    expect(ProvenanceSchema.safeParse(bad).success).toBe(false);
  });

  it("zeroCognitiveState is deterministic and valid", () => {
    const csv = zeroCognitiveState("2026-08-08T12:00:00.000Z");
    expect(csv.mass).toBe(0);
    expect(csv.physicsVersion).toBe("0.1.4");
    expect(csv.formulaVersion).toBe("0.2.5");
  });
});

describe("MemoryDomain", () => {
  let store: InMemoryEventStore;
  let domain: MemoryDomain;

  beforeEach(() => {
    store = new InMemoryEventStore();
    domain = new MemoryDomain(store, "test", "test");
  });

  it("create produces MemoryCell version 1 and emits MemoryCreated", async () => {
    const cell = await domain.create({
      content: { type: "text", text: "hello" },
      provenance: baseProvenance(),
      idempotencyKey: randomUUID(),
    });
    expect(cell.currentVersion).toBe(1);
    expect(cell.identity.version).toBe(1);
    expect(cell.content).toEqual({ type: "text", text: "hello" });
    expect(cell.provenance.sourceType).toBe("user");
    expect(cell.lifecycle.state).toBe("active");
    MemoryCellSchema.parse(cell);

    const hist = await domain.getHistory(cell.identity.id);
    expect(hist).toHaveLength(1);
    expect(hist[0]!.version).toBe(1);
  });

  it("rejects create without valid provenance", async () => {
    await expect(
      domain.create({
        content: { type: "text", text: "x" },
        provenance: { sourceType: "user", capturedAt: "bad", parentMemoryIds: [], evidenceIds: [] },
        idempotencyKey: randomUUID(),
      })
    ).rejects.toThrow();
  });

  it("update creates new version", async () => {
    const cell = await domain.create({
      content: { type: "text", text: "v1" },
      provenance: baseProvenance(),
      idempotencyKey: randomUUID(),
    });
    const updated = await domain.update(cell.identity.id, {
      content: { type: "text", text: "v2" },
      changeReason: "edit",
      idempotencyKey: randomUUID(),
    });
    expect(updated.currentVersion).toBe(2);
    expect((updated.content as { text: string }).text).toBe("v2");
    const hist = await domain.getHistory(cell.identity.id);
    expect(hist.map((h) => h.version)).toEqual([1, 2]);
  });

  it("archive and restore preserve history", async () => {
    const cell = await domain.create({
      content: { type: "text", text: "x" },
      provenance: baseProvenance(),
      idempotencyKey: randomUUID(),
    });
    const archived = await domain.archive(cell.identity.id, {
      reason: "done",
      idempotencyKey: randomUUID(),
    });
    expect(archived.lifecycle.state).toBe("archived");
    const restored = await domain.restore(cell.identity.id, {
      reason: "reactivate",
      idempotencyKey: randomUUID(),
    });
    expect(restored.lifecycle.state).toBe("active");
    const hist = await domain.getHistory(cell.identity.id);
    expect(hist.length).toBe(3);
  });

  it("get returns null for unknown id", async () => {
    expect(await domain.get(randomUUID())).toBeNull();
  });

  it("AAS-54 replay reconstructs identical state", async () => {
    const c1 = await domain.create({
      content: { type: "text", text: "one" },
      provenance: baseProvenance(),
      idempotencyKey: randomUUID(),
    });
    await domain.update(c1.identity.id, {
      content: { type: "text", text: "two" },
      idempotencyKey: randomUUID(),
    });
    await domain.update(c1.identity.id, {
      content: { type: "text", text: "three" },
      idempotencyKey: randomUUID(),
    });
    await domain.archive(c1.identity.id, { idempotencyKey: randomUUID() });

    const expected = await domain.get(c1.identity.id);
    const expectedHist = await domain.getHistory(c1.identity.id);
    const events = store.all();

    domain.clearProjection();
    expect(await domain.get(c1.identity.id)).toBeNull();

    domain.rebuildFromEvents(events);
    const reconstructed = await domain.get(c1.identity.id);
    const reconstructedHist = await domain.getHistory(c1.identity.id);

    expect(reconstructed).toEqual(expected);
    expect(reconstructedHist).toEqual(expectedHist);
  });

  it("idempotent create with same key returns original", async () => {
    const key = randomUUID();
    const a = await domain.create({
      content: { type: "text", text: "same" },
      provenance: baseProvenance(),
      idempotencyKey: key,
    });
    const b = await domain.create({
      content: { type: "text", text: "same" },
      provenance: baseProvenance(),
      idempotencyKey: key,
      memoryId: a.identity.id,
    });
    expect(b.identity.id).toBe(a.identity.id);
    expect(b.currentVersion).toBe(1);
  });
});
