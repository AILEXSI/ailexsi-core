/**
 * DomainEvent + EventEnvelope — AAS-Buch2 AAS-50 (canonical).
 * Field names and semantics are normative. Do not alter.
 */

import { z } from "zod";
import type { UUID, Timestamp, Version } from "./types.js";

export interface DomainEvent<T = unknown> {
  eventId: UUID;
  eventType: string;
  aggregateId: UUID;
  aggregateType: string;
  aggregateVersion: Version;
  timestamp: Timestamp;
  payload: T;
  causationId?: UUID;
  correlationId?: UUID;
  idempotencyKey: string;
}

export interface EventEnvelope<T = unknown> {
  event: DomainEvent<T>;
  schemaVersion: string;
  producer: string;
  environment: "development" | "test" | "production";
}

/** Zod schema for runtime validation of a DomainEvent (payload left as unknown). */
export const DomainEventSchema = z.object({
  eventId: z.string().uuid(),
  eventType: z.string().min(1),
  aggregateId: z.string().uuid(),
  aggregateType: z.string().min(1),
  aggregateVersion: z.number().int().positive(),
  timestamp: z
    .string()
    .regex(
      /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      "Timestamp must be RFC3339 UTC with exactly 3 fractional digits and Z"
    ),
  payload: z.unknown(),
  causationId: z.string().uuid().optional(),
  correlationId: z.string().uuid().optional(),
  idempotencyKey: z.string().min(1),
});

export const EventEnvelopeSchema = z.object({
  event: DomainEventSchema,
  schemaVersion: z.string().min(1),
  producer: z.string().min(1),
  environment: z.enum(["development", "test", "production"]),
});

/**
 * Canonical JSON serialization for payload equality (AAS-Buch2).
 * Sorted keys, exact Timestamp strings, null ≠ missing.
 */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(value, (_key, v) => {
    if (v !== null && typeof v === "object" && !Array.isArray(v)) {
      return Object.keys(v as Record<string, unknown>)
        .sort()
        .reduce<Record<string, unknown>>((acc, k) => {
          acc[k] = (v as Record<string, unknown>)[k];
          return acc;
        }, {});
    }
    return v;
  });
}

export function payloadsEqual(a: unknown, b: unknown): boolean {
  return canonicalJson(a) === canonicalJson(b);
}
