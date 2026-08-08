# Phase 04 — Physics Conformance Harness

**Purpose:** Execute CV-01..CV-44 against pure AKP Physics without DB, network, or providers.

## Rules

- Expected values come **only** from fixtures distilled from `docs/AKP/AKP-Conformance-Vectors-0.1.md`.
- If a CV has no unambiguous canonical input/expected pair → `NOT_EXECUTED` + `SPECIFICATION_BLOCKER`.
- Do **not** invent expected values to force GREEN.
- Phase 04 is GREEN only if all 44 execute and PASS.

## Run

```bash
node phase04/run.mjs
```

Writes `phase04-report.json` at repository root.

## Layout

```text
phase04/
  inventory.json     # CV-01..CV-44 executability map
  physics.mjs        # pure formula subset for executable CVs
  fixtures/CV-*.json # canonical fixtures only
  run.mjs            # harness
  README.md
```
