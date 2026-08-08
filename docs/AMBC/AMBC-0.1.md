# AILEXSI MASTER BUILD CONTRACT

**AMBC 0.1.2**  
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

Governance artifacts (Anti-Deletion):

```text
docs/PATCHES/Normative-Patch-0.3-Anti-Deletion.md
docs/AUDIT/Blocker-Ledger.md
docs/AUDIT/Normative-Surface-Baseline-0.1.md
scripts/normative-surface-check.mjs
```

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

Product DEFER of a **specified** normative requirement additionally requires a file under `docs/DEFER/` (see Normative Patch 0.3). Listing here alone does not authorize deleting ACS/AKP/AAS text.

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

**Gate non-shrink rule:** Phase 04 CV range and phase list may only stay or expand. Shrinking without DEFER = REGRESSION_BY_DELETION.

---

## 9. Phase Gate

After every phase:

```bash
pnpm typecheck
pnpm lint
pnpm test
pnpm test:integration
pnpm test:architecture
node scripts/normative-surface-check.mjs
```

Error → **STOP → FIX → TEST → CONTINUE**

---

## 10. Mandatory Gates

1. **Physics Conformance Suite** (Phase 04) – must be green before any domain implementation  
2. **Determinism Gate** (same inputs → same outputs)  
3. **Event Replay Gate** (DELETE projections → REPLAY → identical state)  
4. **Architecture Tests** (import prohibitions, Dream ≠ Fact, History append-only)  
5. **Full First Artificial Cortex E2E Test**  
6. **Normative Surface Gate** – `node scripts/normative-surface-check.mjs` exits 0  
7. **Blocker Ledger honesty** – BLOCKERS = 0 only per `docs/AUDIT/Blocker-Ledger.md` rules

---

## 11. Agent Execution Protocol

The agent does **not** start with code.

```text
STEP 0  Repository Analysis
STEP 1  Dependency Audit
STEP 2  Normative Cross-Check against ACS / AKP / AAS / ABS / AUDIT / AMBC / Build Manifest
STEP 3  Blocker Report (update Blocker-Ledger; no closure by deletion)
STEP 3b Run node scripts/normative-surface-check.mjs

No implementation until the Blocker Report is delivered and acknowledged.

Only after Physics Conformance Suite is fully green may the rest of the Build Order proceed.
```

After every phase the agent delivers:

```text
PHASE | STATUS | FILES | DEPENDENCIES | TESTS | RESULTS | ARCHITECTURE DECISIONS | OPEN ISSUES | NEXT PHASE | SURFACE_CHECK
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
❌ Close blockers by deleting, shortening, or relocating requirements
❌ Shrink Phase 04 CV range or Build phases to claim readiness
❌ Claim BLOCKERS = 0 without Ledger + Surface Check
```

---

## 13. Anti-Deletion Closure (binding)

Closing a blocker by deleting, shortening, or relocating the normative requirement is a **CRITICAL VIOLATION**.

Report:

```text
BLOCKER: REGRESSION_BY_DELETION
```

A blocker may only be closed by:

| Close type | Evidence |
|------------|----------|
| COMPLETE | Commit + added/updated canonical text + CV/test if quantitative |
| DEFER | `docs/DEFER/<name>.md` with scope, reason, must-not, reopen |
| SUPERSEDE | Version bump + replacement; no silent drop |

Before declaring BLOCKERS = 0 or Phase GREEN:

1. Update `docs/AUDIT/Blocker-Ledger.md` (append-only)
2. Run `node scripts/normative-surface-check.mjs` (must PASS)
3. Answer: *Could an independent implementer still be blocked by something this change removed rather than specified?* If yes → not closed.

**Principle:** Closure is proof of **presence**, never proof of **absence**.

See: `docs/PATCHES/Normative-Patch-0.3-Anti-Deletion.md`.

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
7. Produce a blocker report; update Blocker-Ledger (append-only).
8. Run: node scripts/normative-surface-check.mjs

Do NOT implement anything before STEP 8 is complete and surface check PASSes.

If a required formula, contract, invariant, schema,
or architectural rule is not sufficiently defined by
the normative documents, report:

BLOCKER: MISSING NORMATIVE DEFINITION

Do not infer or invent the missing definition.
Do not delete the requirement to clear the blocker.

After blocker resolution:
implement only according to the Build Manifest.
```
