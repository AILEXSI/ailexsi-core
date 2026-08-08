# AILEXSI BUILD MANIFEST 0.2

**Status:** EXECUTABLE CHECKLIST  
**Target:** First Artificial Cortex  
**Aligned with:** AMBC 0.1.1 Build Order  
**Rule:** The agent works only on positions of this Manifest. No free extensions.

Phase numbers match AMBC §8 exactly.

---

## PHASE 01 – Bootstrap
pnpm workspace, TypeScript strict, Vitest, ESLint, Zod, package boundaries.

## PHASE 02 – Repository Skeleton
Folder tree per ABS; empty packages with dependency rules enforced.

## PHASE 03 – Contracts
Canonical models from AAS-Buch2 as Zod schemas + TypeScript types.

## PHASE 04 – Physics Conformance Suite  ← HARD GATE
Implement pure Physics package against AKP 0.1.3 / 0.2.4.  
All CV-01..CV-26 green within stated tolerance.  
No domain/DB/provider imports.  
**Phases 05–22 MUST NOT start until Phase 04 is fully green.**

## PHASE 05 – Database + Event Store
Postgres schema, EventStore append-only, aggregateVersion + idempotencyKey enforcement.

## PHASE 06 – Memory Domain
create/get/update→version/archive/history + event emission. Provenance mandatory.

## PHASE 07 – Projection
Memory/Knowledge/Physics projections. Replay test: DELETE → REPLAY → IDENTICAL STATE (AAS-53).

## PHASE 08 – Physics Implementation wiring
Domain calls Physics with full inputSnapshot; results stored as PhysicsCalculation.

## PHASE 09 – Knowledge + Trust
Relations (hypothesis default), accept/reject, graph traversal, Evidence→TrustAssessment.  
Symmetric relation integrity enforced.

## PHASE 10 – Embeddings
EmbeddingProvider adapter; store model id/version/dimension/hashes.

## PHASE 11 – Retrieval
Pipeline per AKP-21.2; parameters from AKP-PS-012; diversity selection per AKP-24.

## PHASE 12 – Reflection
Generate without mutating source memory.

## PHASE 13 – Dream
Dream 2.0 + Safety Gate; ≠ Fact; explainability fields required.

## PHASE 14 – Learning
Human feedback events influence future ranking via explicit inputs only.

## PHASE 15 – Identity
IdentitySnapshot versioned.

## PHASE 16 – Scheduler
pg-boss triggers; no cognitive formulas inside scheduler.

## PHASE 17 – API
CognitiveAPI routes for core commands/queries.

## PHASE 18 – UI
Capture, Memory (state visible), Cortex graph, Dream (Why + Accept/Reject).

## PHASE 19 – Integration tests

## PHASE 20 – E2E Full Cognitive Cycle
Capture → … → DELETE PROJECTIONS → REPLAY → IDENTICAL STATE.

## PHASE 21 – Docker

## PHASE 22 – Documentation

---

## Agent Start Command

```text
Read AMBC 0.1.1 and this Build Manifest 0.2.
Execute STEP 0–3 (analysis, audit, cross-check, blocker report).
Begin Phase 04 Physics Conformance only when blockers = 0.
Work strictly phase by phase. No free features. No architecture inventions.
```
