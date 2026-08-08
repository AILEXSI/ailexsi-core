# AILEXSI BUILD MANIFEST 0.2.1

**Status:** EXECUTABLE CHECKLIST  
**Aligned with:** AMBC 0.1.2 Build Order  
**Physics:** AKP 0.1.4 / 0.2.5  
Phase numbers match AMBC §8 exactly.

---

## Governance gates (every phase)

```bash
node scripts/normative-surface-check.mjs
```

Must PASS. Failure = `BLOCKER: REGRESSION_BY_DELETION` or missing normative files.

Phase 04 CV range and phase list may **only stay or expand**. Shrinking without DEFER is forbidden.

Blocker closure only via COMPLETE | DEFER | SUPERSEDE per `docs/AUDIT/Blocker-Ledger.md`.

---

## PHASE 01 – Bootstrap
## PHASE 02 – Repository Skeleton
## PHASE 03 – Contracts
## PHASE 04 – Physics Conformance Suite  ← HARD GATE
All **CV-01..CV-44** green within tolerance. No domain/DB/provider imports.  
**Phases 05–22 MUST NOT start until Phase 04 is fully green.**

## PHASE 05 – Database + Event Store
## PHASE 06 – Memory Domain
## PHASE 07 – Projection
Replay test: DELETE → REPLAY → IDENTICAL STATE (AAS-54).

## PHASE 08 – Physics Implementation wiring
## PHASE 09 – Knowledge + Trust (symmetric integrity)
## PHASE 10 – Embeddings
## PHASE 11 – Retrieval (AKP-21.2, PS-012, AKP-24)
## PHASE 12 – Reflection
## PHASE 13 – Dream (explainability required)
## PHASE 14 – Learning
## PHASE 15 – Identity
## PHASE 16 – Scheduler
## PHASE 17 – API
## PHASE 18 – UI
## PHASE 19 – Integration tests
## PHASE 20 – E2E Full Cognitive Cycle
Capture → … → DELETE PROJECTIONS → REPLAY → IDENTICAL STATE.
## PHASE 21 – Docker
## PHASE 22 – Documentation

---

## Agent Start Command

```text
Read AMBC 0.1.2 and this Build Manifest 0.2.1.
Execute STEP 0–3b (incl. Blocker Ledger + normative-surface-check).
Begin Phase 04 only when blockers = 0 honestly (no deletion closure).
Phase 04 requires ALL CV-01..CV-44 green.
Work strictly phase by phase. No free features. No architecture inventions.
```
