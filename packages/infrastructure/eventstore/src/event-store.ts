/**
 * EventStore interface — AAS-Buch3 + AAS-Buch2 rules.
 * Append-only authority for history.
 */

import type { DomainEvent, EventEnvelope } from "@ailexsi/contracts";

export interface AppendResult {
  /** true when a new event was persisted; false when identical idempotent replay returned existing */
  appended: boolean;
  event: DomainEvent;
  envelope: EventEnvelope;
}

export interface EventStore {
  /**
   * Append a DomainEvent wrapped in an EventEnvelope.
   *
   * Rules (AAS-Buch2):
   * - First event of aggregate MUST have aggregateVersion = 1.
   * - Subsequent MUST equal previous + 1.
   * - same idempotencyKey + identical payload → return original, append no new event.
   * - same idempotencyKey + different payload → IdempotencyConflictError.
   * - Concurrent version conflict → ConcurrencyConflictError.
   */
  append(envelope: EventEnvelope): Promise<AppendResult>;

  /** Current highest aggregateVersion for the aggregate, or 0 if none. */
  getCurrentVersion(aggregateId: string): Promise<number>;

  /** All events for an aggregate, ordered by aggregateVersion ascending (deterministic). */
  getByAggregate(aggregateId: string): Promise<EventEnvelope[]>;

  /**
   * Events in global deterministic order (sequence_id ascending).
   * Optional exclusive afterSequence for replay cursors.
   */
  getStream(options?: {
    afterSequence?: number;
    limit?: number;
  }): Promise<EventEnvelope[]>;

  /** Lookup by eventId. */
  getByEventId(eventId: string): Promise<EventEnvelope | null>;

  /** Lookup by idempotencyKey. */
  getByIdempotencyKey(key: string): Promise<EventEnvelope | null>;
}
