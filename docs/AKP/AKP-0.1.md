# AKP – AILEXSI Kernel Physics

**Version:** 0.1.1 (Normative Patch 0.1 + 0.2 applied)  
**Status:** Normative  
**Scope:** Mathematical and time-dependent core models of the AILEXSI Cortex  
**Dependencies:** ACS, Normative-Patch-0.1

---

## AKP-0 Fundament

### 0.1 Wertebereich
All dimensionless cognitive scores are normalized to [0, 1] unless explicitly specified otherwise.

### 0.2 Determinismus
Identical input + parameters + Physics version → identical output. Random seed must be persisted when used.

### 0.3 Keine versteckten Parameter
Every parameter is explicitly declared (name, value, range, unit, source, version).

### 0.4 Physik-Engine-Grenzen
No LLMs, no databases, no GUIs, no network, no mutations, no semantic decisions. Pure calculation only.

---

## AKP-1 Zeit als Dimension

Six timestamps per ACS Law 7 / TemporalMetadata.

```text
Age(t) = (t − created_at) / T_scale
```

`T_scale` is a PhysicsParameter:

```text
name:    T_scale
value:   31536000          # seconds (1 year)
unit:    s
range:   [86400, 315360000] # 1 day … 10 years
source:  system_default
version: 0.1.1
```

Domain overrides must be stored in the parameter_set of every PhysicsCalculation.

```text
D(t) = e^(−λ · Δt)
```

where `Δt` = time since last relevant confirmation (`confirmed_at`).

`λ` is a PhysicsParameter:

```text
name:    lambda_decay
value:   0.0               # default for historical / stable knowledge
unit:    1/s
range:   [0, 1e-5]
source:  system_default
version: 0.1.1
```

Typical overrides: news = 1e-6, working memory = 1e-5. Must be part of parameter_set.

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

---

## AKP-3 Confidence

```text
BaseEvidence = E × SD
ContradictionFactor = 1 − C
Confidence = Clamp(BaseEvidence × ContradictionFactor, 0, 1)
```

---

## AKP-4 Memory Resonance (formalized)

| Symbol | Name | MVP Definition | Range |
|--------|------|----------------|-------|
| R_f | ReflectionInfluence | fraction of Reflections referencing this Cell | [0,1] |
| A_f | ActionInfluence | fraction of ActionIntents influenced by Cell | [0,1] |
| C_f | CreationInfluence | fraction of new Cells listing this as parent | [0,1] |
| L_f | RelationInfluence | normalized accepted outgoing Relations | [0,1] |
| Q_f | RecallInfluence | fraction of successful Retrievals that returned Cell | [0,1] |

Default weights (sum=1): w_r=0.25, w_a=0.20, w_c=0.20, w_l=0.20, w_q=0.15

```text
R_raw = w_r·R_f + w_a·A_f + w_c·C_f + w_l·L_f + w_q·Q_f
TemporalFactor(t) = e^(−μ · Age(t))     # default μ=0.1
R(t) = Clamp(R_raw × TemporalFactor(t), 0, 1)
```

---

## AKP-5 Memory Mass

Default weights: w_i=0.30, w_u=0.25, w_c=0.25, w_r=0.20

```text
M_raw = w_i·I + w_u·U + w_c·Confidence + w_r·R
Mass  = Clamp(M_raw, 0, 1)
```

---

## AKP-6 Memory Temperature (formalized)

```text
AccessRate       = min(1, accesses_in_last_24h / 10)
RecentInfluence  = max(R_f, A_f, Q_f) measured in last 7 days
WorkingSetFactor = 1 if in current Working Set else 0.3
T = Clamp(AccessRate × RecentInfluence × WorkingSetFactor, 0, 1)
```

---

## AKP-7 Memory Entropy (formalized)

```text
AgeDecay    = 1 − D(t)
SourceDecay = 1 − average(Evidence.reliability)
Uncertainty = 1 − Confidence
```

Default weights: w_a=0.25, w_c=0.30, w_s=0.20, w_u=0.25

```text
H = Clamp(w_a·AgeDecay + w_c·C + w_s·SourceDecay + w_u·Uncertainty, 0, 1)
```

---

## AKP-8 Memory Velocity

```text
V_M = ΔMass / Δt
V_R = ΔR / Δt
V_T = ΔT / Δt
```

---

## AKP-9 Memory Energy (formalized)

```text
ConnectivityPotential = min(1, count / 5)
```

where:
- high_Mass_Cell  := Mass ≥ 0.6
- weak_relation   := existing Relation with S_r < 0.4
- missing_relation := no Relation exists to a high_Mass_Cell that is within Graph Distance ≤ 2
- count            = number of such weak or missing relations

All thresholds are PhysicsParameters (defaults above).

```text
Energy = Clamp(N × ConnectivityPotential × (1 − H) × R, 0, 1)
```

---

## AKP-10 Memory Gravity (formalized)

```text
Connectivity = min(1, WeightedDegree / 10)
G = Clamp(Mass × R × Connectivity, 0, 1)
```

---

## AKP-11 Dream Mode (formalized)

```text
S   = existing Relation Strength (0 if none)
T_g = min(Confidence_A, Confidence_B)
N   = Novelty of the combination

DreamScore(A,B) = Clamp(E_A · E_B · R_A · R_B · (1 − S) · N · T_g, 0, 1)
```

**Safety Gate (all must pass):** T_g ≥ 0.4, N ≥ 0.3, S ≤ 0.5

---

## AKP-12–14

Cognitive State Vector is a projection.  
Physics Versioning is mandatory.  
Physics Engine has no side effects and invents nothing.

---

## Status

AKP 0.1.1 is fully formalized for the MVP. All previously undefined symbols have explicit MVP definitions and default parameters.
