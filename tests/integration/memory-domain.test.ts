/**
 * Phase 06 integration + AAS-54 replay tests for MemoryDomain.
 * Requires live PostgreSQL (DATABASE_URL) via PostgresEventStore.
 * No skips.
 */

import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { randomUUID } from "node:crypto";
import {
  type MemoryCell,
  type MemoryVersion,
  type Provenance,
  type MemoryContent,
  zeroCognitiveState,
} from "../../packages/contracts/src/index.js";
import {
  createDb,
  migrate,
  type Database,
} from "../../packages/infrastructure/persistence/src/index.js";
import { PostgresEventStore } from "../../packages/infrastructure/eventstore/src/index.js";
import {
  MemoryDomain,
  type CreateMemoryCommand,
  type UpdateMemoryCommand,
  type LifecycleCommand,
} from "../../packages/core/memory/src/index.js";

const DATABASE_URL =
  process.env.DATABASE_URL ??
  "postgres://ailexsi:ailexsi@127.0.0.1:5432/ailexsi";

function ts(): string {
  return new Date().toISOString().replace(/\.\d{3}Z$/, ".000Z");
}

function makeProvenance(overrides: Partial<Provenance> = {}): Provenance {
  return {
    sourceType: "user",
    capturedAt: ts(),
    parentMemoryIds: [],
    evidenceIds: [],
    ...overrides,
  };
}

function makeContent(text = "hello memory"): MemoryContent {
  return {
    type: "text",
    text,
  };
}

describe("MemoryDomain (live EventStore integration + AAS-54 replay)", () => {
  let database: Database;
  let store: PostgresEventStore;
  let domain: MemoryDomain;

  beforeAll(async () => {
    database = createDb(DATABASE_URL);
    await database.client`SELECT 1`;
    await migrate(database.client);
    store = new PostgresEventStore(database);
    domain = new MemoryDomain(store, "phase06-test", "test");
  }, 60_000);

  afterAll(async () => {
    if (database?.client) {
      await database.client.end({ timeout: 5 });
    }
  });

  it("create returns MemoryCell with version 1 and mandatory Provenance", async () => {
    const cmd: CreateMemoryCommand = {
      content: makeContent("create-1"),
      provenance: makeProvenance(),
      idempotencyKey: randomUUID(),
    };
    const cell = await domain.create(cmd);
    expect(cell.currentVersion).toBe(1);
    expect(cell.provenance.sourceType).toBe("user");
    expect(cell.cognitiveState.physicsVersion).toBe("0.1.4");
    expect(cell.lifecycle.state).toBe("active");
    const got = await domain.get(cell.identity.memoryId);
    expect(got).not.toBeNull();
    expect(got!.currentVersion).toBe(1);
  });

  it("rejects create without Provenance (ACS Law 1)", async () => {
    await expect(
      domain.create({
        content: makeContent(),
        // @ts-expect-error intentional missing provenance
        provenance: undefined,
        idempotencyKey: randomUUID(),
      } as CreateMemoryCommand)
    ).rejects.toThrow();
  });

  it("update produces new immutable version", async () => {
    const created = await domain.create({
      content: makeContent("v1"),
      provenance: makeProvenance(),
      idempotencyKey: randomUUID(),
    });
    const updated = await domain.update(created.identity.memoryId, {
      content: makeContent("v2"),
      idempotencyKey: randomUUID(),
      changeReason: "test-update",
    });
    expect(updated.currentVersion).toBe(2);
    const history = await domain.getHistory(created.identity.memoryId);
    expect(history.map((h) => h.version)).toEqual([1, 2]);
    expect(history[0]!.content).toMatchObject({ text: "v1" });
    expect(history[1]!.content).toMatchObject({ text: "v2" });
  });

  it("archive and restore update lifecycle while preserving history", async () => {
    const created = await domain.create({
      content: makeContent("lifecycle"),
      provenance: makeProvenance(),
      idempotencyKey: randomUUID(),
    });
    const archived = await domain.archive(created.identity.memoryId, {
      idempotencyKey: randomUUID(),
      reason: "test-archive",
    });
    expect(archived.lifecycle.state).toBe("archived");
    const restored = await domain.restore(created.identity.memoryId, {
      idempotencyKey: randomUUID(),
      reason: "test-restore",
    });
    expect(restored.lifecycle.state).toBe("active");
    const history = await domain.getHistory(created.identity.memoryId);
    expect(history.length).toBeGreaterThanOrEqual(3);
  });

  it("idempotent create with same key + identical payload returns original", async () => {
    const key = randomUUID();
    const cmd: CreateMemoryCommand = {
      content: makeContent("idem"),
      provenance: makeProvenance(),
      idempotencyKey: key,
    };
    const first = await domain.create(cmd);
    const second = await domain.create(cmd);
    expect(second.identity.memoryId).toBe(first.identity.memoryId);
    expect(second.currentVersion).toBe(1);
  });

  it("AAS-54 replay: create → update → update → archive → clear → rebuild → identical state", async () => {
    const created = await domain.create({
      content: makeContent("replay-v1"),
      provenance: makeProvenance(),
      idempotencyKey: randomUUID(),
    });
    const id = created.identity.memoryId;

    await domain.update(id, {
      content: makeContent("replay-v2"),
      idempotencyKey: randomUUID(),
      changeReason: "u1",
    });
    await domain.update(id, {
      content: makeContent("replay-v3"),
      idempotencyKey: randomUUID(),
      changeReason: "u2",
    });
    await domain.archive(id, {
      idempotencyKey: randomUUID(),
      reason: "archive-for-replay",
    });

    const expectedCell = await domain.get(id);
    const expectedHistory = await domain.getHistory(id);
    expect(expectedCell).not.toBeNull();
    expect(expectedHistory.length).toBe(4);

    // Capture events for this aggregate from the EventStore
    const stream = await store.getByAggregate(id);
    expect(stream.length).toBe(4);

    // Clear projection and rebuild
    domain.clearProjection();
    expect(await domain.get(id)).toBeNull();

    domain.rebuildFromEvents(stream);

    const reconstructed = await domain.get(id);
    const reconstructedHistory = await domain.getHistory(id);

    expect(reconstructed).not.toBeNull();
    expect(reconstructed!.currentVersion).toBe(expectedCell!.currentVersion);
    expect(reconstructed!.lifecycle.state).toBe(expectedCell!.lifecycle.state);
    expect(reconstructed!.content).toEqual(expectedCell!.content);
    expect(reconstructed!.provenance).toEqual(expectedCell!.provenance);
    expect(reconstructedHistory.map((h) => h.version)).toEqual(
      expectedHistory.map((h) => h.version)
    );
    expect(reconstructedHistory.map((h) => h.content)).toEqual(
      expectedHistory.map((h) => h.content)
    );
  });
});
