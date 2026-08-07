# AKP – AILEXSI Kernel Physics

**Version:** 0.1.2  
**Status:** Normative  
**Scope:** Mathematical and time-dependent core models of the AILEXSI Cortex  
**Dependencies:** ACS, AKP-Parameter-Sets-0.1

---

## AKP-0 Fundament

Deterministic pure calculation only. No LLMs, no side effects, no hidden parameters.

---

## AKP-1 Zeit als Dimension

T_scale and lambda_decay are PhysicsParameters (see AKP-PS-001).

---

## AKP-2 Primitive Cognitive Signals

| Signal | Symbol | Range | How obtained |
|--------|--------|-------|--------------|
| Importance | I | [0,1] | Explicit user priority or heuristic |
| Usage | U | [0,1] | Normalized access count in rolling window |
| Evidence Strength | E | [0,1] | Aggregated reliability of linked Evidence |
| Source Diversity | SD | [0,1] | Fraction of independent independenceGroups |
| Contradiction | C | [0,1] | Strength of contradicting Evidence |
| Novelty | N | [0,1] | 1 − max cosine similarity to existing Cells |

### Operational definitions of primitives (MVP)

**Importance (I)**  
Explicit user priority if present, otherwise system heuristic (default 0.5).  
Must be recorded as a PhysicsParameter when non-default.

**Usage (U)**  
```text
U = min(1, access_count_in_rolling_window / access_window_size)
```
Default window = 30 days, access_window_size = 20. Both are PhysicsParameters.

**Evidence Strength (E)**  
```text
E = average(Evidence.reliability) over all linked Evidence
```
Missing reliability → treat as 0.5. Empty evidence list → E = 0.

**Source Diversity (SD)**  
```text
unique_groups = set of distinct independenceGroup values among linked Evidence
SD = |unique_groups| / max(1, |Evidence|)
```
Evidence items without independenceGroup share a single synthetic group `"unknown"`.  
Duplicates of the same source therefore cannot inflate SD (Invariant I6).

**Contradiction (C)**  
```text
C = sum(reliability of Evidence with type = "contradicting") / max(1, sum(all Evidence reliabilities))
```
Clamped to [0,1].

**Novelty (N)**  
```text
N = 1 − max_cosine_similarity(embedding(this), embedding(any other Cell))
```
If no other Cells exist → N = 1.0.  
Embedding model and dimension must be recorded in the PhysicsCalculation parameter_set.

---

## AKP-3–11 Confidence, Resonance, Mass, Temperature, Entropy, Velocity, Energy, Gravity, Dream

As formalized previously with Parameter Sets AKP-PS-002 … AKP-PS-010.

ConnectivityPotential uses high_Mass_threshold = 0.6 and weak_relation_threshold = 0.4 (AKP-PS-005).

Dream Safety Gates: T_g ≥ 0.4, N ≥ 0.3, S_r ≤ 0.5.

---

## Status

AKP 0.1.2 – primitive signals are now operationally defined. All formulas use versioned Parameter Sets.
