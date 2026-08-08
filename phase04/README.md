# Phase 04 — Physics Conformance Harness

## Run (clean worktree)

```bash
node scripts/normative-surface-check.mjs
node phase04/run.mjs
```

Default mode **does not write** `phase04-report.json`. A successful run leaves a clean git worktree.

## Optional: write stable report

```bash
node phase04/run.mjs --write
```

Writes a **stable** report (no mutable git SHA as authority). Provenance uses suite/physics versions only.

## Rules

- Expected values come only from `fixtures/CV-*.json` (canonical).
- Implementation under test: `physics.mjs`.
- Never `expected = implementation(input)`.
- Every fixture checks `expectedStatus` vs `actualStatus`.
- JSON Schema validated via `schema-validate.mjs` against `docs/schemas/conformance_v0.2.5.json`.
- GREEN only if 44/44 PASS + determinism + expectedStatus + surface + schema.
