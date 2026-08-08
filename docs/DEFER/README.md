# DEFER records

**Status:** Normative  
**Purpose:** The only honest way to leave a requirement out of a milestone without deleting it.

---

## Rules

1. A DEFER file is required before Normative Surface may decrease for that topic.
2. DEFER does **not** close a Cognitive Law.
3. DEFER does **not** allow Dream = Fact, mutable history, or Physics calling providers.
4. Each DEFER is scoped to a version (e.g. AILEXSI 0.1).
5. Reopen condition must be testable.

---

## Template

Copy to `docs/DEFER/DEFER-<short-name>-0.1.md`:

```markdown
# DEFER: <title>

**Status:** Active  
**Scope version:** AILEXSI 0.1  
**Date:** YYYY-MM-DD  
**Related blockers:** B-00N

## Deferred

Exact behavior or artifact not required in this scope.

## Reason

Why COMPLETE is not done yet (missing AKP formula, not MVP-critical, etc.).

## Must not

- List of regressions that remain forbidden even while deferred
- Example: LearningDomain must not silently mutate Parameter Set defaults

## Reopen when

Concrete condition (e.g. AKP defines feedback→parameter mapping + CV-xx green).

## Surface impact

Which baseline metric is allowed to stay incomplete (not deleted from docs).
```

---

## Active DEFERs

| File | Topic | Scope |
|------|-------|-------|
| *(none yet for surface reduction)* | | |

Open product gaps that remain specified as future work without lowering surface
are tracked in `docs/AUDIT/Blocker-Ledger.md` (B-001..), not as DEFER of deleted text.
