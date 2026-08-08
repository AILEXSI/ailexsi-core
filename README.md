# AILEXSI Core

**First Artificial Cortex**

Specification repository for the AILEXSI cognitive kernel.

See [`docs/README.md`](docs/README.md) for normative hierarchy and agent protocol.

## Status

| Item | State |
|------|--------|
| Specs | Normative, self-contained (**AKP 0.1.4 / 0.2.5**, AAS-Buch2 0.3.4) |
| Phase 04 — Physics Conformance | **COMPLETE / GREEN** (CV-01..CV-44) |
| Phase 05 — Database + Event Store | **COMPLETE / GREEN** |
| Phase 06 — Memory Domain | **IN PROGRESS** |
| Phase 07 — Projection | **NEXT** (after Phase 06 GREEN) |

Authoritative phase order: **AMBC 0.1.2 §8** + **Build Manifest 0.2.1**. Do not renumber.

## Phase 04 (COMPLETE)

```bash
node scripts/normative-surface-check.mjs
node phase04/run.mjs
```

- Default run does **not** modify the worktree.
- Optional stable report: `node phase04/run.mjs --write`
- Requires: Node.js only (no npm install for Phase 04).

## Phase 05 (COMPLETE / GREEN)

Database + Event Store (PostgreSQL + Drizzle + DomainEvent contracts).

```bash
pnpm install
pnpm db:migrate
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:architecture
node phase04/run.mjs
```

## Phase 06 (IN PROGRESS)

Memory Domain (`@ailexsi/memory`) — create / get / update / archive / restore / getHistory via EventStore only.

Packages:

- `@ailexsi/contracts` — DomainEvent, EventEnvelope, MemoryCell, MemoryVersion, Provenance, TemporalMetadata, … (AAS-Buch2)
- `@ailexsi/persistence` — events table
- `@ailexsi/eventstore` — append-only EventStore
- `@ailexsi/memory` — MemoryDomain service (EventStore write path, rebuildable projection, AAS-54)

```bash
pnpm install
pnpm db:migrate
pnpm typecheck
pnpm test
pnpm test:integration   # includes MemoryDomain + AAS-54 replay
pnpm test:architecture
node phase04/run.mjs    # must remain GREEN
```

## Rule

No Phase 07 until Phase 06 is GREEN. B-007 is COMPLETE.
