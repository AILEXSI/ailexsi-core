# AAS – AILEXSI Architecture Specification

## Buch 2 – Canonical Domain Models & Event Contracts

**Version:** 0.3 (Normative Patch 0.1 applied)  
**Status:** Normative  
**Dependencies:** ACS 0.1, AKP 0.2, AAS 0.1, Normative-Patch-0.1

---

## AAS-26 Canonical Model Principle

For every Domain Object there exists **one canonical definition**.  
This definition is independent of TypeScript, Python, PostgreSQL, Neo4j, Qdrant, LLM, Frontend or API Framework.

Implementations are generated from the canonical definition.  
No second “source of truth” is allowed.

---

## AAS-27 Common Types

```ts
type UUID = string;                    // UUID v4
type Timestamp = string;               // ISO-8601 UTC
type Score = number;                   // 0 <= Score <= 1
type Version = number;                 // positive integer
type PhysicsVersion = string;
type FormulaVersion = string;

type SourceType =
  | "user"
  | "conversation"
  | "document"
  | "web"
  | "system"
  | "agent"
  | "import"
  | "sensor"
  | "event";
```

---

## AAS-28 TemporalMetadata (PATCH D)

Aligned with ACS Law 7. All fields are required. `validTo` and `deprecatedAt` may be `null`.

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

**Invariants**
- `validFrom <= validTo` when `validTo !== null`
- `confirmedAt >= createdAt`
- `deprecatedAt >= createdAt` when not null
- Uncertainty is expressed by `null`, never by fantasy dates

---

## AAS-29 Provenance (PATCH G)

```ts
interface Provenance {
  sourceType: SourceType;
  sourceId?: string;
  capturedAt: Timestamp;
  parentMemoryIds: UUID[];
  evidenceIds: UUID[];
}
```

**Invariant (ACS Law 1):** Provenance must never be empty / missing.

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

## AAS-32 MemoryContent

```ts
interface MemoryContent {
  type: "text" | "structured" | "document" | "media" | "reference";
  text?: string;
  structuredData?: Record<string, unknown>;
  mimeType?: string;
  storageRef?: string;
}
```

---

## AAS-33 MemoryContext

```ts
interface MemoryContext {
  domain?: string;
  project?: string;
  location?: string;
  participants?: string[];
  tags?: string[];
  sessionId?: UUID;
  parentContextId?: UUID;
}
```

---

## AAS-34 MemoryMeaning

```ts
interface MemoryMeaning {
  summary?: string;
  concepts?: string[];
  themes?: string[];
  interpretation?: string;
  generatedBy?: string;
  generatedAt?: Timestamp;
}
```

---

## AAS-35 Lifecycle

```ts
type LifecycleState =
  | "active" | "dormant" | "archived" | "dream_candidate" | "hypothesis";

interface LifecycleMetadata {
  state: LifecycleState;
  changedAt: Timestamp;
  reason?: string;
}
```

---

## AAS-36 CognitiveStateVector

```ts
interface CognitiveStateVector {
  mass: Score;
  energy: Score;
  gravity: Score;
  entropy: Score;
  velocity: { mass: number; resonance: number; temperature: number; };
  confidence: Score;
  resonance: Score;
  temperature: Score;
  novelty: Score;
  calculatedAt: Timestamp;
  physicsVersion: PhysicsVersion;
  formulaVersion: FormulaVersion;
}
```

Note: This is a **projection**. The authoritative calculation lives in `PhysicsCalculation`.

---

## AAS-37 MemoryCell (canonical)

```ts
interface MemoryCell {
  identity: MemoryIdentity;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  lifecycle: LifecycleMetadata;
  timestamps: TemporalMetadata;
  cognitiveState: CognitiveStateVector;
  relationRefs: RelationRef[];
  currentVersion: Version;
}
```

---

## AAS-38 MemoryVersion

```ts
interface MemoryVersion {
  memoryId: UUID;
  version: Version;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  evidence: Evidence[];
  timestamps: TemporalMetadata;
  createdAt: Timestamp;
  createdBy: string;
  previousVersion?: Version;
  changeReason?: string;
}
```

---

## AAS-39 RelationRef

```ts
interface RelationRef {
  relationId: UUID;
  targetMemoryId: UUID;
  type: RelationType;
  direction: "outgoing" | "incoming";
}
```

---

## AAS-40 RelationType

```ts
type RelationType =
  | "supports" | "contradicts" | "extends" | "derived_from" | "inspired_by"
  | "causes" | "caused_by" | "references" | "answers" | "asks"
  | "belongs_to" | "part_of" | "depends_on" | "duplicates"
  | "similar_to" | "related_to";
```

---

## AAS-41 KnowledgeRelation

```ts
interface KnowledgeRelation {
  id: UUID;
  source: UUID;
  target: UUID;
  type: RelationType;
  strength: Score;
  evidenceIds: UUID[];
  provenance: Provenance;
  status: "hypothesis" | "proposed" | "accepted" | "rejected" | "deprecated";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  version: Version;
}
```

---

## AAS-42 TrustAssessment

```ts
interface TrustAssessment {
  id: UUID;
  subjectId: UUID;
  evidenceStrength: Score;
  sourceDiversity: Score;
  contradiction: Score;
  confidence: Score;
  methodology: string;
  physicsVersion?: PhysicsVersion;
  createdAt: Timestamp;
}
```

---

## AAS-43 IdentitySnapshot

```ts
interface IdentitySnapshot {
  userId: UUID;
  values: IdentityValue[];
  goals: Goal[];
  roles: Role[];
  mission?: string;
  principles: Principle[];
  referencedMemoryIds: UUID[];
  version: Version;
  createdAt: Timestamp;
}
```

---

## AAS-44 Reflection

```ts
interface Reflection {
  id: UUID;
  sourceMemoryIds: UUID[];
  type: "pattern" | "trend" | "contradiction" | "insight" | "question";
  content: string;
  confidence: Score;
  evidenceIds: UUID[];
  createdAt: Timestamp;
  physicsVersion?: PhysicsVersion;
  status: "generated" | "reviewed" | "accepted" | "rejected";
}
```

---

## AAS-45 Hypothesis

```ts
interface Hypothesis {
  id: UUID;
  sourceMemoryIds: UUID[];
  statement: string;
  confidence: Score;
  evidenceIds: UUID[];
  status: "proposed" | "supported" | "rejected" | "superseded";
  createdAt: Timestamp;
}
```

---

## AAS-46 DreamCandidate

```ts
interface DreamCandidate {
  id: UUID;
  sourceMemoryIds: UUID[];
  generationMethod: string;
  dreamScore: Score;
  noveltyScore: Score;
  bridgePotential: Score;
  emergenceScore: Score;
  confidence: Score;
  trustGate: Score;
  relationStrength: Score;
  hypothesis?: Hypothesis;
  physicsVersion: PhysicsVersion;
  formulaVersion: FormulaVersion;
  llmModel?: string;
  randomSeed?: string;
  createdAt: Timestamp;
  status: "generated" | "reviewed" | "accepted" | "rejected";
}
```

**Hard rule:** `DreamCandidate ≠ Fact`.

---

## AAS-47 CreativeCandidate

```ts
interface CreativeCandidate {
  id: UUID;
  sourceMemoryIds: UUID[];
  concept: string;
  novelty: Score;
  emergence: Score;
  bridgePotential: Score;
  createdAt: Timestamp;
  status: "generated" | "reviewed" | "accepted" | "rejected";
}
```

---

## AAS-48 ActionIntent

```ts
interface ActionIntent {
  id: UUID;
  sourceId: UUID;
  description: string;
  riskLevel: "low" | "medium" | "high";
  requiresApproval: boolean;
  approvedBy?: string;
  approvedAt?: Timestamp;
  createdAt: Timestamp;
  status: "proposed" | "approved" | "executing" | "executed" | "rejected" | "failed";
}
```

---

## AAS-49 PhysicsCalculation

```ts
interface PhysicsCalculation {
  id: UUID;
  calculationType: string;
  physicsVersion: PhysicsVersion;
  formulaVersion: FormulaVersion;
  parameterSet: Record<string, PhysicsParameter>;
  inputSnapshot: Record<string, unknown>;
  output: Record<string, unknown>;
  timestamp: Timestamp;
  randomSeed?: string;
}

interface PhysicsParameter {
  name: string;
  value: number;
  range?: { min: number; max: number };
  unit?: string;
  source: string;
  version: string;
}
```

---

## AAS-50 DomainEvent + EventEnvelope (PATCH F)

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

interface EventEnvelope<T = unknown> {
  event: DomainEvent<T>;
  schemaVersion: string;
  producer: string;
  environment: "development" | "test" | "production";
}
```

---

## AAS-51 Communication Rule (PATCH E)

```text
Commands  → produce Domain Events (write side)
Queries   → use synchronous read Interfaces (read side, no side effects)
```

---

## AAS-52 Kernel Definition

The AILEXSI Kernel is:

```text
Memory + Provenance + History + Knowledge + Physics + Events + Temporal Model
```
