# AAS – AILEXSI Architecture Specification

## Buch 4 – MVP Runtime

**Version:** 0.1  
**Status:** Normative Draft  
**Dependencies:** ACS 0.1, AKP 0.2, AAS 0.1–0.3

---

## AAS-71 MVP Definition

AILEXSI 0.1 is **not** the complete system.  
AILEXSI 0.1 is the smallest functional Cortex that can prove:

> Information can be captured, stored with provenance, versioned over time, connected, physically evaluated, retrieved, reflected upon, and transformed into new hypotheses.

The MVP is successful when this cycle functions in reality and is reproducible.

---

## AAS-72 The 24 MVP Components

**Kernel**  
1. MemoryDomain  
2. IdentityDomain  
3. KnowledgeDomain  
4. TrustDomain  
5. RetrievalDomain  
6. ReflectionDomain  
7. LearningDomain

**Physics**  
8. SignalEngine  
9. TemporalEngine  
10. GraphPhysics  
11. RetrievalPhysics  
12. AttentionEngine  
13. DreamEngine

**Runtime**  
14. CognitiveEventBus  
15. EventStore  
16. ProjectionEngine  
17. CognitiveScheduler

**AI**  
18. AIProvider  
19. EmbeddingProvider

**Persistence**  
20. PostgresRepository  
21. VectorRepository  
22. GraphRepository

**Interface**  
23. CognitiveAPI  
24. AILEXSIWeb

---

## AAS-73 Explicitly **not** built in 0.1

```text
❌ Microservices
❌ Kubernetes
❌ own Vector Store
❌ own Graph database
❌ own LLM / Embedding model
❌ own Auth system
❌ own Message Broker
❌ own Workflow Engine
❌ own Object Store
❌ own Observability system
❌ own Search Engine
❌ own ORM
❌ own UI component library
❌ Mobile App / Browser Extension / Desktop App
❌ Multi-Tenant Enterprise Architecture
❌ Marketplace / Plugin Marketplace
❌ autonomous Agents
❌ automated external actions
❌ autonomous Self-Modification
❌ AGI
```

---

## AAS-75 – AAS-85 Implementation Order (binding)

| Phase | Content | Done Criterion |
|-------|---------|----------------|
| 1 | Skeleton (Repo, Packages, DB, Tests) | Project starts reproducibly |
| 2 | Memory (Cell, Version, Provenance, Evidence, Temporal, Lifecycle) | Information captured and versioned retrievable |
| 3 | History (Event Store + Projection) | State fully reconstructible from Events |
| 4 | Physics (Signals, Temporal, Graph, all Scores) | Identical input → identical output |
| 5 | Knowledge Graph (PostgreSQL) | Multi-hop path between Cells calculable |
| 6 | Embeddings (interchangeable Provider) | Semantic search provider-independent |
| 7 | Retrieval (full Pipeline) | Result evaluated according to AILEXSI Physics |
| 8 | Reflection | Temporal development representable as artefact |
| 9 | Dream Engine | Explainable connection between weakly connected domains |
| 10 | Learning | Feedback produces versioned Learning Event |
| 11 | Identity | Retrieval can prioritize person-specifically |
| 12 | Cognitive Scheduler | Active / Reflection / Dream cycles run |

---

## AAS-89 Definition of Done (automated End-to-End Test)

```text
1. Create Memory A
2. Create Memory B
3. Add Evidence
4. Calculate Cognitive States
5. Create Relation A → B
6. Store Event History
7. Generate Embeddings
8. Retrieve A from semantic query
9. Expand through B
10. Calculate retrieval score
11. Generate Reflection
12. Run Dream Cycle
13. Produce DreamCandidate
14. Explain its origin
15. Accept/Reject candidate
16. Persist Learning Event
17. Reconstruct complete state from Event Store
18. DELETE PROJECTIONS → REPLAY EVENTS → EXPECTED STATE === RECONSTRUCTED STATE
```

When this test is green, the **First Artificial Cortex** exists.

---

## AAS-90 Milestone

**FIRST ARTIFICIAL CORTEX**

```text
Memory + Identity + History + Knowledge + Trust + Physics
+ Retrieval + Reflection + Dream + Learning
```

function as a coherent, reproducible cycle.
