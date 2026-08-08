/**
 * Unit tests for contracts (no DB required).
 */

import { describe, it, expect } from "vitest";
import {
  DomainEventSchema,
  canonicalJson,
  payloadsEqual,
} from "../../packages/contracts/src/index.js";

describe("DomainEventSchema", () => {
  it("accepts a valid DomainEvent", () => {
    const result = DomainEventSchema.safeParse({
      eventId: "550e8400-e29b-41d4-a716-446655440000",
      eventType: "MemoryCreated",
      aggregateId: "550e8400-e29b-41d4-a716-446655440001",
      aggregateType: "Memory",
      aggregateVersion: 1,
      timestamp: "2026-08-08T01:26:00.000Z",
      payload: { content: "hello" },
      idempotencyKey: "cmd-1",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid timestamp format", () => {
    const result = DomainEventSchema.safeParse({
      eventId: "550e8400-e29b-41d4-a716-446655440000",
      eventType: "MemoryCreated",
      aggregateId: "550e8400-e29b-41d4-a716-446655440001",
      aggregateType: "Memory",
      aggregateVersion: 1,
      timestamp: "2026-08-08T01:26:00Z",
      payload: {},
      idempotencyKey: "cmd-1",
    });
    expect(result.success).toBe(false);
  });

  it("rejects aggregateVersion < 1", () => {
    const result = DomainEventSchema.safeParse({
      eventId: "550e8400-e29b-41d4-a716-446655440000",
      eventType: "X",
      aggregateId: "550e8400-e29b-41d4-a716-446655440001",
      aggregateType: "X",
      aggregateVersion: 0,
      timestamp: "2026-08-08T01:26:00.000Z",
      payload: {},
      idempotencyKey: "k",
    });
    expect(result.success).toBe(false);
  });
});

describe("canonicalJson / payloadsEqual", () => {
  it("treats key order as insignificant", () => {
    expect(payloadsEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it("treats null and missing as different", () => {
    expect(canonicalJson({ a: null })).not.toBe(canonicalJson({}));
  });
});
