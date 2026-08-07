# AAS – AILEXSI Architecture Specification

## Buch 2 – Canonical Domain Models & Event Contracts

**Version:** 0.2  
**Status:** Normative Draft  
**Dependencies:** ACS 0.1, AKP 0.2, AAS 0.1

---

## AAS-26 Canonical Model Principle

For every Domain Object there exists **one canonical definition**.  
This definition is independent of TypeScript, Python, PostgreSQL, Neo4j, Qdrant, LLM, Frontend or API Framework.

Implementations are generated from the canonical definition.

---

## AAS-27 Common Types

- Timestamps: **ISO-8601 UTC**
- IDs: **UUID v4**
- Versions: positive integer
- Scores: `float` in the interval `[0, 1]`

```ts
type UUID = string;
type Timestamp = string;          // ISO-8601 UTC
type Score = number;              // 0 <= Score <= 1
type Version = number;
type PhysicsVersion = string;
type FormulaVersion = string;
```

---

## AAS-28 TemporalMetadata

```ts
interface TemporalMetadata {
  createdAt: Timestamp;
  observedAt?: Timestamp;
  validFrom?: Timestamp;
  validTo?: Timestamp | null;     // null = unknown
  confirmedAt?: Timestamp;
  deprecatedAt?: Timestamp;
}
```

**Invariants**
- `validFrom <= validTo` (if both set)
- `confirmedAt >= createdAt`
- `deprecatedAt >= createdAt`
- Uncertainty is stored as `null`, never as a fantasy date.

---

## AAS-29 – AAS-48 Key Domain Models

(See full definitions in conversation history / previous AAS Buch 2 draft.)

Core objects that must exist as canonical contracts:

- `MemoryIdentity`
- `MemoryContent`
- `MemoryContext`
- `MemoryMeaning`
- `Evidence`
- `Provenance` (Invariant: may not be empty – ACS Law 1)
- `LifecycleState` + `LifecycleMetadata`
- `CognitiveStateVector` (Velocity is **not** restricted to [0,1])
- `MemoryCell`
- `MemoryVersion` (Cells are never overwritten; current Cell = Projection of Versions)
- `RelationRef`
- `RelationType` (supports, contradicts, extends, …)
- `KnowledgeRelation` (LLM proposals start as `status = "hypothesis"`)
- `TrustAssessment`
- `IdentitySnapshot`
- `Reflection`
- `Hypothesis`
- `DreamCandidate` (**DreamCandidate ≠ Fact**)
- `CreativeCandidate`
- `ActionIntent`
- `PhysicsCalculation` + `PhysicsParameter`
- `DomainEvent` + `EventEnvelope`

---

## AAS-50 – AAS-61 Event & CQRS Rules

- Events of the same Aggregate must be strictly ordered.
- Every Event possesses a unique `idempotencyKey`.
- Events reference their cause via `causationId`.
- Command ≠ Event
- Query changes nothing
- Command → Event → Projection → Query (CQRS)

---

## AAS-62 First Canonical Flow

```text
USER INPUT
   ↓
CreateMemoryCommand
   ↓
Memory Context (Provenance + Evidence + Temporal)
   ↓
MemoryCreated
   ├── Knowledge
   ├── Trust
   ├── Retrieval Index
   └── AKP → Cognitive State → Event Store
```

Later derivations (RelationProposed → TrustAssessment → Reflection → DreamCandidate → Hypothesis) require explicit human or authorized decision before becoming permanent knowledge.

---

## AAS-63 Kernel Definition

The AILEXSI Kernel is:

```text
Memory + Provenance + History + Knowledge + Physics + Events + Temporal Model
```

Everything else (LLM, Vector DB, Graph DB, UI, Cloud) is replaceable.
