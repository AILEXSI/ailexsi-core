/**
 * Unit tests for Phase 06 Memory contracts (AAS-Buch2 0.3.4).
 * No DB required.
 */

import { describe, it, expect } from "vitest";
import {
  ProvenanceSchema,
  TemporalMetadataSchema,
  MemoryCellSchema,
  MemoryVersionSchema,
  zeroCognitiveState,
  MemoryContentSchema,
  LifecycleMetadataSchema,
} from "../../packages/contracts/src/index.js";

const TS = "2026-08-08T13:00:00.000Z";

describe("ProvenanceSchema (ACS Law 1)", () => {
  it("accepts valid provenance", () => {
    const r = ProvenanceSchema.safeParse({
      sourceType: "user",
      capturedAt: TS,
      parentMemoryIds: [],
      evidenceIds: [],
    });
    expect(r.success).toBe(true);
  });

  it("rejects missing sourceType", () => {
    const r = ProvenanceSchema.safeParse({
      capturedAt: TS,
      parentMemoryIds: [],
      evidenceIds: [],
    });
    expect(r.success).toBe(false);
  });

  it("rejects invalid sourceType", () => {
    const r = ProvenanceSchema.safeParse({
      sourceType: "llm",
      capturedAt: TS,
      parentMemoryIds: [],
      evidenceIds: [],
    });
    expect(r.success).toBe(false);
  });
});

describe("TemporalMetadataSchema (ACS Law 7)", () => {
  it("accepts valid temporal metadata", () => {
    const r = TemporalMetadataSchema.safeParse({
      createdAt: TS,
      observedAt: TS,
      validFrom: TS,
      validTo: null,
      confirmedAt: TS,
      deprecatedAt: null,
    });
    expect(r.success).toBe(true);
  });

  it("rejects validFrom > validTo", () => {
    const r = TemporalMetadataSchema.safeParse({
      createdAt: TS,
      observedAt: TS,
      validFrom: "2026-08-09T00:00:00.000Z",
      validTo: "2026-08-08T00:00:00.000Z",
      confirmedAt: TS,
      deprecatedAt: null,
    });
    expect(r.success).toBe(false);
  });

  it("rejects non-canonical timestamp", () => {
    const r = TemporalMetadataSchema.safeParse({
      createdAt: "2026-08-08T13:00:00Z",
      observedAt: TS,
      validFrom: TS,
      validTo: null,
      confirmedAt: TS,
      deprecatedAt: null,
    });
    expect(r.success).toBe(false);
  });
});

describe("zeroCognitiveState (Phase 06 placeholder)", () => {
  it("returns reconstructible zeros with AKP versions", () => {
    const csv = zeroCognitiveState(TS);
    expect(csv.mass).toBe(0);
    expect(csv.energy).toBe(0);
    expect(csv.physicsVersion).toBe("0.1.4");
    expect(csv.formulaVersion).toBe("0.2.5");
    expect(csv.calculatedAt).toBe(TS);
  });
});

describe("MemoryContentSchema", () => {
  it("accepts text content", () => {
    expect(
      MemoryContentSchema.safeParse({ type: "text", text: "hello" }).success
    ).toBe(true);
  });

  it("accepts structured content", () => {
    expect(
      MemoryContentSchema.safeParse({
        type: "structured",
        structuredData: { a: 1 },
      }).success
    ).toBe(true);
  });
});

describe("LifecycleMetadataSchema", () => {
  it("accepts active state", () => {
    expect(
      LifecycleMetadataSchema.safeParse({
        state: "active",
        changedAt: TS,
      }).success
    ).toBe(true);
  });

  it("rejects unknown state", () => {
    expect(
      LifecycleMetadataSchema.safeParse({
        state: "deleted",
        changedAt: TS,
      }).success
    ).toBe(false);
  });
});

describe("MemoryCellSchema / MemoryVersionSchema smoke", () => {
  const baseProvenance = {
    sourceType: "user" as const,
    capturedAt: TS,
    parentMemoryIds: [] as string[],
    evidenceIds: [] as string[],
  };
  const baseTimestamps = {
    createdAt: TS,
    observedAt: TS,
    validFrom: TS,
    validTo: null,
    confirmedAt: TS,
    deprecatedAt: null,
  };
  const baseLifecycle = { state: "active" as const, changedAt: TS };

  it("accepts a minimal valid MemoryCell", () => {
    const cell = {
      identity: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        shortId: "m1",
        version: 1,
        canonical: true,
      },
      content: { type: "text" as const, text: "hello" },
      context: {},
      provenance: baseProvenance,
      evidence: [],
      lifecycle: baseLifecycle,
      timestamps: baseTimestamps,
      cognitiveState: zeroCognitiveState(TS),
      relationRefs: [],
      currentVersion: 1,
    };
    expect(MemoryCellSchema.safeParse(cell).success).toBe(true);
  });

  it("rejects MemoryCell without provenance", () => {
    const cell = {
      identity: {
        id: "550e8400-e29b-41d4-a716-446655440000",
        shortId: "m1",
        version: 1,
        canonical: true,
      },
      content: { type: "text" as const, text: "hello" },
      context: {},
      evidence: [],
      lifecycle: baseLifecycle,
      timestamps: baseTimestamps,
      cognitiveState: zeroCognitiveState(TS),
      relationRefs: [],
      currentVersion: 1,
    };
    expect(MemoryCellSchema.safeParse(cell).success).toBe(false);
  });

  it("accepts a minimal valid MemoryVersion", () => {
    const ver = {
      memoryId: "550e8400-e29b-41d4-a716-446655440000",
      version: 1,
      content: { type: "text" as const, text: "hello" },
      context: {},
      provenance: baseProvenance,
      evidence: [],
      timestamps: baseTimestamps,
      createdAt: TS,
      createdBy: "test",
    };
    expect(MemoryVersionSchema.safeParse(ver).success).toBe(true);
  });
});
