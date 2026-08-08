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
| B-002 | 2026-08-08 | LearningDomain feedback→parameter mapping not AKP-defined | open | | | May only close COMPLETE (new AKP+CV) or DEFER with docs/DEFER entry |
| B-003 | 2026-08-08 | Scheduler policy (when Dream/Reflection/Maintenance fire) only framed | open | | | COMPLETE or DEFER; not by removing Scheduler from BUILD/CONFIGURE |
| B-004 | 2026-08-08 | Phase 04: CV fixtures incomplete — 32/44 CVs lack unambiguous input/expectedOutput in Conformance Vectors 0.1.3 (esp. CV-01..CV-26 prior suite retained without fixtures) | open | | | May only close COMPLETE by expanding AKP-Conformance-Vectors with full fixtures; never by shrinking CV range |

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
