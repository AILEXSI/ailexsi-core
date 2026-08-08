# AILEXSI Core

**First Artificial Cortex**

Specification repository for the AILEXSI cognitive kernel.

See [`docs/README.md`](docs/README.md) for normative hierarchy and agent protocol.

## Status

- Specs: normative, self-contained (**AKP 0.1.4 / 0.2.5**, AAS-Buch2 0.3.4)
- Implementation: Phase 04 Physics Conformance harness only (`phase04/`)
- Conformance suite: **0.1.4** (CV-01..CV-44)
- Phase 04 status: see `phase04-report.json` (authoritative after `node phase04/run.mjs`)
- Rule: No Phase 05+ until Phase 04 report `status` is `GREEN`

## Phase 04

```bash
node scripts/normative-surface-check.mjs
node phase04/run.mjs
```

Default run does **not** modify the worktree. Optional stable report: `node phase04/run.mjs --write`.
