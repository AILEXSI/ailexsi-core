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
| Phase 06 — Memory Domain | **NEXT** |

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
# Prerequisites: PostgreSQL (or Docker), pnpm, Node.js 20+
pnpm install
# Docker: pnpm db:up
# Or local Postgres with DATABASE_URL
pnpm db:migrate
pnpm typecheck
pnpm test
pnpm test:integration   # requires live PostgreSQL — no skips in acceptance
pnpm test:architecture
node phase04/run.mjs    # must remain GREEN
```

Stack (ABS 0.2.0 binding): TypeScript strict · pnpm · PostgreSQL + pgvector · Drizzle · Zod · Vitest · Docker.

Packages:

- `@ailexsi/contracts` — DomainEvent, EventEnvelope, canonical types (AAS-Buch2)
- `@ailexsi/persistence` — Drizzle schema + migration for `events` table
- `@ailexsi/eventstore` — append-only EventStore with aggregateVersion + idempotencyKey enforcement

Acceptance verified against live PostgreSQL: append, version ordering, concurrency rejection, idempotency, stream order, migration, append-only invariant.

## Rule

No Phase 06 (Memory Domain) until Phase 05 acceptance is closed. B-007 is COMPLETE.
