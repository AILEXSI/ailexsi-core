# AILEXSI Normative Patch 0.1

**Status:** Normative  
**Date:** 2026-08-08  
**Purpose:** Close the 8 blockers identified in External Specification Audit 0.1  
**Rule:** These patches override previous contradictory statements in lower-priority documents.

---

## PATCH D – TemporalMetadata aligned with ACS Law 7

All six fields are **required** on every Memory Cell. `validTo` may be `null` to express “unknown / open-ended”.

```ts
interface TemporalMetadata {
  createdAt: Timestamp;          // required
  observedAt: Timestamp;         // required (use createdAt if identical)
  validFrom: Timestamp;          // required
  validTo: Timestamp | null;     // required field, value may be null
  confirmedAt: Timestamp;        // required (initially = createdAt)
  deprecatedAt: Timestamp | null; // required field, value may be null
}
```

---

## PATCH G – Provenance Source Types unified

```ts
type SourceType =
  | "user" | "conversation" | "document" | "web"
  | "system" | "agent" | "import" | "sensor" | "event";
```

---

## PATCH E – Communication Model (Query vs Event)

```text
Commands  → produce Domain Events (write side)
Queries   → use synchronous read Interfaces (read side, no side effects)
```

All state changes travel exclusively through Domain Events + Event Bus.

---

## PATCH F – DomainEvent + EventEnvelope unified

`DomainEvent` (with mandatory `idempotencyKey` and `aggregateVersion`) is what is stored.  
`EventEnvelope` is the optional transport wrapper.

---

## PATCH H – Physics Gate vs Build Order

```text
01 Bootstrap
02 Contracts
03 Physics Conformance Suite          ← HARD GATE
04–20 only after Physics is green
```

---

## Status of large patches

- **PATCH A** Canonical Domain Models → applied in AAS-Buch2.md v0.3
- **PATCH B** AKP 0.1 formalization → applied in AKP-0.1.md v0.1.1
- **PATCH C** AKP 0.2 formalization → applied in AKP-0.2.md v0.2.1
