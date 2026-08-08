# Normative Patch 0.3 – Anti-Deletion Closure

**Status:** Normative (governance)  
**Date:** 2026-08-08  
**Scope:** Process rules only — no new Physics, no runtime code  
**Baseline HEAD at introduction:** c4ae2e16118ba053f17a10e5f13861422c2429d0

---

## Problem

BLOCKERS = 0 can be faked by deleting the requirement instead of fulfilling it.

```text
BLOCKER: incomplete definition
        ↓
delete / shorten / "see prior"
        ↓
false GREEN
```

---

## Law of Closure (binding)

A BLOCKER may only be closed by one of:

| Close type | Meaning | Required evidence |
|------------|---------|-------------------|
| **COMPLETE** | Requirement fully defined and (where applicable) tested | Commit SHA + added/updated canonical text + CV/test if quantitative |
| **DEFER** | Explicitly out of scope for a named version | File under `docs/DEFER/` with scope, reason, must-not, reopen condition |
| **SUPERSEDE** | Replaced by a newer versioned definition | New version bump + old text retained historically or changelog entry |

A BLOCKER may **never** be closed by:

- deleting the requirement
- shortening a formula body without SUPERSEDE + formulaVersion bump
- replacing content with historical-reference language
- moving text out of the normative tree without DEFER
- shrinking the Phase 04 CV range (e.g. CV-01..44 → CV-01..26)
- relaxing a Cognitive Law
- lowering Normative Surface without DEFER

**Deletion of a still-required normative element = REGRESSION_BY_DELETION = new BLOCKER.**

---

## Artifacts introduced

| Path | Role |
|------|------|
| `docs/AUDIT/Blocker-Ledger.md` | Append-only ledger of blockers |
| `docs/AUDIT/Normative-Surface-Baseline-0.1.md` | Minimum surface counts + measurement rules |
| `docs/DEFER/README.md` | DEFER template and rules |
| `scripts/normative-surface-check.mjs` | Executable surface gate |
| `docs/AMBC/AMBC-0.1.md` | §13 Anti-Deletion (version 0.1.2) |
| `docs/README.md` | Agent rules + index update |
| `docs/BUILD/Build-Manifest-0.1.md` | Gate non-shrink rule |

---

## Adversarial questions (mandatory before GREEN)

1. Could an independent implementer still be blocked by something this commit **removed** rather than **specified**?
2. Did Normative Surface decrease without a DEFER record?
3. Was any Phase gate range or CV range reduced?

If any answer is YES → not closed.

---

## One-line principle

> Closure is proof of **presence** (definition + evidence), never proof of **absence** (requirement gone).
