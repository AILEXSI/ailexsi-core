# AILEXSI Core

**First Artificial Cortex**

Specification repository for the AILEXSI cognitive kernel.

See [`docs/README.md`](docs/README.md) for normative hierarchy and agent protocol.

## Status

| Item | State |
|------|--------|
| Specs | Normative, self-contained (**AKP 0.1.4 / 0.2.5**, AAS-Buch2 0.3.4) |
| Phase 04 — Physics Conformance | **COMPLETE / GREEN** (CV-01..CV-44) |
| Current implementation surface | Phase 04 harness only (`phase04/`) |
| Next phase (authoritative) | **Phase 05 — Database + Event Store** |
| Subsequent | Phase 06 — Memory Domain |

Authoritative phase order is defined by **AMBC 0.1.2 §8** and **Build Manifest 0.2.1**. Do not renumber.

## Phase 04 (COMPLETE)

```bash
node scripts/normative-surface-check.mjs
node phase04/run.mjs
```

- Default run does **not** modify the worktree (clean checkout stays clean).
- Optional stable report: `node phase04/run.mjs --write`
- Authoritative result after `--write`: `phase04-report.json`
- Requires: Node.js only (no npm install, no network, no DB).

## Phase 05 (NEXT)

Database + Event Store (per Build Manifest / AMBC).

Memory Domain is **Phase 06**. Do not implement Memory until Phase 05 is complete.

## Rule

No Phase 05+ implementation until Phase 04 remains reproducibly GREEN from a clean checkout.
