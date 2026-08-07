# AKP – AILEXSI Kernel Physics

**Version:** 0.1.2  
**Status:** Normative (self-contained)  
**Scope:** Mathematical and time-dependent core models of the AILEXSI Cortex  
**Dependencies:** ACS 0.1.1, AKP-Parameter-Sets-0.1

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

```text
Age(t) = (t − created_at) / T_scale
```

T_scale PhysicsParameter (default):
```text
name: T_scale  value: 31536000  unit: s  range: [86400, 315360000]  version: 0.1.2
```

```text
D(t) = e^(−λ · Δt)
```
Δt = time since last confirmation (confirmed_at).

lambda_decay PhysicsParameter (default):
```text
name: lambda_decay  value: 0.0  unit: 1/s  range: [0, 1e-5]  version: 0.1.2
```

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

### Operational definitions (MVP)

**Importance (I)**  
Explicit user priority if present, otherwise system heuristic (default 0.5). Recorded as PhysicsParameter when non-default.

**Usage (U)**  
```text
U = min(1, access_count_in_rolling_window / access_window_size)
```
Default window = 30 days, access_window_size = 20.

**Evidence Strength (E)**  
```text
E = average(Evidence.reliability) over all linked Evidence
```
Missing reliability → 0.5. Empty evidence list → E = 0.

**Source Diversity (SD)**  
```text
unique_groups = set of distinct independenceGroup values among linked Evidence
SD = |unique_groups| / max(1, |Evidence|)
```
Evidence without independenceGroup share synthetic group `"unknown"`. Duplicates of same source cannot inflate SD (Invariant I6).

**Contradiction (C)**  
```text
C = sum(reliability of Evidence with type = "contradicting") / max(1, sum(all Evidence reliabilities))
```
Clamped to [0,1].

**Novelty (N)**  
```text
N = 1 − max_cosine_similarity(embedding(this), embedding(any other Cell))
```
No other Cells → N = 1.0. Embedding model + dimension recorded in PhysicsCalculation parameter_set.

---

## AKP-3 Confidence

```text
BaseEvidence        = E × SD
ContradictionFactor = 1 − C
Confidence          = Clamp(BaseEvidence × ContradictionFactor, 0, 1)
```

---

## AKP-4 Memory Resonance

| Symbol | Name | Definition (MVP) | Range |
|--------|------|------------------|-------|
| R_f | ReflectionInfluence | fraction of Reflections referencing this Cell | [0,1] |
| A_f | ActionInfluence | fraction of ActionIntents influenced by Cell | [0,1] |
| C_f | CreationInfluence | fraction of new Cells listing this as parent | [0,1] |
| L_f | RelationInfluence | see normalization below | [0,1] |
| Q_f | RecallInfluence | fraction of successful Retrievals that returned Cell | [0,1] |

**L_f normalization (canonical):**
```text
L_f = min(1, accepted_outgoing_relations / max(1, max_accepted_outgoing_in_system))
```
max_accepted_outgoing_in_system = maximum observed accepted outgoing relation count across all Cells at calculation time (minimum 1).

Default weights (sum=1): w_r=0.25, w_a=0.20, w_c=0.20, w_l=0.20, w_q=0.15

```text
R_raw = w_r·R_f + w_a·A_f + w_c·C_f + w_l·L_f + w_q·Q_f
TemporalFactor(t) = e^(−μ · Age(t))     # default μ = 0.1
R(t) = Clamp(R_raw × TemporalFactor(t), 0, 1)
```

---

## AKP-5 Memory Mass

Default weights (sum=1): w_i=0.30, w_u=0.25, w_c=0.25, w_r=0.20

```text
M_raw = w_i·I + w_u·U + w_c·Confidence + w_r·R
Mass  = Clamp(M_raw, 0, 1)
```

---

## AKP-6 Memory Temperature

```text
AccessRate       = min(1, accesses_in_last_24h / 10)
RecentInfluence  = max(R_f, A_f, Q_f) measured in last 7 days
WorkingSetFactor = 1 if in current Working Set else 0.3
T = Clamp(AccessRate × RecentInfluence × WorkingSetFactor, 0, 1)
```

---

## AKP-7 Memory Entropy

```text
AgeDecay    = 1 − D(t)
SourceDecay = 1 − average(Evidence.reliability)
Uncertainty = 1 − Confidence
```

Default weights (sum=1): w_a=0.25, w_c=0.30, w_s=0.20, w_u=0.25

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
Δt = time between the two most recent PhysicsCalculations (minimum 1 s).

---

## AKP-9 Memory Energy

```text
ConnectivityPotential = min(1, count / 5)
```
where:
- high_Mass_Cell := Mass ≥ 0.6
- weak_relation := existing Relation with S_r < 0.4
- missing_relation := no Relation to a high_Mass_Cell within Graph Distance ≤ 2
- count = number of such weak or missing relations

```text
Energy = Clamp(N × ConnectivityPotential × (1 − H) × R, 0, 1)
```

---

## AKP-10 Memory Gravity

```text
Connectivity = min(1, WeightedDegree / 10)
G = Clamp(Mass × R × Connectivity, 0, 1)
```

---

## AKP-11 Dream Mode

```text
S   = existing Relation Strength between A and B (0 if none)
T_g = min(Confidence_A, Confidence_B)
N   = Novelty of the combination

DreamScore(A,B) = Clamp(E_A · E_B · R_A · R_B · (1 − S) · N · T_g, 0, 1)
```

**Safety Gate (all must pass):** T_g ≥ 0.4, N ≥ 0.3, S ≤ 0.5

Output classification: HYPOTHESIS / CANDIDATE only. Never Fact.

Mandatory output fields: source_cells, generation_method, dream_score, novelty_score, confidence, created_at, physics_version, llm_model (if used), random_seed.

---

## AKP-12 Cognitive State Vector

```text
C = [M, E, G, H, V, Cf, R, T, N]
```
(Mass, Energy, Gravity, Entropy, Velocity, Confidence, Resonance, Temperature, Novelty)

This is a projection. Authoritative calculations live in PhysicsCalculation records.

---

## AKP-13 Physics Versioning

Every calculation stores: physics_version, formula_version, parameter_set, timestamp, input_snapshot, output, random_seed (when used).

---

## AKP-14 Explicit Prohibitions

The Physics Engine may not: interpret texts, invent facts, make decisions, mutate user data, call LLMs, mutate Memory Cells, invent Trust.

It calculates. Nothing more.

---

## Status

AKP 0.1.2 is fully self-contained. All formulas, primitives and defaults are defined in this document. Parameter Sets (AKP-PS-*) freeze numeric values for conformance testing.
