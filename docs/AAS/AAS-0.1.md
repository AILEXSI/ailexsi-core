# AAS – AILEXSI Architecture Specification

**Version:** 0.1.2  
**Status:** Normative  
**Scope:** Domain Architecture, Bounded Contexts, Module Boundaries and System Contracts  
**Dependencies:** ACS 0.1.1 + AKP 0.1.2 + AKP 0.2.2

---

## AAS-1 Architekturprinzip

AILEXSI consists of separated **Bounded Contexts**.

Every Context:
- possesses a clearly defined responsibility
- possesses its own data model
- never mutates foreign data directly
- publishes Domain Events for all state changes
- consumes Events of other Contexts
- may expose synchronous Query Interfaces (read-only, no side effects)
- can be implemented or replaced independently internally

**Communication rule (canonical):**
```text
Commands  → produce Domain Events (write side)
Queries   → use synchronous read Interfaces (read side)
```
All state changes travel exclusively through Domain Events + Event Bus.

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

## AAS-19 Kommunikationsregel (canonical)

```text
Commands  → produce Domain Events (write side)
Queries   → use synchronous read Interfaces (read side, no side effects)
```

No direct call `otherModule.mutateSomething()`.  
All state changes travel exclusively through Domain Events + Event Bus.  
Query Interfaces are read-only and may be called synchronously.

---

## AAS-20 AI Provider

```ts
interface AIProvider {
  generate(request: AIRequest): Promise<AIResponse>;
}
```

---

## AAS-21 Embedding Provider

```ts
interface EmbeddingProvider {
  embed(input: string | string[]): Promise<number[][]>;
}
```

AIProvider and EmbeddingProvider are independent contracts and may be replaced separately.

---

## AAS-22 DomainEvent (canonical, must match AAS-Buch2)

```ts
interface DomainEvent<T = unknown> {
  eventId: UUID;                 // required, unique
  eventType: string;             // required
  aggregateId: UUID;             // required
  aggregateType: string;         // required
  aggregateVersion: Version;     // required, strict ordering per aggregate
  timestamp: Timestamp;          // required, ISO-8601 UTC
  payload: T;                    // required
  causationId?: UUID;            // optional
  correlationId?: UUID;          // optional
  idempotencyKey: string;        // required, unique
}
```

**Rules**
- Events of the same aggregate MUST be applied in strictly ascending `aggregateVersion` order.
- `idempotencyKey` MUST be unique across the Event Store. Duplicate keys are rejected.
- DomainEvent is the persisted fact. EventEnvelope (if used) is only a transport wrapper.
- Command ≠ Event. Commands produce Events; Queries never produce Events.

---

## AAS-25 Architekturtest

Every external component (LLM, Vector DB, Graph DB, Frontend, Cloud, Event infrastructure) must be replaceable without rewriting the Cortex.  
The Kernel (Physics, Cognitive State, Event Contracts, Cognitive Laws) remains stable.
