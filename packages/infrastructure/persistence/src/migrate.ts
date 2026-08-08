/**
 * Minimal migration runner for the Event Store schema.
 * Creates the events table and required unique indexes.
 * Idempotent: safe to run multiple times.
 */

import type { Sql } from "postgres";

const MIGRATION_SQL = `
CREATE TABLE IF NOT EXISTS events (
  sequence_id       INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  event_id          UUID NOT NULL UNIQUE,
  event_type        TEXT NOT NULL,
  aggregate_id      UUID NOT NULL,
  aggregate_type    TEXT NOT NULL,
  aggregate_version INTEGER NOT NULL,
  timestamp         TEXT NOT NULL,
  payload           JSONB NOT NULL,
  causation_id      UUID,
  correlation_id    UUID,
  idempotency_key   TEXT NOT NULL,
  schema_version    TEXT NOT NULL,
  producer          TEXT NOT NULL,
  environment       TEXT NOT NULL,
  stored_at         TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS events_aggregate_version_uidx
  ON events (aggregate_id, aggregate_version);

CREATE UNIQUE INDEX IF NOT EXISTS events_idempotency_key_uidx
  ON events (idempotency_key);

CREATE INDEX IF NOT EXISTS events_aggregate_id_idx
  ON events (aggregate_id);

CREATE INDEX IF NOT EXISTS events_event_type_idx
  ON events (event_type);
`;

export async function migrate(client: Sql): Promise<void> {
  await client.unsafe(MIGRATION_SQL);
}
