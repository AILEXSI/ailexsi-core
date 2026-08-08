# AAS – AILEXSI Architecture Specification

## Buch 2 – Canonical Domain Models & Event Contracts

**Version:** 0.3.3 (Replay equality, idempotency unified, explainability)  
**Status:** Normative  
**Dependencies:** ACS 0.1.1, AKP 0.1.3, AKP 0.2.4, AAS 0.1.2

---

## AAS-26 Canonical Model Principle

For every Domain Object there exists **one canonical definition**.  
Independent of TypeScript, Python, PostgreSQL, Neo4j, Qdrant, LLM, Frontend or API Framework.  
No second source of truth is allowed.

---

## AAS-27 Common Types

```ts
type UUID = string;
// UUID v4 generation permitted ONLY at command-creation boundaries,
// before the event is persisted.
// All persistent entity identifiers MUST originate from the canonical event
// or deterministic input.
// Projection replay MUST NEVER generate a new UUID for an existing entity.

type Timestamp = string;
// Canonical: RFC3339 UTC, exactly 3 fractional digits, mandatory Z suffix.
// Example: 2026-08-08T01:26:00.000Z
// No timezone offsets. No leap-second representation.

type Score = number;                   // 0 <= Score <= 1
type Version = number;                 // positive integer
type PhysicsVersion = string;
type FormulaVersion = string;

type SourceType =
  | "user" | "conversation" | "document" | "web"
  | "system" | "agent" | "import" | "sensor" | "event";
```

---

## AAS-28 TemporalMetadata

```ts
interface TemporalMetadata {
  createdAt: Timestamp;
  observedAt: Timestamp;
  validFrom: Timestamp;
  validTo: Timestamp | null;
  confirmedAt: Timestamp;
  deprecatedAt: Timestamp | null;
}
```

---

## AAS-29 Provenance

```ts
interface Provenance {
  sourceType: SourceType;
  sourceId?: string;
  capturedAt: Timestamp;
  parentMemoryIds: UUID[];
  evidenceIds: UUID[];
}
```

---

## AAS-30 Evidence

```ts
interface Evidence {
  id: UUID;
  type: "direct" | "derived" | "corroborating" | "contradicting";
  sourceType: SourceType;
  sourceId?: string;
  excerpt?: string;
  locator?: string;
  capturedAt: Timestamp;
  reliability?: Score;
  independenceGroup?: string;
}
```

**EffectiveReliability:** `e.reliability if present else 0.5`  
`independenceGroup` is upstream immutable. If absent, group = `"unknown"`.

---

## AAS-31 MemoryIdentity

```ts
interface MemoryIdentity {
  id: UUID;
  shortId: string;
  version: Version;
  canonical: boolean;
}
```

---

## AAS-32 MemoryContent (discriminated union)

```ts
type MemoryContent =
  | { type: "text"; text: string; mimeType?: string }
  | { type: "structured"; structuredData: Record<string, unknown> }
  | { type: "document"; storageRef: string; mimeType?: string }
  | { type: "media"; storageRef: string; mimeType?: string }
  | { type: "reference"; storageRef: string };
```

---

## AAS-33..48 Domain types

MemoryContext, MemoryMeaning, Lifecycle, CognitiveStateVector (velocity = rates 1/s not Scores),
MemoryCell, MemoryVersion, RelationRef, RelationType, KnowledgeRelation, TrustAssessment,
IdentityValue/Goal/Role/Principle, IdentitySnapshot, Reflection, Hypothesis, DreamCandidate
(DreamCandidate ≠ Fact), CreativeCandidate, ActionIntent — as previously defined in 0.3.2.

---

## AAS-49 PhysicsCalculation

```ts
interface PhysicsCalculation {
  id: UUID;
  calculationType: string;
  formulaId: string;
  physicsVersion: PhysicsVersion;
  formulaVersion: FormulaVersion;
  parameterSetId: string;
  parameterSetVersion: string;
  parameterSet: Record<string, PhysicsParameter>;
  inputSnapshot: Record<string, unknown>;
  output: Record<string, unknown>;
  timestamp: Timestamp;
  randomSeed?: string;
}
```

Every automatic score MUST be reconstructible from these fields.

---

## AAS-50 DomainEvent + EventEnvelope

```ts
interface DomainEvent<T = unknown> {
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
```

**aggregateVersion rules:**
- First event of an aggregate MUST have aggregateVersion = 1.
- Every subsequent event MUST equal previousAggregateVersion + 1.
- version < expected → duplicate/replay candidate
- version = expected → accepted
- version > expected → ordering violation; reject/quarantine

**idempotencyKey rules (canonical, all documents):**
- same idempotencyKey + identical payload → return original command result, append no new event
- same idempotencyKey + different payload → integrity violation / reject

**UUID generation rule:**
- UUID v4 generation permitted ONLY at command-creation boundaries, before the event is persisted.
- Projection replay MUST NEVER generate a new UUID for an existing entity.

---

## AAS-51 Communication Rule

```text
Commands  → produce Domain Events (write side)
Queries   → use synchronous read Interfaces (read side, no side effects)
```

---

## AAS-52 Kernel Definition

```text
Memory + Provenance + History + Knowledge + Physics + Events + Temporal Model
```

---

## AAS-54 Replay Equality (IDENTICAL STATE)

After `DELETE PROJECTIONS → REPLAY EVENTS`, reconstructed state MUST equal prior state under **canonical equality**:

1. **Object ordering:** maps/objects compared by sorted keys (UTF-8 lexicographic).
2. **Array ordering:** arrays are ordered; order is significant and must match.
3. **Timestamps:** exact RFC3339 string equality (`2026-08-08T01:26:00.000Z`).
4. **Numbers:** IEEE-754 binary64; Scores compared within absolute 1e-6 unless a vector states otherwise.
5. **Identifiers:** exact string equality; Replay MUST NOT create new UUIDs for existing entities.
6. **Nulls:** `null` ≠ missing field; both must match exactly as stored.
7. **Serialization:** canonical JSON (sorted keys, no insignificant whitespace variance in equality test).

Projection replay MUST NEVER generate a new UUID for an existing entity.
All persistent identifiers MUST originate from the canonical event or deterministic input.
