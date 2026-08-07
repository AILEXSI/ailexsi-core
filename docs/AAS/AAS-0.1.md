# AAS – AILEXSI Architecture Specification

**Version:** 0.1  
**Status:** Normative Draft  
**Scope:** Domain Architecture, Bounded Contexts, Module Boundaries and System Contracts  
**Dependencies:** ACS 0.1 + AKP 0.1 + AKP 0.2

---

## AAS-1 Architekturprinzip

AILEXSI consists of separated **Bounded Contexts**.

Every Context:
- possesses a clearly defined responsibility
- possesses its own data model
- communicates exclusively via defined Interfaces and Events
- never mutates foreign data directly
- publishes Domain Events
- consumes Events of other Contexts
- can be implemented or replaced independently internally

**AKP is not a Bounded Context.**  
AKP is a pure Computational Domain used by multiple Contexts as a service.

---

## AAS-2 Bounded Contexts (Kern)

| Context      | Responsibility                                      |
|--------------|-----------------------------------------------------|
| Memory       | Memory Cells, versioning, Provenance, Lifecycle     |
| Identity     | User values, Mission, Goals, Roles, Principles      |
| Knowledge    | Graph, Relations, Clusters, Bridges                 |
| Trust        | Evidence, Confidence, Contradiction Signals         |
| Reflection   | temporal patterns, Trends, Insights                 |
| Reasoning    | Hypotheses and conclusions                          |
| Creativity   | new combinations, Emergence                         |
| Action       | Tasks and execution (only external executor)        |
| Learning     | Feedback and system improvement                     |
| History      | immutable Event Store                               |
| Retrieval    | Context assembly                                    |

Infrastructure (not cognitive capabilities):  
AI Gateway, Event Bus, Persistence, Vector Index, Graph Store, Scheduler, API Gateway, Authentication, Observability.

---

## AAS-3 Memory Context

**Responsibility**  
Owns the truth about which Memory Cells exist.  
Manages creation, versioning, Lifecycle, Provenance, Content and metadata.  
Calculates no complex Cognitive Physics (that is AKP’s job).

**Interface (core)**

```ts
interface MemoryService {
  create(input: CreateMemoryInput): Promise<MemoryCell>;
  get(id: MemoryId): Promise<MemoryCell | null>;
  update(id: MemoryId, input: UpdateMemoryInput): Promise<MemoryVersion>;
  archive(id: MemoryId): Promise<void>;
  restore(id: MemoryId): Promise<void>;
  getHistory(id: MemoryId): Promise<MemoryVersion[]>;
}
```

---

## AAS-4 Memory Domain Model (Kern)

```ts
type MemoryId = string;

interface MemoryCell {
  id: MemoryId;
  identity: MemoryIdentity;
  content: MemoryContent;
  context: MemoryContext;
  meaning?: MemoryMeaning;
  provenance: Provenance;
  lifecycle: LifecycleState;
  relations: RelationRef[];
  timestamps: TemporalMetadata;
  physics: CognitiveStateVector;   // calculated by AKP
  version: number;
}
```

---

## AAS-5 Provenance

```ts
interface Provenance {
  sourceType: "user" | "conversation" | "document" | "web" | "system" | "agent" | "import";
  sourceId?: string;
  capturedAt: string;
  parentMemoryIds?: MemoryId[];
  evidenceIds?: string[];
}
```

---

## AAS-6 Identity Context

Identity is **not** a Memory Cell. It can reference Memory Cells and is versioned.

```ts
interface IdentitySnapshot {
  userId: string;
  values: IdentityValue[];
  goals: Goal[];
  roles: Role[];
  mission?: string;
  principles: Principle[];
  version: number;
  createdAt: string;
}
```

---

## AAS-7 Knowledge Context

Owns the Graph.

```ts
interface KnowledgeRelation {
  id: string;
  source: MemoryId;
  target: MemoryId;
  type: RelationType;
  strength: number;          // from AKP
  provenance: Provenance;
  createdAt: string;
  version: number;
}
```

---

## AAS-8 Trust Context

Evaluates Evidence. Does not decide about truth.

Produces: Trust Assessment, Confidence, Contradiction Signals.

---

## AAS-9 Retrieval Context

Interface between Cortex and Memory.  
Calls AKP for scoring and executes the Cognitive Retrieval Pipeline (AKP-23).

```ts
interface RetrievalService {
  retrieve(query: RetrievalQuery): Promise<RetrievalResult>;
}
```

---

## AAS-10 Reflection Context

Looks at Memory over time.  
Produces new artefacts. Never mutates existing Memory Cells (Law 3).

```ts
interface Reflection {
  id: string;
  sourceMemoryIds: MemoryId[];
  type: "pattern" | "trend" | "contradiction" | "insight" | "question";
  content: string;
  confidence: number;
  createdAt: string;
}
```

---

## AAS-11 Reasoning Context

Produces Hypotheses. A Hypothesis is never automatically a fact.

```ts
interface Hypothesis {
  id: string;
  sourceMemoryIds: MemoryId[];
  statement: string;
  confidence: number;
  evidenceIds: string[];
  status: "proposed" | "supported" | "rejected" | "superseded";
  createdAt: string;
}
```

---

## AAS-12 Creativity Context

Consumes Energy, Novelty, Bridge Score, Emergence and Dream Candidates.

```ts
interface CreativeCandidate {
  id: string;
  sourceMemoryIds: MemoryId[];
  concept: string;
  novelty: number;
  emergence: number;
  status: "generated" | "reviewed" | "accepted" | "rejected";
  createdAt: string;
}
```

---

## AAS-13 Action Context

Only Context that may execute external actions.  
Requires explicit Action Intent. May not arise automatically from Reflection.

```ts
interface ActionIntent {
  id: string;
  sourceId: string;
  description: string;
  riskLevel: "low" | "medium" | "high";
  requiresApproval: boolean;
}
```

---

## AAS-14 Learning Context

Processes Feedback and Outcomes.  
Every change produces a traceable Learning Event. No silent mutations.

---

## AAS-15 History Context

Immutable Event Store.  
Current state = Projection of the History (CQRS).

---

## AAS-16 Event Architecture

```ts
interface DomainEvent {
  eventId: string;
  eventType: string;
  aggregateId: string;
  aggregateType: string;
  timestamp: string;
  version: number;
  payload: unknown;
  causationId?: string;
  correlationId?: string;
}
```

---

## AAS-17 Kern-Events (Minimal)

```text
MemoryCreated, MemoryUpdated, MemoryArchived, MemoryRestored,
RelationProposed, RelationAccepted, RelationRejected,
EvidenceAdded, TrustAssessmentCreated,
ReflectionCreated, HypothesisCreated,
DreamCandidateGenerated, CreativeCandidateGenerated,
ActionProposed, ActionApproved, ActionExecuted, ActionRejected,
IdentityUpdated, PhysicsCalculated
```

---

## AAS-18 Cognitive Event Loop

```text
INPUT → INGESTION → MEMORY → KNOWLEDGE → TRUST → AKP
                                      ↓
               RETRIEVAL / REFLECTION / DREAM
                                      ↓
                               REASONING → ACTION → OUTCOME → LEARNING → HISTORY
                                                                      ↓
                                                                   MEMORY
```

---

## AAS-19 Kommunikationsregel

No direct call `otherModule.doSomething()`.  
Communication exclusively via Domain Events + Event Bus.

---

## AAS-20 AI Gateway

Complete abstraction of LLMs.

```ts
interface AIProvider {
  generate(request: AIRequest): Promise<AIResponse>;
  embed(request: EmbeddingRequest): Promise<EmbeddingResponse>;
}
```

---

## AAS-21 Embedding Provider

```ts
interface EmbeddingProvider {
  embed(input: string | string[]): Promise<number[][]>;
}
```

---

## AAS-22 Persistence

Abstracted. Possible backends: PostgreSQL, SQLite, Qdrant, Neo4j, Object Storage, Filesystem.  
**Open Source first** (Principle Zero).

---

## AAS-23 IP-Grenze

**Own logic (AILEXSI IP):**  
Memory Cell Model, Cognitive State Vector, Knowledge Physics, Retrieval Physics, Attention Budget, Dream Physics, Cognitive Event Loop, Identity Model, Reflection Model, Emergence Model.

**Existing infrastructure:**  
PostgreSQL, Vector DB, Graph DB, Message Bus, LLM APIs, Embedding Models, Auth, Observability, Container, Deployment.

---

## AAS-24 Repository-Struktur (Ziel)

```text
ailexsi/
├── apps/ (web, api)
├── packages/
│   ├── core/ (memory, identity, knowledge, trust, reflection, reasoning, creativity, action, learning, history)
│   ├── physics/ (signals, temporal, graph, retrieval, attention, dream)
│   ├── ai/ (providers, embeddings)
│   ├── infrastructure/ (database, vector, graph, events, storage)
│   └── shared/
├── docs/ (ACS, AKP, AAS)
├── tests/
└── infrastructure/
```

---

## AAS-25 Architekturtest

Every external component (LLM, Vector DB, Graph DB, Frontend, Cloud, Event infrastructure) must be replaceable without rewriting the Cortex.  
The Kernel (Physics, Cognitive State, Event Contracts, Cognitive Laws) remains stable.
