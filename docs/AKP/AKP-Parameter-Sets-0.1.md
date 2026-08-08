# AKP Parameter Sets 0.1

**Status:** Normative  
**Physics Version:** 0.1.3 / 0.2.3  
**Purpose:** Freeze all MVP default values so that identical inputs produce identical outputs.

Every PhysicsCalculation must record the Parameter Set version used.

---

## AKP-PS-001 TemporalDecayParameterSet

```text
name:              TemporalDecayParameterSet
version:           0.1
physics_version:   0.1.3

T_scale:
  value:           31536000
  unit:            s
  range:           [86400, 315360000]

lambda_decay:
  value:           0.0
  unit:            1/s
  range:           [0, 1e-5]

mu_temporal_factor:
  value:           0.1
  unit:            1
  range:           [0, 1]
```

---

## AKP-PS-002 ResonanceWeights

```text
name:              ResonanceWeights
version:           0.1
physics_version:   0.1.3

w_r=0.25  w_a=0.20  w_c=0.20  w_l=0.20  w_q=0.15
Σ = 1.00
```

---

## AKP-PS-003 MassWeights

```text
name:              MassWeights
version:           0.1
physics_version:   0.1.3

w_i=0.30  w_u=0.25  w_c=0.25  w_r=0.20
Σ = 1.00
```

---

## AKP-PS-004 EntropyWeights

```text
name:              EntropyWeights
version:           0.1
physics_version:   0.1.3

w_a=0.25  w_c=0.30  w_s=0.20  w_u=0.25
Σ = 1.00
```

---

## AKP-PS-005 EnergyThresholds

```text
name:              EnergyThresholds
version:           0.1
physics_version:   0.1.3

high_Mass_threshold:     0.6
weak_relation_threshold: 0.4
max_graph_distance:      2
denominator:             5
```

---

## AKP-PS-006 RelationStrengthWeights

```text
name:              RelationStrengthWeights
version:           0.1
physics_version:   0.2.3

w_e=0.35  w_c=0.25  w_t=0.20  w_u=0.20
Σ = 1.00
LLM_hypothesis_max_S_r: 0.3
```

---

## AKP-PS-007 RetrievalScoreWeights

```text
name:              RetrievalScoreWeights
version:           0.1
physics_version:   0.2.3

w_s=0.30  w_g=0.15  w_t=0.10  w_r=0.15  w_m=0.10  w_c=0.10  w_n=0.10
Σ = 1.00
diversity_cosine_threshold: 0.92
diversity_penalty_factor:  0.5
```

---

## AKP-PS-008 CentralityParameters

```text
name:              CentralityParameters
version:           0.1
physics_version:   0.2.3

power_iteration_start:     uniform 1/N
max_iterations:            100
convergence_tolerance:     1e-6
isolated_node_centrality:  0.0
empty_graph_centrality:    0.0
MaxPossibleStrength: max observed degree × 1.0 (fallback 1.0)
```

---

## AKP-PS-009 AttentionParameters

```text
name:              AttentionParameters
version:           0.1
physics_version:   0.2.3

B_total:                   100
maintenance_reservation:   0.15
exploration_rate_dream:    0.30
exploration_rate_default:  0.10
load_threshold:            0.85
saturation_delta:          0.02
```

---

## AKP-PS-010 DreamSafetyGates

```text
name:              DreamSafetyGates
version:           0.1
physics_version:   0.2.3
formula_version:   dream-2.0.0

T_g_minimum:       0.4
N_minimum:         0.3
S_r_maximum:       0.5
```

---

## AKP-PS-011 EmergenceAndIsland

```text
name:              EmergenceAndIsland
version:           0.1
physics_version:   0.2.3
```

---

## Rule

Any PhysicsCalculation that does not record the Parameter Set version used is non-conformant.
Changing a default value requires a new Parameter Set version.
