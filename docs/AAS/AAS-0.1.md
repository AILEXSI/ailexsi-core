# AAS – AILEXSI Architecture Specification

**Version:** 0.1.2  
**Status:** Normative  
**Scope:** Domain Architecture, Bounded Contexts, Module Boundaries and System Contracts  
**Dependencies:** ACS 0.1.1 + AKP 0.1.3 + AKP 0.2.4

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
| Knowledge    | Graph, Relations, Clusters, Bridges (cluster authority) |
| Trust        | Evidence, Confidence, Contradiction Signals         |
| Reflection   | temporal patterns, Trends, Insights                 |
| Reasoning    | Hypotheses and conclusions                          |
| Creativity   | new combinations, Emergence                         |
| Action       | Tasks and execution (only external executor)        |
| Learning     | Feedback and system improvement                     |
| History      | immutable Event Store                               |
| Retrieval    | Context assembly                                    |

Infrastructure: AI Gateway, Event Bus, Persistence, Vector Index, Graph Store, Scheduler, API Gateway, Authentication, Observability.

---

## AAS-19 Kommunikationsregel (canonical)

```text
Commands  → produce Domain Events (write side)
Queries   → use synchronous read Interfaces (read side, no side effects)
```

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

---

## AAS-22 DomainEvent (canonical, must match AAS-Buch2)

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

**idempotencyKey rules (canonical, identical to AAS-Buch2):**
- same key + identical payload → return original command result, append no new event
- same key + different payload → integrity violation / reject

**aggregateVersion:** first event = 1; each subsequent = previous + 1 (see AAS-Buch2).

---

## AAS-25 Architekturtest

Every external component must be replaceable without rewriting the Cortex.  
The Kernel (Physics, Cognitive State, Event Contracts, Cognitive Laws) remains stable.
