# AILEXSI BUILD MANIFEST 0.1

**Status:** EXECUTABLE CHECKLIST  
**Target:** First Artificial Cortex  
**Rule:** The agent works only on positions of this Manifest. No free extensions.

---

## PHASE 01 – BOOTSTRAP

| ID    | Task                    | Status | Done Criterion              |
|-------|-------------------------|--------|-----------------------------|
| 01.01 | pnpm workspace          | OPEN   | Workspace starts            |
| 01.02 | TypeScript strict       | OPEN   | `tsc --noEmit` green        |
| 01.03 | Vitest                  | OPEN   | Tests run                   |
| 01.04 | ESLint + Prettier       | OPEN   | Lint green                  |
| 01.05 | Zod                     | OPEN   | Zod available               |
| 01.06 | Package Boundaries      | OPEN   | core/physics/ai/infrastructure separated |

---

## PHASE 02 – CONTRACTS

| ID    | Object                  | Status | Done Criterion                     |
|-------|-------------------------|--------|------------------------------------|
| 02.01 | MemoryCell              | OPEN   | Schema + Zod + Type                |
| 02.02 | MemoryVersion           | OPEN   | Schema + Zod + Type                |
| 02.03 | Provenance              | OPEN   | Schema + Invariant (not empty)     |
| 02.04 | Evidence                | OPEN   | Schema + Score invariants          |
| 02.05 | TemporalMetadata        | OPEN   | Schema + time rules                |
| 02.06 | KnowledgeRelation       | OPEN   | Schema + Status = hypothesis default |
| 02.07 | CognitiveStateVector    | OPEN   | Schema + Velocity not restricted to [0,1] |
| 02.08 | PhysicsCalculation      | OPEN   | Schema + versioning                |
| 02.09 | DomainEvent             | OPEN   | Schema + Envelope                  |
| 02.10 | Reflection              | OPEN   | Schema                             |
| 02.11 | Hypothesis              | OPEN   | Schema                             |
| 02.12 | DreamCandidate          | OPEN   | Schema + “≠ Fact” rule             |
| 02.13 | LearningFeedback        | OPEN   | Schema                             |
| 02.14 | IdentitySnapshot        | OPEN   | Schema                             |

---

## PHASE 03 – PHYSICS (Conformance first)

Every formula requires:

```text
formula_id
physics_version
formula_version
input
parameter_set
expected_output
tolerance
edge_cases
invariants
```

| ID    | Formula             | Status | Done Criterion                |
|-------|---------------------|--------|-------------------------------|
| 03.01 | Confidence          | OPEN   | Deterministic + [0,1]         |
| 03.02 | Resonance           | OPEN   | Deterministic + [0,1]         |
| 03.03 | Mass                | OPEN   | Deterministic + [0,1]         |
| 03.04 | Temperature         | OPEN   | Deterministic + [0,1]         |
| 03.05 | Entropy             | OPEN   | Deterministic + [0,1]         |
| 03.06 | Velocity            | OPEN   | Deterministic                 |
| 03.07 | Energy              | OPEN   | Deterministic + [0,1]         |
| 03.08 | Gravity             | OPEN   | Deterministic + [0,1]         |
| 03.09 | RelationStrength    | OPEN   | Deterministic + [0,1]         |
| 03.10 | Centrality          | OPEN   | Deterministic                 |
| 03.11 | RetrievalScore      | OPEN   | Multi-Signal + Explanation    |
| 03.12 | AttentionAllocation | OPEN   | Budget Constraint             |
| 03.13 | DreamScore          | OPEN   | Safety Gate + Explanation     |
| 03.14 | Emergence           | OPEN   | Deterministic                 |
| 03.15 | IslandScore         | OPEN   | Deterministic                 |

**Gate:** All Physics tests green before Phase 04 begins.  
**Critical rule:** If a formula is not fully defined in AKP → **BLOCKER**. Do not invent it.

---

## PHASE 04 – EVENT STORE + PROJECTION

| ID    | Task                    | Status | Done Criterion              |
|-------|-------------------------|--------|-----------------------------|
| 04.01 | EventStore Schema       | OPEN   | Append-only                 |
| 04.02 | DomainEvent Persistence | OPEN   | Idempotency + Ordering      |
| 04.03 | MemoryProjection        | OPEN   | Replay possible             |
| 04.04 | KnowledgeProjection     | OPEN   | Replay possible             |
| 04.05 | PhysicsProjection       | OPEN   | Replay possible             |
| 04.06 | Event Replay Test       | OPEN   | DELETE → REPLAY → identical State |

---

## PHASE 05 – MEMORY DOMAIN

| ID    | Task                         | Status | Done Criterion                     |
|-------|------------------------------|--------|------------------------------------|
| 05.01 | create()                     | OPEN   | Provenance mandatory               |
| 05.02 | get()                        | OPEN   |                                    |
| 05.03 | update() → new Version       | OPEN   | No destructive overwrite           |
| 05.04 | archive / restore            | OPEN   |                                    |
| 05.05 | getHistory()                 | OPEN   | Complete versions                  |
| 05.06 | Event Emission               | OPEN   | MemoryCreated / Updated etc.       |

---

## PHASE 06 – KNOWLEDGE + TRUST

| ID    | Task                              | Status | Done Criterion              |
|-------|-----------------------------------|--------|-----------------------------|
| 06.01 | Relation create (hypothesis)      | OPEN   |                             |
| 06.02 | Relation accept / reject          | OPEN   |                             |
| 06.03 | Graph Traversal                   | OPEN   | Multi-hop path              |
| 06.04 | Evidence → TrustAssessment        | OPEN   |                             |
| 06.05 | Contradiction Detection           | OPEN   |                             |

---

## PHASE 07 – EMBEDDINGS + RETRIEVAL

| ID    | Task                                   | Status | Done Criterion                              |
|-------|----------------------------------------|--------|---------------------------------------------|
| 07.01 | EmbeddingProvider Interface            | OPEN   |                                             |
| 07.02 | Embedding store (model + dimension)    | OPEN   |                                             |
| 07.03 | Retrieval Pipeline                     | OPEN   | Semantic + Graph + Temporal + Trust + Physics |
| 07.04 | Diversity Filter                       | OPEN   |                                             |
| 07.05 | Retrieval Explanation (Why)            | OPEN   | Every score explainable                     |

---

## PHASE 08 – REFLECTION + DREAM + LEARNING

| ID    | Task                              | Status | Done Criterion                        |
|-------|-----------------------------------|--------|---------------------------------------|
| 08.01 | Reflection generate               | OPEN   | Does not mutate Source Memory         |
| 08.02 | Dream Candidate generate          | OPEN   | ≠ Fact + Why explanation              |
| 08.03 | Dream Safety Gate                 | OPEN   |                                       |
| 08.04 | Human Feedback (Accept/Reject/…)  | OPEN   |                                       |
| 08.05 | LearningEvent persist             | OPEN   | Influences future ranking             |

---

## PHASE 09 – IDENTITY + SCHEDULER + API + UI

| ID    | Task                          | Status | Done Criterion                  |
|-------|-------------------------------|--------|---------------------------------|
| 09.01 | IdentitySnapshot              | OPEN   | Versioned                       |
| 09.02 | Cognitive Scheduler (pg-boss) | OPEN   | Reflection / Dream / Maintenance |
| 09.03 | CognitiveAPI                  | OPEN   | All core routes                 |
| 09.04 | Capture UI                    | OPEN   |                                 |
| 09.05 | Memory UI                     | OPEN   | Cognitive State visible         |
| 09.06 | Cortex UI                     | OPEN   | Graph + State                   |
| 09.07 | Dream UI                      | OPEN   | Why + Accept/Reject/Investigate |

---

## PHASE 10 – SEED + E2E + CERTIFICATION

| ID    | Task                                | Status | Done Criterion                                      |
|-------|-------------------------------------|--------|-----------------------------------------------------|
| 10.01 | Seed Dataset                        | OPEN   | 10–20 Cells, 2–3 Clusters, Bridges, Contradictions  |
| 10.02 | Full Cognitive Cycle E2E            | OPEN   | Capture → … → Replay                                |
| 10.03 | Event Replay Gate                   | OPEN   | State identical after Replay                        |
| 10.04 | First Artificial Cortex Certification | OPEN | All 15 criteria green                               |

---

## Agent Start Command

```text
Read AMBC 0.1 and this Build Manifest.
First execute:
1. Repository Analysis
2. Dependency Audit
3. Architecture Validation against ACS/AKP/AAS/ABS/AUDIT
4. Report contradictions and the planned Skeleton
5. Create Physics Conformance Suite
6. Begin implementation only when Physics is green

Work strictly phase by phase.
After every phase: status report with Files, Tests and Next Phase.
No free features. No architecture inventions.
```
