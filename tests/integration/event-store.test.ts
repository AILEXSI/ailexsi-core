/**
 * Phase 05 integration tests — Event Store against real PostgreSQL.
 * Acceptance: ALL tests must run against live Postgres. No skips.
 * Requires DATABASE_URL (default: postgres://ailexsi:ailexsi@127.0.0.1:5432/ailexsi)
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { randomUUID } from "node:crypto";
import {
  type DomainEvent,
  type EventEnvelope,
  ConcurrencyConflictError,
  IdempotencyConflictError,
  OrderingViolationError,
} from "../../packages/contracts/src/index.js";
import {
  createDb,
  migrate,
  type Database,
} from "../../packages/infrastructure/persistence/src/index.js";
import { PostgresEventStore } from "../../packages/infrastructure/eventstore/src/index.js";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://ailexsi:ailexsi@127.0.0.1:5432/ailexsi";

function ts(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

function makeEnvelope(
  overrides: Partial<DomainEvent> & {
    aggregateId?: string;
    aggregateVersion?: number;
    idempotencyKey?: string;
    payload?: unknown;
  } = {}
): EventEnvelope {
  const event: DomainEvent = {
    eventId: overrides.eventId ?? randomUUID(),
    eventType: overrides.eventType ?? "TestEvent",
    aggregateId: overrides.aggregateId ?? randomUUID(),
    aggregateType: overrides.aggregateType ?? "TestAggregate",
    aggregateVersion: overrides.aggregateVersion ?? 1,
    timestamp: overrides.timestamp ?? ts(),
    payload: overrides.payload ?? { value: 1 },
    causationId: overrides.causationId,
    correlationId: overrides.correlationId,
    idempotencyKey: overrides.idempotencyKey ?? randomUUID(),
  };
  return {
    event,
    schemaVersion: "0.1.0",
    producer: "phase05-acceptance",
    environment: "test",
  };
}

describe("PostgresEventStore (live PostgreSQL acceptance)", () => {
  let database: Database;
  let store: PostgresEventStore;

  beforeAll(async () => {
    database = createDb(DATABASE_URL);
    // Fail hard if DB unreachable — no skip
    await database.client`SELECT 1`;
    await migrate(database.client);
    store = new PostgresEventStore(database);
  }, 60_000);

  afterAll(async () => {
    if (database?.client) {
      await database.client.end({ timeout: 5 });
    }
  });

  it("migration creates events table on clean database", async () => {
    const rows = await database.client`
      SELECT column_name FROM information_schema.columns
      WHERE table_name = 'events'
      ORDER BY ordinal_position
    `;
    const cols = rows.map((r: { column_name: string }) => r.column_name);
    expect(cols).toContain("event_id");
    expect(cols).toContain("aggregate_id");
    expect(cols).toContain("aggregate_version");
    expect(cols).toContain("idempotency_key");
    expect(cols).toContain("payload");
    expect(cols).toContain("sequence_id");
  });

  it("appends first event with aggregateVersion = 1", async () => {
    const env = makeEnvelope({ aggregateVersion: 1 });
    const result = await store.append(env);
    expect(result.appended).toBe(true);
    expect(result.event.eventId).toBe(env.event.eventId);
    expect(result.event.aggregateVersion).toBe(1);
    expect(await store.getCurrentVersion(env.event.aggregateId)).toBe(1);
  });

  it("appends version 2 after version 1", async () => {
    const aggregateId = randomUUID();
    await store.append(makeEnvelope({ aggregateId, aggregateVersion: 1 }));
    const r2 = await store.append(
      makeEnvelope({ aggregateId, aggregateVersion: 2, payload: { n: 2 } })
    );
    expect(r2.appended).toBe(true);
    expect(r2.event.aggregateVersion).toBe(2);
    expect(await store.getCurrentVersion(aggregateId)).toBe(2);
  });

  it("rejects version gap (ordering violation)", async () => {
    const aggregateId = randomUUID();
    await store.append(makeEnvelope({ aggregateId, aggregateVersion: 1 }));
    await expect(
      store.append(makeEnvelope({ aggregateId, aggregateVersion: 3 }))
    ).rejects.toMatchObject({ code: "ORDERING_VIOLATION" });
  });

  it("rejects stale version (concurrency conflict)", async () => {
    const aggregateId = randomUUID();
    await store.append(makeEnvelope({ aggregateId, aggregateVersion: 1 }));
    await expect(
      store.append(makeEnvelope({ aggregateId, aggregateVersion: 1 }))
    ).rejects.toMatchObject({ code: "CONCURRENCY_CONFLICT" });
  });

  it("same idempotencyKey + identical payload returns original, no duplicate", async () => {
    const key = randomUUID();
    const aggregateId = randomUUID();
    const payload = { n: 42 };
    const first = makeEnvelope({
      aggregateId,
      aggregateVersion: 1,
      idempotencyKey: key,
      payload,
    });
    const r1 = await store.append(first);
    expect(r1.appended).toBe(true);

    const second = makeEnvelope({
      aggregateId,
      aggregateVersion: 1,
      idempotencyKey: key,
      payload,
    });
    const r2 = await store.append(second);
    expect(r2.appended).toBe(false);
    expect(r2.event.eventId).toBe(first.event.eventId);
    expect(await store.getCurrentVersion(aggregateId)).toBe(1);
  });

  it("same idempotencyKey + different payload is integrity violation", async () => {
    const key = randomUUID();
    await store.append(
      makeEnvelope({
        aggregateId: randomUUID(),
        aggregateVersion: 1,
        idempotencyKey: key,
        payload: { a: 1 },
      })
    );
    await expect(
      store.append(
        makeEnvelope({
          aggregateId: randomUUID(),
          aggregateVersion: 1,
          idempotencyKey: key,
          payload: { a: 2 },
        })
      )
    ).rejects.toMatchObject({ code: "IDEMPOTENCY_CONFLICT" });
  });

  it("eventId uniqueness is enforced", async () => {
    const eventId = randomUUID();
    const aggregateId = randomUUID();
    await store.append(
      makeEnvelope({ eventId, aggregateId, aggregateVersion: 1 })
    );
    await expect(
      store.append(
        makeEnvelope({
          eventId,
          aggregateId: randomUUID(),
          aggregateVersion: 1,
          idempotencyKey: randomUUID(),
        })
      )
    ).rejects.toThrow();
  });

  it("getByAggregate returns ordered stream by aggregateVersion", async () => {
    const aggregateId = randomUUID();
    await store.append(
      makeEnvelope({ aggregateId, aggregateVersion: 1, payload: { v: 1 } })
    );
    await store.append(
      makeEnvelope({ aggregateId, aggregateVersion: 2, payload: { v: 2 } })
    );
    await store.append(
      makeEnvelope({ aggregateId, aggregateVersion: 3, payload: { v: 3 } })
    );
    const stream = await store.getByAggregate(aggregateId);
    expect(stream.map((e) => e.event.aggregateVersion)).toEqual([1, 2, 3]);
    expect(stream.map((e) => (e.event.payload as { v: number }).v)).toEqual([
      1, 2, 3,
    ]);
  });

  it("getStream returns deterministic global sequence order", async () => {
    const a = randomUUID();
    const b = randomUUID();
    await store.append(makeEnvelope({ aggregateId: a, aggregateVersion: 1 }));
    await store.append(makeEnvelope({ aggregateId: b, aggregateVersion: 1 }));
    await store.append(makeEnvelope({ aggregateId: a, aggregateVersion: 2 }));
    const stream1 = await store.getStream({ limit: 500 });
    const stream2 = await store.getStream({ limit: 500 });
    expect(stream2.map((e) => e.event.eventId)).toEqual(
      stream1.map((e) => e.event.eventId)
    );
    expect(stream1.length).toBeGreaterThanOrEqual(3);
  });

  it("getByEventId returns the event", async () => {
    const env = makeEnvelope({ aggregateVersion: 1 });
    await store.append(env);
    const found = await store.getByEventId(env.event.eventId);
    expect(found).not.toBeNull();
    expect(found!.event.eventId).toBe(env.event.eventId);
    expect(found!.event.idempotencyKey).toBe(env.event.idempotencyKey);
  });

  it("getByIdempotencyKey returns the event", async () => {
    const env = makeEnvelope({ aggregateVersion: 1 });
    await store.append(env);
    const found = await store.getByIdempotencyKey(env.event.idempotencyKey);
    expect(found).not.toBeNull();
    expect(found!.event.eventId).toBe(env.event.eventId);
  });

  it("append-only invariant: no update/delete API on EventStore", async () => {
    expect(typeof (store as unknown as { update?: unknown }).update).toBe(
      "undefined"
    );
    expect(typeof (store as unknown as { delete?: unknown }).delete).toBe(
      "undefined"
    );
    expect(typeof store.append).toBe("function");
  });
});
