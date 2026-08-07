# AILEXSI BUILD SPECIFICATION

**ABS 0.1 – Executable Build Contract**  
**Status:** Normative Implementation Specification  
**Basis:** ACS 0.1 + AKP 0.1/0.2 + AAS 0.1–0.4  
**Target:** First Artificial Cortex  
**Strategy:** Modular Monolith  
**Primary Language:** TypeScript / Node.js  
**Frontend:** Next.js  
**Database:** PostgreSQL + pgvector  
**Test:** Vitest · Validation: Zod · ORM: Drizzle · Container: Docker

---

## 0. BUILD LAW

The coding agent may not invent additional architecture.

| Status       | Meaning                                              |
|--------------|------------------------------------------------------|
| **BUILD**    | Implement AILEXSI-specific logic oneself             |
| **IMPORT**   | Use existing open-source building block              |
| **CONFIGURE**| Only configure / orchestrate existing technology     |
| **DEFER**    | Deliberately not part of 0.1                         |

**Principle Zero remains active.**  
Only genuine cognitive AILEXSI logic is built.

---

## 1. REPOSITORY STRUCTURE

```text
ailexsi/
├── apps/
│   ├── api/
│   └── web/
├── packages/
│   ├── core/          (memory, identity, knowledge, trust, retrieval, reflection, learning)
│   ├── physics/       (signals, temporal, graph, retrieval, attention, dream)
│   ├── contracts/
│   ├── events/
│   ├── ai/
│   ├── infrastructure/
│   └── shared/
├── db/
│   ├── migrations/
│   └── seeds/
├── docs/              (ACS, AKP, AAS, ABS, AUDIT, AMBC, BUILD)
├── tests/             (unit, integration, physics, contracts, e2e)
├── infrastructure/docker/
├── docker-compose.yml
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.json
├── vitest.config.ts
├── .env.example
├── README.md
└── LICENSE
```

Workspace: **pnpm**.

---

## 2. COMPONENT CLASSIFICATION (from AUDIT)

**BUILD (18)**  
MemoryDomain, IdentityDomain, KnowledgeDomain, TrustDomain, RetrievalDomain, ReflectionDomain, LearningDomain  
SignalEngine, TemporalEngine, GraphPhysics, RetrievalPhysics, AttentionEngine, DreamEngine  
ProjectionEngine  
AIProvider Interface, EmbeddingProvider Interface  
CognitiveAPI, AILEXSIWeb

**CONFIGURE**  
CognitiveEventBus, EventStore (infrastructure), CognitiveScheduler, PostgresRepository, VectorRepository, GraphRepository  
AI and Embedding Provider Adapters

**IMPORT**  
PostgreSQL, pgvector, Drizzle, Zod, Fastify, Next.js, pg-boss, Pino, Docker, Vercel AI SDK / Provider SDKs, Vitest

**DEFER**  
Microservices, Kubernetes, Neo4j, Kafka, dedicated Vector DB, autonomous Agents, external Actions, Mobile, Multimodal, Federated Learning, Self-Modification, Advanced Reasoning, Enterprise Multi-Tenancy

---

## Key Rules

- Physics Engine imports **never** database, AI, HTTP, Fastify, Next.js, Drizzle, EventBus or Filesystem.
- Dream Mode produces **never** Facts.
- History is **append-only**.
- Cognitive State is Projection, not authority.
- External AI never receives the entire Memory Store.
- No destructive Memory updates.

---

## BUILD ORDER (binding)

```text
01 Bootstrap
02 Repository
03 Contracts
04 Database
05 Event Store
06 Memory
07 Projection
08 Physics
09 Knowledge
10 Embeddings
11 Retrieval
12 Reflection
13 Dream
14 Learning
15 Identity
16 Scheduler
17 API
18 UI
19 Integration
20 E2E
21 Docker
22 Documentation
```

---

## Final Acceptance

The First Artificial Cortex exists only when all of the following are green:

```text
[✓] Memory + Provenance + Versioning
[✓] History + Event Replay
[✓] Knowledge Graph
[✓] Trust
[✓] Physics (deterministic + versioned)
[✓] Retrieval (multi-signal)
[✓] Reflection
[✓] Dream (only Candidates/Hypotheses)
[✓] Human Feedback + Learning
[✓] Identity
[✓] Explainability
[✓] Full E2E + Replay
```
