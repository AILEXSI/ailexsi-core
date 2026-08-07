# AAS – AILEXSI Architecture Specification

## Buch 3 – Runtime Architecture

**Version:** 0.1  
**Status:** Normative Draft  
**Dependencies:** ACS 0.1, AKP 0.2, AAS 0.1 + 0.2

---

## AAS-64 Grundsatz der Runtime

The first running AILEXSI Cortex is built as a **modular monolith**.

One repository.  
One application.  
Clear internal Bounded Contexts.  
Clear Interfaces.  
One Event System.  
One Physics Engine.  
One database.

No 12 microservices.  
No Kubernetes.  
No Kafka.  
No own Vector Store.  
No Neo4j (yet).

Later individual components may be extracted — **only when it actually becomes necessary**.

---

## AAS-65 Runtime-Diagramm (MVP)

```text
                    ┌──────────────────┐
                    │   AILEXSI UI     │
                    └────────┬─────────┘
                             │
                             ▼
                    ┌──────────────────┐
                    │    API Layer     │
                    └────────┬─────────┘
                             │
                             ▼
                 ┌───────────────────────┐
                 │   Cognitive Kernel    │
                 │                       │
                 │  Memory               │
                 │  Identity             │
                 │  Knowledge            │
                 │  Trust                │
                 │  Retrieval            │
                 └───────────┬───────────┘
                             │
                 ┌───────────▼───────────┐
                 │   AILEXSI Physics     │
                 │                       │
                 │  Mass / Resonance     │
                 │  Entropy / Gravity    │
                 │  Energy / Attention   │
                 │  Dream                │
                 └───────────┬───────────┘
                             │
                    ┌────────▼────────┐
                    │   Event Store   │
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          ▼                  ▼                  ▼
     PostgreSQL         Vector Index         Graph
     (pgvector)         (pgvector)        (PostgreSQL)
```

---

## AAS-66 Erster realer Stack (MVP)

| Area          | MVP Decision                      |
|---------------|-----------------------------------|
| Runtime       | TypeScript / Node                 |
| API           | Fastify                           |
| Frontend      | Next.js                           |
| Database      | PostgreSQL                        |
| Vector        | pgvector                          |
| Graph         | PostgreSQL (Adjacency + Materialized Views) |
| Events        | PostgreSQL Event Store            |
| ORM           | Drizzle                           |
| Validation    | Zod                               |
| LLM           | interchangeable AIProvider        |
| Embeddings    | interchangeable Provider          |
| Physics       | own TypeScript Package            |
| Scheduler     | DB-backed (initially)             |
| Auth          | existing open-source building block |
| Deployment    | Docker                            |
| Tests         | Vitest                            |

---

## AAS-67 The 7 Core Capabilities of the first Cortex

1. **Capture** – User Input → Memory Cell with Provenance, TemporalMetadata and initial Cognitive State.
2. **Remember** – Query → Semantic Retrieval → Graph/Metadata Expansion → AKP Ranking → Context Window.
3. **Relate** – New or existing Cells → Relation proposals (Status = hypothesis) → manual or rule-based acceptance.
4. **Calculate** – After relevant changes → AKP calculates and versions the Cognitive State Vector.
5. **Reflect** – Multiple Memory Cells over time → Reflection artefacts. Reflection never mutates original data.
6. **Dream** – After the daily cycle → probabilistic search for distant but plausible connections → DreamCandidate (never Fact).
7. **Learn** – Human feedback (Accept / Reject / Modify / Ignore) → Learning Event → History → influence on future rankings and Attention Allocation.

---

## AAS-68 First Cognitive Loop (Runtime)

```text
                 ┌───────────────┐
                 │    INPUT      │
                 └───────┬───────┘
                         ▼
                      MEMORY
                         │
                         ▼
                     KNOWLEDGE
                         │
                         ▼
                       TRUST
                         │
                         ▼
                        AKP
                         │
             ┌───────────┼───────────┐
             ▼           ▼           ▼
         RETRIEVAL   REFLECTION    DREAM
             │           │           │
             └───────────┼───────────┘
                         ▼
                       HUMAN
                         │
                  Accept / Reject
                         │
                         ▼
                      LEARNING
                         │
                         ▼
                      HISTORY
                         │
                         └──────────────► MEMORY
```

This cycle **is** AILEXSI.  
Everything else is replaceable infrastructure.

---

## AAS-69 IP Boundary (binding)

**Own development (AILEXSI IP):**
- Memory Model + Provenance
- Cognitive State Vector
- Kernel Physics (AKP)
- Retrieval Physics
- Attention Model
- Dream Physics
- Cognitive Event Loop
- Reflection Model
- Identity Model
- Learning / Feedback Loop

**Existing open-source building blocks (Principle Zero):**
- PostgreSQL + pgvector
- Event Store (PostgreSQL-based)
- Fastify / Next.js / Drizzle / Zod
- LLM and Embedding Providers
- Auth, Observability, Docker
