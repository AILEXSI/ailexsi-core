/**
 * Minimal Event Store schema — maps 1:1 to AAS-Buch2 DomainEvent + EventEnvelope metadata.
 * No Memory Domain tables (Phase 06). Append-only by design (no UPDATE/DELETE grants in app).
 */

import {
  pgTable,
  uuid,
  text,
  integer,
  jsonb,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";

/**
 * events — append-only store of DomainEvents.
 *
 * Uniqueness:
 * - (aggregate_id, aggregate_version) unique → enforces aggregateVersion ordering
 * - idempotency_key unique → enforces global idempotencyKey uniqueness
 */
export const events = pgTable(
  "events",
  {
    sequenceId: integer("sequence_id").primaryKey().generatedAlwaysAsIdentity(),
    eventId: uuid("event_id").notNull().unique(),
    eventType: text("event_type").notNull(),
    aggregateId: uuid("aggregate_id").notNull(),
    aggregateType: text("aggregate_type").notNull(),
    aggregateVersion: integer("aggregate_version").notNull(),
    timestamp: text("timestamp").notNull(),
    payload: jsonb("payload").notNull(),
    causationId: uuid("causation_id"),
    correlationId: uuid("correlation_id"),
    idempotencyKey: text("idempotency_key").notNull(),
    schemaVersion: text("schema_version").notNull(),
    producer: text("producer").notNull(),
    environment: text("environment").notNull(),
    storedAt: timestamp("stored_at", { withTimezone: true, mode: "string" })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("events_aggregate_version_uidx").on(
      t.aggregateId,
      t.aggregateVersion
    ),
    uniqueIndex("events_idempotency_key_uidx").on(t.idempotencyKey),
    index("events_aggregate_id_idx").on(t.aggregateId),
    index("events_event_type_idx").on(t.eventType),
  ]
);

export type EventRow = typeof events.$inferSelect;
export type NewEventRow = typeof events.$inferInsert;
