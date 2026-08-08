# Phase 04 — Physics Conformance Harness

## Run

```bash
node scripts/normative-surface-check.mjs
node phase04/run.mjs
```

Writes `/phase04-report.json`.

## Rules

- Expected values come **only** from `fixtures/CV-*.json` (canonical).
- Implementation under test: `physics.mjs`.
- Never `expected = implementation(input)`.
- GREEN only if 44/44 PASS + determinism + surface + schema.

## Fixtures

Normative pairs for CV-01..CV-44. Index: `docs/AKP/AKP-Conformance-Vectors-0.1.md` (0.1.4).
