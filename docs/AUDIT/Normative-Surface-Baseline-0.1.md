# Normative Surface Baseline 0.1

**Status:** Normative  
**Baseline commit:** c4ae2e16118ba053f17a10e5f13861422c2429d0  
**Measurement tool:** `scripts/normative-surface-check.mjs`

---

## Definition

```text
Normative Surface =
  formulaId_count
+ cv_count
+ cognitive_law_count
+ canonical_interface_count
+ build_phase_count
+ ledger_open_or_closed_row_count (informational; open rows do not reduce surface)
```

Surface measures **presence of normative commitments**, not code size.

---

## Minimum baselines (must not decrease without DEFER)

| Metric | Minimum | Source |
|--------|---------|--------|
| formulaId (Formula Registry rows) | 39 | `docs/AKP/AKP-Formula-Registry-0.1.md` |
| CV identifiers CV-01..CV-44 | 44 | `docs/AKP/AKP-Conformance-Vectors-0.1.md` + Manifest gate |
| Cognitive Laws | 7 | `docs/ACS/ACS-0.1.md` Law 1–7 |
| Canonical AAS interfaces / types (Buch2) | 20 | `docs/AAS/AAS-Buch2.md` (MemoryCell through EventEnvelope / Replay) |
| Build phases | 22 | AMBC §8 / Build Manifest 01–22 |
| Phase 04 CV range | CV-01..CV-44 | Build Manifest 0.2 |
| Physics versions | AKP 0.1.4 and 0.2.5 named | Parameter Sets + AKP headers |

---

## Gate rule

```text
if measured[metric] < baseline[metric]
   AND no matching DEFER record explaining the reduction
then
   FAIL: REGRESSION_BY_DELETION
```

Phase 04 gate range may only **stay** or **grow** (more CVs). Shrinking is forbidden without DEFER that re-scopes the milestone (generally not allowed for 0.1 Cortex).

---

## What may increase freely

- New formulaIds (with formulaVersion + registry row)
- New CVs
- New interfaces
- New ledger rows
- New DEFER files

## What may decrease only with DEFER/SUPERSEDE

- Any baseline metric above
- Any Cognitive Law
- Any BUILD component from AMBC §3 without DEFER of that component

---

## Adversarial check

```text
Green without growth or explicit DEFER is red
when the claim is "we removed blockers by removing requirements".
```
