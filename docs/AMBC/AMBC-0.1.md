# AILEXSI MASTER BUILD CONTRACT

**AMBC 0.1.1**  
**Status:** EXECUTABLE / NORMATIVE  
**Target:** First Artificial Cortex  
**Architecture:** Modular Monolith  
**Language:** TypeScript · Node.js · Next.js · PostgreSQL + pgvector · pnpm

---

## 0. Authority

Normative sources in this order:

```text
ACS → AKP → AAS → ABS → AUDIT → AMBC → BUILD MANIFEST
```

In case of conflict the higher-ranking specification applies.  
The agent invents no own architecture, Physics or product philosophy.

---

## 1. Prime Directive

**Not generate as much code as possible.**  
**Build the smallest functioning First Artificial Cortex.**

Every implementation belongs to one category:

```text
BUILD | CONFIGURE | IMPORT | DEFER
```

---

## 2. Principle Zero

Before every implementation:

1. Check existing dependency  
2. Check existing open-source component  
3. Check whether configuration is sufficient  
4. Check whether AILEXSI-specific logic is really missing  
5. Only then **BUILD**

---

## 3. BUILD (18 Components)

**Cognitive Domains**  
MemoryDomain · IdentityDomain · KnowledgeDomain · TrustDomain · RetrievalDomain · ReflectionDomain · LearningDomain

**Physics**  
SignalEngine · TemporalEngine · GraphPhysics · RetrievalPhysics · AttentionEngine · DreamEngine

**Cognitive Infrastructure**  
ProjectionEngine

**Contracts**  
AIProvider · EmbeddingProvider

**Product Interfaces**  
CognitiveAPI · AILEXSIWeb

---

## 4. CONFIGURE

CognitiveEventBus · EventStore · CognitiveScheduler · PostgresRepository · VectorRepository · GraphRepository · AI Provider Adapter · Embedding Provider Adapter

---

## 5. IMPORT

PostgreSQL · pgvector · Drizzle · Zod · Fastify · Next.js · pg-boss · Pino · Docker · Vitest · Vercel AI SDK · Provider SDKs

---

## 6. DEFER

Microservices · Kubernetes · Kafka · Neo4j · dedicated Vector-DB · autonomous Agents · external Actions · Mobile · Multimodal · Federated Learning · Self-Modification · Advanced Reasoning · Enterprise Multi-Tenancy · Marketplace · own LLM / Embedding model

---

## 7. Absolute Architectural Rules

- Physics Engine imports **never** database, AI, HTTP, Fastify, Next.js, Drizzle, EventBus or Filesystem.
- Dream Mode produces **never** Facts.
- History is **append-only**.
- Cognitive State is Projection, not truth.
- External AI receives **never** the entire Memory Store.
- No destructive Memory updates.

---

## 8. Build Order (binding)

```text
01 Bootstrap
02 Repository Skeleton
03 Contracts (canonical models, Zod schemas)
04 Physics Conformance Suite          ← HARD GATE
05 Database + Event Store
06 Memory
07 Projection
08 Physics Implementation (must pass Conformance Suite)
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

**Hard rule:** Phases 05–22 may not begin until Phase 04 (Physics Conformance Suite) is fully green.

---

## 9. Phase Gate

After every phase:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration
pnpm test:architecture
```

Error → **STOP → FIX → TEST → CONTINUE**

---

## 10. Mandatory Gates

1. **Physics Conformance Suite** (Phase 04) – must be green before any domain implementation  
2. **Determinism Gate** (same inputs → same outputs)  
3. **Event Replay Gate** (DELETE projections → REPLAY → identical state)  
4. **Architecture Tests** (import prohibitions, Dream ≠ Fact, History append-only)  
5. **Full First Artificial Cortex E2E Test**

---

## 11. Agent Execution Protocol

The agent does **not** start with code.

```text
STEP 0  Repository Analysis
STEP 1  Dependency Audit
STEP 2  Normative Cross-Check against ACS / AKP / AAS / ABS / AUDIT / AMBC / Build Manifest
STEP 3  Blocker Report

No implementation until the Blocker Report is delivered and acknowledged.

Only after Physics Conformance Suite is fully green may the rest of the Build Order proceed.
```

After every phase the agent delivers:

```text
PHASE | STATUS | FILES | DEPENDENCIES | TESTS | RESULTS | ARCHITECTURE DECISIONS | OPEN ISSUES | NEXT PHASE
```

---

## 12. Absolute Prohibitions

```text
❌ Simplify architecture if Cognitive Laws are violated
❌ Replace Physics by LLM prompts
❌ Hardcode scores
❌ Set Trust by LLM assertion
❌ Store Dream Output as Fact
❌ Delete History
❌ Declare projections as truth
❌ Execute external actions autonomously
❌ Re-invent infrastructure
❌ Features only because “nice to have”
❌ UI before functioning Kernel
❌ Mark TODOs as implemented
❌ Disable tests
```

---

## Final Agent Instruction

```text
You are operating inside the AILEXSI repository.

Before writing or modifying implementation code:

1. Read /docs/README.md.
2. Read all normative documents under /docs/.
3. Establish the normative hierarchy.
4. Perform repository analysis.
5. Perform dependency audit.
6. Cross-check against ACS → AKP → AAS → ABS → AUDIT → AMBC → BUILD MANIFEST.
7. Produce a blocker report.

Do NOT implement anything before STEP 7 is complete.

If a required formula, contract, invariant, schema,
or architectural rule is not sufficiently defined by
the normative documents, report:

BLOCKER: MISSING NORMATIVE DEFINITION

Do not infer or invent the missing definition.

After blocker resolution:
implement only according to the Build Manifest.
```
