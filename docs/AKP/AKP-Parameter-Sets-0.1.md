# AKP Parameter Sets 0.1

**Status:** Normative  
**Physics Version:** 0.1.1 / 0.2.1  
**Purpose:** Freeze all MVP default values so that identical inputs produce identical outputs.

Every PhysicsCalculation must record the Parameter Set version used.

---

## AKP-PS-001 TemporalDecayParameterSet

```text
name:              TemporalDecayParameterSet
version:           0.1
physics_version:   0.1.1

T_scale:
  value:           31536000
  unit:            s
  range:           [86400, 315360000]
  meaning:         Age normalization scale (1 year default)
  rationale:       One year is the natural unit for personal knowledge stability.

lambda_decay:
  value:           0.0
  unit:            1/s
  range:           [0, 1e-5]
  meaning:         Confirmation decay rate
  rationale:       MVP treats most knowledge as historically stable (λ = 0).
                   Domain overrides (news, working memory) are explicit parameter overrides.

mu_temporal_factor:
  value:           0.1
  unit:            1
  range:           [0, 1]
  meaning:         Resonance temporal decay coefficient
```

---

## AKP-PS-002 ResonanceWeights

```text
name:              ResonanceWeights
version:           0.1

w_r (Reflection):  0.25
w_a (Action):      0.20
w_c (Creation):    0.20
w_l (Relation):    0.20
w_q (Recall):      0.15

Σ = 1.00
```

---

## AKP-PS-003 MassWeights

```text
name:              MassWeights
version:           0.1

w_i (Importance):  0.30
w_u (Usage):       0.25
w_c (Confidence):  0.25
w_r (Resonance):   0.20

Σ = 1.00
```

---

## AKP-PS-004 EntropyWeights

```text
name:              EntropyWeights
version:           0.1

w_a (AgeDecay):    0.25
w_c (Contradiction): 0.30
w_s (SourceDecay): 0.20
w_u (Uncertainty): 0.25

Σ = 1.00
```

---

## AKP-PS-005 EnergyThresholds

```text
name:              EnergyThresholds
version:           0.1

high_Mass_threshold:     0.6
weak_relation_threshold: 0.4
max_graph_distance:      2
denominator:             5
```

ConnectivityPotential = min(1, count / 5)  
where count = number of high-Mass cells (Mass ≥ 0.6) that are either missing a relation or connected only by a weak relation (S_r < 0.4) within Distance ≤ 2.

---

## AKP-PS-006 RelationStrengthWeights

```text
name:              RelationStrengthWeights
version:           0.1

w_e (Evidence):    0.35
w_c (Coherence):   0.25
w_t (Temporal):    0.20
w_u (Usage):       0.20

Σ = 1.00

LLM_hypothesis_max_S_r: 0.3
```

---

## AKP-PS-007 RetrievalScoreWeights

```text
name:              RetrievalScoreWeights
version:           0.1

w_s (Semantic):    0.30
w_g (Graph):       0.15
w_t (Temporal):    0.10
w_r (Resonance):   0.15
w_m (Mass):        0.10
w_c (Confidence):  0.10
w_n (NoveltyFit):  0.10

Σ = 1.00

diversity_cosine_threshold: 0.92
diversity_penalty_factor:  0.5
```

Missing component values default to 0.0 (do not invent values).

---

## AKP-PS-008 CentralityParameters

```text
name:              CentralityParameters
version:           0.1

power_iteration_start:     uniform 1/N
max_iterations:            100
convergence_tolerance:     1e-6
isolated_node_centrality:  0.0
empty_graph_centrality:    0.0
output_range:              [0, 1]  (L1-normalized after convergence)

MaxPossibleStrength:
  definition: max observed degree in the current graph × 1.0
  empty_graph_fallback: 1.0
```

---

## AKP-PS-009 AttentionParameters

```text
name:              AttentionParameters
version:           0.1

B_total:                   100          # abstract capacity units
maintenance_reservation:   0.15         # 15 % of B_total
exploration_rate_dream:    0.30
exploration_rate_default:  0.10
load_threshold:            0.85
saturation_delta:          0.02         # top-k ranking change

Cost_i: declared by each operation (must be ≥ 0)
Urgency: 1.0 if user-initiated or deadline, else = Temperature
Potential: = Energy of the Cell

Allocation algorithm (deterministic):
1. Reserve maintenance_reservation × B_total
2. Sort remaining candidates by Priority descending
3. Allocate Cost_i in order while remaining_budget ≥ Cost_i
4. Skip candidates whose Cost_i > remaining_budget
5. Tie-break by MemoryId ascending (lexicographic UUID)
```

---

## AKP-PS-010 DreamSafetyGates

```text
name:              DreamSafetyGates
version:           0.1

T_g_minimum:       0.4
N_minimum:         0.3
S_r_maximum:       0.5

DreamScore = Clamp(E_A × E_B × BridgePotential × N × T_g × AttentionAllocation × (1 − S_r), 0, 1)

BridgePotential = Bridge(A) × Bridge(B)
AttentionAllocation = remaining_Budget / B_total

Output classification: HYPOTHESIS / CANDIDATE only.
Never auto-promote to FACT.
```

---

## AKP-PS-011 EmergenceAndIsland

```text
name:              EmergenceAndIsland
version:           0.1

Surprise  = 1 − max cosine similarity of the pair to any existing accepted Relation
Coherence = min(Confidence_A, Confidence_B)

Emergence = Clamp(N × BridgePotential × Surprise × Coherence, 0, 1)

ExternalConnectivity = (edges leaving the cluster) / max(1, total edges of cluster)
IslandScore = Clamp(Cohesion × (1 − ExternalConnectivity), 0, 1)

Empty graph / empty cluster → IslandScore = 0.0
```

---

## Rule

Any PhysicsCalculation that does not record the Parameter Set version used is non-conformant.
Changing a default value requires a new Parameter Set version.
