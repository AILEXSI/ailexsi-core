/**
 * Canonical Event Store errors — derived from AAS-Buch2 aggregateVersion + idempotency rules.
 */

export class ConcurrencyConflictError extends Error {
  readonly code = "CONCURRENCY_CONFLICT" as const;
  constructor(
    public readonly aggregateId: string,
    public readonly expectedVersion: number,
    public readonly actualVersion: number | null
  ) {
    super(
      `ConcurrencyConflict: aggregate ${aggregateId} expected version ${expectedVersion}, actual ${actualVersion}`
    );
    this.name = "ConcurrencyConflictError";
  }
}

export class IdempotencyConflictError extends Error {
  readonly code = "IDEMPOTENCY_CONFLICT" as const;
  constructor(public readonly idempotencyKey: string) {
    super(
      `IdempotencyConflict: key ${idempotencyKey} already exists with a different payload`
    );
    this.name = "IdempotencyConflictError";
  }
}

export class OrderingViolationError extends Error {
  readonly code = "ORDERING_VIOLATION" as const;
  constructor(
    public readonly aggregateId: string,
    public readonly attemptedVersion: number,
    public readonly expectedVersion: number
  ) {
    super(
      `OrderingViolation: aggregate ${aggregateId} attempted version ${attemptedVersion}, expected ${expectedVersion}`
    );
    this.name = "OrderingViolationError";
  }
}

export class EventValidationError extends Error {
  readonly code = "EVENT_VALIDATION" as const;
  constructor(message: string) {
    super(message);
    this.name = "EventValidationError";
  }
}
