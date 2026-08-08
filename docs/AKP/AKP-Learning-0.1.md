# AKP – Learning Feedback Mapping 0.1

**Version:** 0.1.0  
**Status:** Normative  
**Scope:** How LearningDomain feedback becomes future Parameter Set values for Ranking / Attention / Retrieval weights  
**Dependencies:** ACS 0.1.1, AKP 0.1.4, AKP 0.2.5, AKP-Parameter-Sets-0.1, AKP-Formula-Registry-0.1, AAS-Buch2 0.3.4  
**Closes:** Blocker-Ledger B-002

---

## L-0 Absolute rules

1. Physics remains pure. Learning **never** mutates an in-flight PhysicsCalculation.
2. Learning **never** invents new score formulas or new weight symbols.
3. Learning may only propose updates to **existing** Parameter Set identifiers (PS-001..PS-012 and keys defined therein).
4. A Parameter Set change takes effect only after an explicit **ActivateParameterSet** command succeeds and a new `parameterSetVersion` is recorded.
5. Historical PhysicsCalculations keep their original parameterSetVersion (Invariant I3).
6. No LLM may directly set Parameter Set values. LLM may suggest; mapping + activation remain deterministic and recorded.

---

## L-1 Feedback types (canonical)

```ts
type LearningFeedbackType =
  | "accept_retrieval"
  | "reject_retrieval"
  | "accept_relation"
  | "reject_relation"
  | "accept_dream"
  | "reject_dream"
  | "boost_importance"
  | "lower_importance"
  | "mark_useful"
  | "mark_noise";
```

```ts
interface LearningFeedback {
  id: UUID;
  type: LearningFeedbackType;
  subjectIds: UUID[];          // MemoryIds / RelationIds as applicable
  actorId: string;             // user or authorized system actor
  createdAt: Timestamp;
  strength?: Score;            // optional explicit strength; default 1.0
  note?: string;
}
```

---

## L-2 Allowed parameter targets (MVP)

Only these keys may be adjusted by Learning:

| parameterSetId | key | meaning |
|----------------|-----|--------|
| PS-003 | w_i | Mass weight Importance |
| PS-007 | w_s | Retrieval semantic weight |
| PS-007 | w_r | Retrieval resonance weight |
| PS-007 | diversity_penalty_factor | Diversity penalty |
| PS-009 | load_threshold | Attention load threshold |
| PS-012 | retrieval_final_k | Final retrieval count |

All other PS keys are **immutable via Learning** in MVP (change only by SUPERSEDE of Parameter Sets doc).

---

## L-3 Mapping function — formulaId: `learning-feedback-map-1.0.0`

Not continuous ML. Deterministic discrete deltas.

```text
strength = feedback.strength if present else 1.0
clamp strength to [0, 1]

baseDelta = 0.01 × strength

Mapping table (exactly):

accept_retrieval  → PS-007.w_s += baseDelta
reject_retrieval  → PS-007.w_s -= baseDelta
accept_relation   → PS-007.w_r += baseDelta
reject_relation   → PS-007.w_r -= baseDelta
accept_dream      → (no parameter change; records outcome only)
reject_dream      → (no parameter change; records outcome only)
boost_importance  → PS-003.w_i += baseDelta
lower_importance  → PS-003.w_i -= baseDelta
mark_useful       → PS-007.diversity_penalty_factor -= 0.5 × baseDelta
mark_noise        → PS-007.diversity_penalty_factor += 0.5 × baseDelta
```

**Weight renormalization (only when a weight vector was touched):**

```text
If any of PS-003 weights changed: renormalize PS-003 weights to sum = 1.0
  by scaling all four weights (w_i,w_u,w_c,w_r) proportionally.
If any of PS-007 retrieval weights changed: renormalize the seven retrieval weights to sum = 1.0.
```

**Clamps after apply:**

```text
every weight ∈ [0.05, 0.60]
diversity_penalty_factor ∈ [0.20, 0.80]
load_threshold ∈ [0.70, 0.95]
retrieval_final_k ∈ [5, 50] and integer
```

If a delta would leave the clamp range, clamp to boundary (no rejection).

**Dream feedback** does not change parameters in MVP; it only produces LearningOutcome with status recorded for audit.

---

## L-4 ParameterSetProposal + Activation

```ts
interface ParameterSetProposal {
  id: UUID;
  baseParameterSetId: string;
  baseParameterSetVersion: string;
  proposedParameterSetVersion: string;  // monotonic string, e.g. "0.1.1"
  deltas: Array<{ key: string; before: number; after: number }>;
  sourceFeedbackIds: UUID[];
  formulaId: "learning-feedback-map-1.0.0";
  formulaVersion: "1.0.0";
  createdAt: Timestamp;
  status: "proposed" | "activated" | "rejected" | "superseded";
}
```

**Activation rule (MVP):**

```text
1. LearningDomain appends ParameterSetProposed event (idempotencyKey required).
2. ActivateParameterSet command may be issued only by authorized actor.
3. On activation: ParameterSetActivated event; active version pointer updates.
4. Subsequent PhysicsCalculations MUST record the new parameterSetVersion.
5. Rejection leaves active version unchanged.
```

Batching: multiple feedbacks MAY be folded into one proposal; mapping applies sequentially in feedback `createdAt` ascending, then `id` ascending.

---

## L-5 Events

```text
LearningFeedbackRecorded
ParameterSetProposed
ParameterSetActivated
ParameterSetRejected
```

All carry aggregateVersion + idempotencyKey per AAS-Buch2.

---

## L-6 What Learning must not do

- Call Physics with side effects
- Change formulaId definitions
- Auto-activate Parameter Sets without ActivateParameterSet
- Adjust keys outside the MVP allow-list
- Infer Urgency, WorkingSet, or clusters

---

## Status

AKP-Learning 0.1.0 closes B-002 for MVP: feedback → discrete parameter deltas → versioned proposal → explicit activation.
