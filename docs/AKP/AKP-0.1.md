# AKP – AILEXSI Kernel Physics

**Version:** 0.1.4  
**Status:** Normative (self-contained)  
**Scope:** Mathematical and time-dependent core models of the AILEXSI Cortex  
**Dependencies:** ACS 0.1.1, AKP-Parameter-Sets-0.1, AKP-Formula-Registry-0.1

---

## AKP-0 Fundament

### 0.1 Wertebereich
All dimensionless **Scores** are normalized to [0, 1] unless explicitly classified otherwise.  
**Rates** (e.g. Velocity) are not Scores and are not restricted to [0, 1].

### 0.2 Determinismus
Identical input + parameters + Physics version → identical output. Random seed must be persisted when used.

### 0.3 Keine versteckten Parameter
Every parameter is explicitly declared (name, value, range, unit, source, version).

### 0.4 Physik-Engine-Grenzen
No LLMs, no databases, no GUIs, no network, no mutations, no semantic decisions. Pure calculation only.

### 0.5 FormulaVersion Rule
Any normative change to a formula, its input semantics, operation ordering, numerical behavior, edge-case behavior or parameter interpretation MUST increment `formulaVersion`.

### 0.6 Formula Registry
Every automatic score uses a stable `formulaId` and `formulaVersion` from `docs/AKP/AKP-Formula-Registry-0.1.md`.  
Implementations MUST NOT invent formula IDs.

---

## AKP-1 Zeit als Dimension

```text
Age(t) = (t − createdAt) / T_scale
```
formulaId: `age-1.0.0`

T_scale PhysicsParameter (default):
```text
name: T_scale  value: 31536000  unit: s  range: [86400, 315360000]  version: 0.1.4
```

```text
D(t) = exp(−lambda_decay · Δt)
```
formulaId: `temporal-decay-1.0.0`  
Δt = time since last confirmation (confirmedAt).

```text
name: lambda_decay  value: 0.0  unit: 1/s  range: [0, 1e-5]  version: 0.1.4
```

---

## AKP-2 Primitive Cognitive Signals

| Signal | Symbol | Range | How obtained |
|--------|--------|-------|--------------|
| Importance | I | [0,1] | Explicit user priority, else 0.5 |
| Usage | U | [0,1] | Normalized access count in rolling window |
| Evidence Strength | E | [0,1] | Aggregated EffectiveReliability of linked Evidence |
| Source Diversity | SD | [0,1] | Fraction of independent independenceGroups |
| Contradiction | C | [0,1] | Strength of contradicting Evidence |
| Novelty | N | [0,1] | 1 − max cosine similarity to existing Cells |

### Operational definitions (MVP)

**Importance (I)** — formulaId: `importance-1.0.0`  
```text
I = explicitUserPriority when supplied in inputSnapshot
    otherwise 0.5
```
No system heuristic. No undefined fallback.

**Usage (U)** — formulaId: `usage-1.0.0`  
```text
U = min(1, access_count_in_rolling_window / access_window_size)
```
Default window = 30 days, access_window_size = 20.  
inputSnapshot MUST supply `access_count_in_rolling_window` (non-negative integer).

**EffectiveReliability** — formulaId: `effective-reliability-1.0.0`  
```text
EffectiveReliability(e) = e.reliability if present else 0.5
```

**Evidence Strength (E)** — formulaId: `evidence-strength-1.0.0`  
```text
E = average(EffectiveReliability(e) for e in linked Evidence)
```
Empty evidence list → E = 0.

**Source Diversity (SD)** — formulaId: `source-diversity-1.0.0`  
```text
unique_groups = set of distinct independenceGroup values among linked Evidence
SD = |unique_groups| / max(1, |Evidence|)
```
Missing independenceGroup → `"unknown"`. AKP never derives independenceGroup.

**Contradiction (C)** — formulaId: `contradiction-1.0.0`  
```text
C = sum(EffectiveReliability(e) for e with type = "contradicting")
  / max(1, sum(EffectiveReliability(e) for all linked Evidence))
```
Clamped to [0,1]. Empty evidence → C = 0.

**Novelty (N)** — formulaId: `novelty-1.0.0`  
```text
N = 1 − max_cosine_similarity(embedding_this, embedding_other)
```
Zero-vector: cosine(0,x)=0; cosine(0,0)=0. No other Cells → N=1.0. Precomputed embeddings only with identity hashes in inputSnapshot.

---

## AKP-3 Confidence — formulaId: `confidence-1.0.0`

```text
BaseEvidence        = E × SD
ContradictionFactor = 1 − C
Confidence          = Clamp(BaseEvidence × ContradictionFactor, 0, 1)
```

---

## AKP-4 Memory Resonance — formulaId: `resonance-1.0.0`

| Symbol | Name | Exact definition | Range |
|--------|------|------------------|-------|
| R_f | ReflectionInfluence | count(accepted Reflections referencing Cell) / max(1, count(all accepted Reflections)) | [0,1] |
| A_f | ActionInfluence | count(ActionIntents influenced by Cell) / max(1, count(all ActionIntents)) | [0,1] |
| C_f | CreationInfluence | count(new Cells listing this as parent) / max(1, count(all Cells created after this Cell)) | [0,1] |
| L_f | RelationInfluence | accepted_outgoing / max(1, max_accepted_outgoing_in_system) | [0,1] |
| Q_f | RecallInfluence | count(successful Retrievals that returned Cell) / max(1, count(all successful Retrievals)) | [0,1] |

**L_f snapshot requirement:** inputSnapshot MUST contain `acceptedOutgoingRelations` and `maxAcceptedOutgoingRelationsInSystem`.

Default weights (sum=1): w_r=0.25, w_a=0.20, w_c=0.20, w_l=0.20, w_q=0.15

```text
R_raw = w_r·R_f + w_a·A_f + w_c·C_f + w_l·L_f + w_q·Q_f
TemporalFactor(t) = exp(−mu_temporal_factor · Age(t))
R(t) = Clamp(R_raw × TemporalFactor(t), 0, 1)
```

Parameter identifier is exactly `mu_temporal_factor` (default 0.1). No aliases.

---

## AKP-5 Memory Mass — formulaId: `mass-1.0.0`

Default weights (sum=1): w_i=0.30, w_u=0.25, w_c=0.25, w_r=0.20

```text
M_raw = w_i·I + w_u·U + w_c·Confidence + w_r·R
Mass  = Clamp(M_raw, 0, 1)
```

---

## AKP-6 Memory Temperature — formulaId: `temperature-1.0.0`

```text
AccessRate       = min(1, accesses_in_last_24h / 10)
RecentInfluence  = max(R_f, A_f, Q_f) measured in last 7 days
WorkingSetFactor = 1.0 if workingSetMembership = true else 0.3
T = Clamp(AccessRate × RecentInfluence × WorkingSetFactor, 0, 1)
```

**workingSetMembership** is an explicit boolean in inputSnapshot. Physics MUST NOT infer Working Set membership.

---

## AKP-7 Memory Entropy — formulaId: `entropy-1.0.0`

```text
AgeDecay    = 1 − D(t)
SourceDecay = 1 − average(EffectiveReliability(e) for linked Evidence)
              if |Evidence| = 0: SourceDecay = 1.0
Uncertainty = 1 − Confidence
```

Default weights (sum=1): w_a=0.25, w_c=0.30, w_s=0.20, w_u=0.25

```text
H = Clamp(w_a·AgeDecay + w_c·C + w_s·SourceDecay + w_u·Uncertainty, 0, 1)
```

---

## AKP-8 Memory Velocity — formulaId: `velocity-1.0.0`

```text
V_M = ΔMass / Δt   unit: 1/s
V_R = ΔR / Δt      unit: 1/s
V_T = ΔT / Δt      unit: 1/s
```
Δt = time between the two most recent PhysicsCalculations (minimum 1 s). Rates, not Scores.

---

## AKP-9 Memory Energy — formulaId: `energy-1.0.0`

ConnectivityPotential per AKP-0.2 §29 (count distinct high_Mass targets once). Defaults PS-005.

```text
Energy = Clamp(N × ConnectivityPotential × (1 − H) × R, 0, 1)
```

---

## AKP-10 Memory Gravity — formulaId: `gravity-1.0.0`

```text
Connectivity = min(1, WeightedDegree / 10)
G = Clamp(Mass × R × Connectivity, 0, 1)
```

---

## AKP-11 Dream Mode simple — formulaId: `dream-simple-1.0.0`

Legacy unit-test form. Production uses `dream-2.0.0` in AKP 0.2.

```text
DreamScore_simple(A,B) = Clamp(E_A · E_B · R_A · R_B · (1 − S) · N · T_g, 0, 1)
```

Safety Gate: T_g ≥ 0.4, N ≥ 0.3, S ≤ 0.5. Output: HYPOTHESIS / CANDIDATE only.

---

## AKP-12 Cognitive State Vector

Projection only. Authoritative values live in PhysicsCalculation records.

---

## AKP-13 Physics Versioning

Every calculation stores: formulaId, formulaVersion, physicsVersion, parameterSetId, parameterSetVersion, parameterSet, timestamp, inputSnapshot, output, randomSeed (when used).

---

## AKP-14 Explicit Prohibitions

Physics may not: interpret texts, invent facts, make decisions, mutate user data, call LLMs, mutate Memory Cells, invent Trust, derive independenceGroup, infer Working Set, infer Urgency.

---

## Status

AKP 0.1.4 is fully self-contained. All formulas, primitives, denominators and defaults are defined in this document.
