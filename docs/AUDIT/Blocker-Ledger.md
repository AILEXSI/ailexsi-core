# AILEXSI Blocker Ledger

**Status:** Normative · Append-only  
**Version:** 0.1  
**Rule:** Rows are never deleted. Status may change. Close type and Evidence are mandatory when Status = closed.

---

## Close types (only these)

| Close type | Allowed |
|------------|---------|
| COMPLETE | Yes — requirement fulfilled with evidence |
| DEFER | Yes — scoped deferral file under `docs/DEFER/` |
| SUPERSEDE | Yes — versioned replacement |
| *(empty / OPEN)* | Open blocker |

**Forbidden close mechanisms:** delete requirement, silent omit, shrink CV/gate range, historical-reference stub.

---

## Ledger

| ID | Opened | Description | Status | Closed | Close type | Evidence |
|----|--------|-------------|--------|--------|------------|----------|
| B-000 | 2026-08-08 | Establish Anti-Deletion governance (Patch 0.3) | closed | 2026-08-08 | COMPLETE | Normative-Patch-0.3-Anti-Deletion.md; Blocker-Ledger; Surface-Baseline; scripts/normative-surface-check.mjs; AMBC 0.1.2 |
| B-001 | 2026-08-08 | Runtime implementation not started (expected) | open | | | Tracked by AMBC Build Order; not closable by deleting MVP scope |
| B-002 | 2026-08-08 | LearningDomain feedback→parameter mapping not AKP-defined | closed | 2026-08-08 | COMPLETE | docs/AKP/AKP-Learning-0.1.md; formulaId learning-feedback-map-1.0.0; PS-014; Formula Registry |
| B-003 | 2026-08-08 | Scheduler policy (when Dream/Reflection/Maintenance fire) only framed | closed | 2026-08-08 | COMPLETE | docs/AAS/AAS-Scheduler-Policy-0.1.md; PS-013; SCH-01..SCH-07 |
| B-004 | 2026-08-08 | Phase 04: CV fixtures incomplete — 32/44 CVs lack unambiguous input/expectedOutput in Conformance Vectors 0.1.3 (esp. CV-01..CV-26 prior suite retained without fixtures) | closed | 2026-08-08 | COMPLETE | Conformance Vectors 0.1.4 + phase04/fixtures/CV-01..CV-44 + phase04/run.mjs |
| B-005 | 2026-08-08 | Normative phase numbering conflict: user contract labelled Memory as Phase 05 while AMBC/Build Manifest define Phase 05 = Database + Event Store, Phase 06 = Memory | closed | 2026-08-08 | COMPLETE | Resolved by following higher-ranking AMBC 0.1.2 §8 + Build Manifest 0.2.1. No SUPERSEDE. Memory Domain remains Phase 06. README + docs/README updated to state actual order. |
| B-006 | 2026-08-08 | Phase 04 runner missing on main (REGRESSION of B-004 evidence). phase04/run.mjs deleted and not restored; clean-checkout verification impossible | closed | 2026-08-08 | COMPLETE | phase04/run.mjs restored (commit 397a6e89). Evidence-closure runner: default verify-only, real schema-validate, expectedStatus checks, provenance. Phase 04 again reproducible from clean checkout. |
| B-007 | 2026-08-08 | Preconditions for Memory Domain not met: no Event Store, no contracts package, no TypeScript workspace, no repository abstractions | closed | 2026-08-08 | COMPLETE | Phase 05 COMPLETE/GREEN: packages/contracts + persistence + eventstore; live Postgres integration 13/13 PASS; typecheck PASS; Phase 04 remains GREEN |

---

## How to open a blocker

Append a new row. Never reuse IDs. ID format: `B-NNN` monotonic.

```text
| B-00N | YYYY-MM-DD | short description | open | | | |
```

## How to close a blocker

1. Set Status = `closed`
2. Set Closed date
3. Set Close type ∈ {COMPLETE, DEFER, SUPERSEDE}
4. Evidence column must cite:
   - COMPLETE: commit SHA or path + what was **added**
   - DEFER: path to `docs/DEFER/<name>.md`
   - SUPERSEDE: old version → new version + changelog pointer

## REGRESSION_BY_DELETION

If a closed COMPLETE blocker’s evidence targets are later removed without SUPERSEDE/DEFER:

```text
Open new blocker: B-xxx REGRESSION_BY_DELETION of B-yyy
Status: open
Close type when fixed: COMPLETE (restore or SUPERSEDE properly)
```

## BLOCKERS = 0 claim

Allowed only if:

1. No row has Status = `open` **that is in scope for the claimed milestone**, OR every open row is explicitly out-of-milestone via DEFER; and
2. `node scripts/normative-surface-check.mjs` exits 0; and
3. No Phase gate / CV range shrink vs baseline without DEFER.

Claims of BLOCKERS = 0 that fail any of the above are **invalid**.

**Milestone note:** For Spec + Phase 04/05 gate, B-001 (runtime domains not started) may remain open. B-007 closed with Phase 05 COMPLETE. Phase 06 (Memory) may proceed.
