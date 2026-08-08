# AAS – Scheduler Policy 0.1

**Version:** 0.1.0  
**Status:** Normative  
**Scope:** When and how Reflection, Dream, and Maintenance cycles are triggered  
**Dependencies:** ACS 0.1.1, AAS-Buch2 0.3.4, AAS-Buch3 0.2.0, AKP 0.2.5  
**Closes:** Blocker-Ledger B-003

---

## S-0 Absolute rules

1. Scheduler is **Infrastructure**. It contains **no** cognitive formulas.
2. Scheduler only emits **Commands** into Domain Layer.
3. Domain produces Events; Physics is invoked only by Domain, never by Scheduler.
4. Dream output remains HYPOTHESIS/CANDIDATE only (ACS Law 4).
5. At-least-once command delivery; correctness via idempotencyKey on commands.

---

## S-1 Cycle kinds

```ts
type SchedulerCycleKind =
  | "maintenance"
  | "reflection"
  | "dream";
```

| Kind | Purpose | Domain command |
|------|---------|----------------|
| maintenance | Validation, contradiction scan, index hygiene, decay tick, backup verify | `RunMaintenanceCycle` |
| reflection | Pattern/trend/contradiction insights from accepted memory | `RunReflectionCycle` |
| dream | Candidate generation under Dream Safety Gate | `RunDreamCycle` |

---

## S-2 Default schedule (MVP)

All times UTC. Intervals are configuration under Parameter Set **PS-013 Scheduler** (see AKP-Parameter-Sets).

```text
maintenance_interval_s   = 3600      // 1 hour
reflection_interval_s    = 21600     // 6 hours
dream_interval_s         = 86400     // 24 hours
cycle_jitter_s           = 0         // MVP: no random jitter (determinism)
max_concurrent_cycles    = 1         // global: only one cycle runs at a time
```

**Tick rule:**

```text
On each scheduler tick (minimum resolution 1 s):
  due = all kinds where (now - lastSuccessAt[kind]) >= interval_s[kind]
  If a cycle is already running → do not start another (queue at most one pending per kind).
  Else start the highest-priority due kind (see S-3).
```

`lastSuccessAt[kind]` is persistent scheduler state (not a MemoryCell).

---

## S-3 Priority order (when multiple due)

```text
1. maintenance
2. reflection
3. dream
```

Exactly one starts. Others remain due for the next free slot.

---

## S-4 Command shape + idempotency

```ts
interface SchedulerCommand {
  commandType: "RunMaintenanceCycle" | "RunReflectionCycle" | "RunDreamCycle";
  cycleId: UUID;                 // stable for this logical cycle attempt window
  scheduledFor: Timestamp;       // canonical planned time (truncated to second)
  idempotencyKey: string;        // see below
  correlationId?: UUID;
}
```

**idempotencyKey (canonical):**

```text
"sched:" + commandType + ":" + scheduledFor
```

Example: `sched:RunDreamCycle:2026-08-08T00:00:00.000Z`

Same key + identical payload → return original result, no duplicate work.  
Same key + different payload → integrity violation.

---

## S-5 Execution sequence inside a cycle

**Maintenance:**

```text
1. Validate graph integrity (symmetric edges)
2. Contradiction signal refresh (Domain → Physics for scores only)
3. Index maintenance hook (Infrastructure)
4. Decay / temporal eligibility bookkeeping
5. Backup verification hook
Emit MaintenanceCycleCompleted | MaintenanceCycleFailed
```

**Reflection:**

```text
1. Select candidate MemoryIds via Domain query (not Scheduler logic)
2. Domain may call providers for suggestions only
3. Physics scores remain authoritative
4. Emit Reflection artifacts as Domain events (status generated)
Emit ReflectionCycleCompleted | ReflectionCycleFailed
```

**Dream:**

```text
1. Domain selects candidate pairs
2. Physics Dream 2.0 + Safety Gate
3. On pass: DreamCandidate status=generated only
4. On gate fail: no candidate persisted as knowledge
Emit DreamCycleCompleted | DreamCycleFailed
```

---

## S-6 Retry + failure semantics

```text
max_retries_per_cycle = 3
retry_backoff_s       = 60, 300, 900   // fixed sequence, not random
```

| Outcome | Behavior |
|---------|----------|
| Success | lastSuccessAt[kind] = now; clear retry count |
| Failure before any event append | retry with **same** idempotencyKey |
| Failure after partial events | do not invent compensating state; next attempt uses **new** cycleId and new scheduledFor only if policy advances the window; otherwise manual quarantine |
| Exhausted retries | status=quarantined; kind skipped until operator clears or next interval after quarantine_ttl_s |

```text
quarantine_ttl_s = 86400
```

Quarantine does not delete history. It only suppresses automatic starts for that kind.

---

## S-7 Overlap + shutdown

- `max_concurrent_cycles = 1` global.
- On process shutdown: running cycle may finish or abort without event; safe restart uses idempotencyKey.
- Scheduler MUST NOT run Dream and Reflection concurrently with Maintenance.

---

## S-8 Tests (normative checklist)

| ID | Assertion |
|----|-----------|
| SCH-01 | Only one cycle runs when maintenance+reflection+dream all due (maintenance wins) |
| SCH-02 | idempotencyKey collision with identical payload does not duplicate Domain work |
| SCH-03 | Failed cycle retries with same idempotencyKey up to max_retries |
| SCH-04 | After max_retries, kind is quarantined |
| SCH-05 | Dream cycle never persists Fact lifecycle from Scheduler path |
| SCH-06 | Scheduler emits commands only; no direct Physics import |
| SCH-07 | Intervals respected within 1 s tick resolution |

These tests are **runtime/integration** tests (not Phase 04 score CVs). Phase 04 remains physics-only.

---

## Status

AAS-Scheduler-Policy 0.1.0 closes B-003 for MVP: schedule, order, idempotency, retry, failure, and test IDs.
