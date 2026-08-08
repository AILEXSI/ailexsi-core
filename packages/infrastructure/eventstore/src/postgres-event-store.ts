/**
 * PostgreSQL EventStore implementation.
 * Enforces AAS-Buch2 aggregateVersion + idempotencyKey rules transactionally.
 */

import { eq, gt, asc, sql } from "drizzle-orm";
import type { DomainEvent, EventEnvelope } from "@ailexsi/contracts";
import {
  DomainEventSchema,
  payloadsEqual,
  ConcurrencyConflictError,
  IdempotencyConflictError,
  OrderingViolationError,
  EventValidationError,
} from "@ailexsi/contracts";
import type { Database } from "@ailexsi/persistence";
import { events } from "@ailexsi/persistence";
import type { AppendResult, EventStore } from "./event-store.js";

function rowToEnvelope(row: typeof events.$inferSelect): EventEnvelope {
  const event: DomainEvent = {
    eventId: row.eventId,
    eventType: row.eventType,
    aggregateId: row.aggregateId,
    aggregateType: row.aggregateType,
    aggregateVersion: row.aggregateVersion,
    timestamp: row.timestamp,
    payload: row.payload,
    causationId: row.causationId ?? undefined,
    correlationId: row.correlationId ?? undefined,
    idempotencyKey: row.idempotencyKey,
  };
  return {
    event,
    schemaVersion: row.schemaVersion,
    producer: row.producer,
    environment: row.environment as EventEnvelope["environment"],
  };
}

export class PostgresEventStore implements EventStore {
  constructor(private readonly database: Database) {}

  async append(envelope: EventEnvelope): Promise<AppendResult> {
    const parsed = DomainEventSchema.safeParse(envelope.event);
    if (!parsed.success) {
      throw new EventValidationError(
        `Invalid DomainEvent: ${parsed.error.message}`
      );
    }
    if (!["development", "test", "production"].includes(envelope.environment)) {
      throw new EventValidationError(
        `Invalid environment: ${envelope.environment}`
      );
    }

    const { event } = envelope;
    const db = this.database.db;

    const existingByKey = await db
      .select()
      .from(events)
      .where(eq(events.idempotencyKey, event.idempotencyKey))
      .limit(1);

    if (existingByKey.length > 0) {
      const existing = rowToEnvelope(existingByKey[0]!);
      if (payloadsEqual(existing.event.payload, event.payload)) {
        return { appended: false, event: existing.event, envelope: existing };
      }
      throw new IdempotencyConflictError(event.idempotencyKey);
    }

    const currentVersion = await this.getCurrentVersion(event.aggregateId);
    const expectedNext = currentVersion + 1;

    if (event.aggregateVersion !== expectedNext) {
      if (event.aggregateVersion <= currentVersion) {
        throw new ConcurrencyConflictError(
          event.aggregateId,
          event.aggregateVersion,
          currentVersion
        );
      }
      throw new OrderingViolationError(
        event.aggregateId,
        event.aggregateVersion,
        expectedNext
      );
    }

    try {
      await db.insert(events).values({
        eventId: event.eventId,
        eventType: event.eventType,
        aggregateId: event.aggregateId,
        aggregateType: event.aggregateType,
        aggregateVersion: event.aggregateVersion,
        timestamp: event.timestamp,
        payload: event.payload as object,
        causationId: event.causationId ?? null,
        correlationId: event.correlationId ?? null,
        idempotencyKey: event.idempotencyKey,
        schemaVersion: envelope.schemaVersion,
        producer: envelope.producer,
        environment: envelope.environment,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes("events_aggregate_version_uidx")) {
        const actual = await this.getCurrentVersion(event.aggregateId);
        throw new ConcurrencyConflictError(
          event.aggregateId,
          event.aggregateVersion,
          actual
        );
      }
      if (msg.includes("events_idempotency_key_uidx")) {
        const again = await this.getByIdempotencyKey(event.idempotencyKey);
        if (again && payloadsEqual(again.event.payload, event.payload)) {
          return { appended: false, event: again.event, envelope: again };
        }
        throw new IdempotencyConflictError(event.idempotencyKey);
      }
      throw err;
    }

    return { appended: true, event, envelope };
  }

  async getCurrentVersion(aggregateId: string): Promise<number> {
    const db = this.database.db;
    const rows = await db
      .select({
        maxVersion: sql<number>`coalesce(max(${events.aggregateVersion}), 0)`,
      })
      .from(events)
      .where(eq(events.aggregateId, aggregateId));
    return Number(rows[0]?.maxVersion ?? 0);
  }

  async getByAggregate(aggregateId: string): Promise<EventEnvelope[]> {
    const db = this.database.db;
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.aggregateId, aggregateId))
      .orderBy(asc(events.aggregateVersion));
    return rows.map(rowToEnvelope);
  }

  async getStream(options?: {
    afterSequence?: number;
    limit?: number;
  }): Promise<EventEnvelope[]> {
    const db = this.database.db;
    const after = options?.afterSequence ?? 0;
    const limit = options?.limit ?? 1000;

    const rows = await db
      .select()
      .from(events)
      .where(gt(events.sequenceId, after))
      .orderBy(asc(events.sequenceId))
      .limit(limit);
    return rows.map(rowToEnvelope);
  }

  async getByEventId(eventId: string): Promise<EventEnvelope | null> {
    const db = this.database.db;
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.eventId, eventId))
      .limit(1);
    return rows[0] ? rowToEnvelope(rows[0]) : null;
  }

  async getByIdempotencyKey(key: string): Promise<EventEnvelope | null> {
    const db = this.database.db;
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.idempotencyKey, key))
      .limit(1);
    return rows[0] ? rowToEnvelope(rows[0]) : null;
  }
}
