# AKP – AILEXSI Kernel Physics

**Version:** 0.1  
**Status:** Normative Draft  
**Scope:** Mathematical and time-dependent core models of the AILEXSI Cortex  
**Dependencies:** ACS (Cognitive Laws, Principle Zero)

---

## AKP-0 Fundament

### 0.1 Wertebereich

All dimensionless cognitive scores are normalized to the interval [0, 1] unless explicitly specified otherwise.

```text
0 = minimal
1 = maximal
```

### 0.2 Determinismus

Given identical input, identical parameters, and identical Physics version, the Engine must deliver the same result.

If randomness is required, the used seed becomes part of the Event and must be persisted.

### 0.3 Keine versteckten Parameter

Every formula may use only explicitly declared parameters. Every parameter possesses:
- name
- value
- range
- unit (if applicable)
- source
- version

### 0.4 Physik-Engine-Grenzen

The Physics Engine may:
- not interpret texts
- not invent facts
- not make semantic decisions
- not call LLMs or external APIs
- not mutate Memory Cells directly
- not invent Trust values on its own

It calculates numbers and graphs from numbers and graphs. Nothing more.

---

## AKP-1 Zeit als Dimension

Every Memory Cell carries at least the following timestamps:

| Field          | Meaning                                      |
|----------------|----------------------------------------------|
| `created_at`   | When AILEXSI created the Cell                |
| `observed_at`  | When the underlying information was observed |
| `valid_from`   | From when the statement shall apply          |
| `valid_to`     | Until when the statement shall apply         |
| `confirmed_at` | When it was last confirmed                   |
| `deprecated_at`| When it was marked as no longer current      |

### 1.1 Age

```text
Age(t) = (t − created_at) / T_scale
```

`T_scale` is domain-specific (e.g. 1 year for stable knowledge, 1 day for news).

### 1.2 Confirmation Decay

```text
D(t) = e^(−λ · Δt)
```

where `Δt` is the time since the last relevant confirmation and `λ` is the domain-specific decay rate.  
Historical facts may have `λ ≈ 0`.

---

## AKP-2 Primitive Cognitive Signals

These signals are the only allowed building blocks for derived quantities. They contain no circularity.

| Signal              | Symbol | Range   | Description |
|---------------------|--------|---------|-------------|
| Importance          | I      | [0,1]   | Explicit or heuristic importance |
| Usage               | U      | [0,1]   | Actual usage frequency |
| Evidence Strength   | E      | [0,1]   | Strength of available evidence |
| Source Diversity    | SD     | [0,1]   | Independence of sources |
| Contradiction       | C      | [0,1]   | Measure of contradictory evidence |
| Novelty             | N      | [0,1]   | Distance from existing knowledge space |

---

## AKP-3 Confidence

```text
BaseEvidence = E × SD
ContradictionFactor = 1 − C
Confidence = Clamp(BaseEvidence × ContradictionFactor, 0, 1)
```

Personal user statements can have high Confidence regarding their provenance without thereby being objectively true.

---

## AKP-4 Memory Resonance

Resonance measures **actual observed influence**, not mere mention frequency.

Raw value:

```text
R_raw = w_r · R_f + w_a · A_f + w_c · C_f + w_l · L_f + w_q · Q_f
```

with ∑ w_i = 1 (version-controlled weights).

Temporally weighted:

```text
R(t) = R_raw × TemporalFactor(t)
```

---

## AKP-5 Memory Mass

```text
M_raw = w_i · I + w_u · U + w_c · Confidence + w_r · R
Mass = Clamp(M_raw, 0, 1)
```

Resonance may flow in here because it is calculated independently from observed influence. No circularity.

---

## AKP-6 Memory Temperature

Temperature describes **current activity**, not meaning.

```text
T = AccessRate × RecentInfluence × WorkingSetFactor
```

A Cell with high Mass can simultaneously be very cold.

---

## AKP-7 Memory Entropy

Entropy = information instability / uncertainty (not merely age).

```text
H = w_a · AgeDecay + w_c · C + w_s · SourceDecay + w_u · Uncertainty
```

---

## AKP-8 Memory Velocity

Cognitive Vector of change:

```text
V_M = ΔMass / Δt
V_R = ΔR / Δt
V_T = ΔT / Δt
```

---

## AKP-9 Memory Energy

Metaphorical name. Mathematical meaning:

```text
Energy = N × ConnectivityPotential × (1 − H) × R
```

Describes the potential for new connections.

---

## AKP-10 Memory Gravity

Ranking signal (not a physical quantity):

```text
G = Mass × R × Connectivity
```

---

## AKP-11 Dream Mode

Dream Mode produces exclusively Hypotheses.

For two Cells A and B:

```text
DreamScore(A,B) = E_A · E_B · R_A · R_B · (1 − S) · N · T_g
```

where:
- S = existing relation strength
- N = Novelty of the combination
- T_g = Trust Gate

**Output requirements (mandatory fields):**
- source_cells
- generation_method
- dream_score
- novelty_score
- confidence
- created_at
- physics_version
- llm_model (if used)
- random_seed

---

## AKP-12 Cognitive State Vector

Every Memory Cell possesses the state:

```text
C = [M, E, G, H, V, Cf, R, T, N]
```

(Mass, Energy, Gravity, Entropy, Velocity, Confidence, Resonance, Temperature, Novelty)

This vector is time-dependent and versioned.

---

## AKP-13 Physics Versioning

Every calculation stores:
- physics_version
- formula_version
- parameter_set
- timestamp
- input_snapshot
- output

Historical scores remain reproducible.

---

## AKP-14 Explicit Prohibitions

The Physics Engine may **not**:
- interpret texts
- invent facts
- make decisions
- mutate user data
- call LLMs or external systems
- mutate Memory Cells
- invent Trust on its own

It calculates. Nothing more.

---

## Status

AKP 0.1 is implementable and testable.  
The three corrections (Provenance, no circularity, pure calculation) are incorporated.

Missing for AKP 0.2: Graph Physics, Retrieval Physics, Cognitive Resource Model (Attention Budget).
