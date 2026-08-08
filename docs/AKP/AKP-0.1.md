# AKP – AILEXSI Kernel Physics

**Version:** 0.1.4  
**Status:** Normative (self-contained)  
**Scope:** Mathematical and time-dependent core models of the AILEXSI Cortex  
**Dependencies:** ACS 0.1.1, AKP-Parameter-Sets-0.1, AKP-Formula-Registry-0.1

---

## AKP-0 Fundament

### 0.1 Wertebereich
Scores ∈ [0,1] unless classified otherwise. Rates (Velocity) unrestricted.

### 0.2 Determinismus
Identical input + parameters + Physics version → identical output.

### 0.3–0.4
No hidden parameters. Physics: no LLMs, DB, GUI, network, mutations, semantic decisions.

### 0.5 FormulaVersion Rule
Any normative change MUST increment formulaVersion.

### 0.6 Formula Registry
Every automatic score uses formulaId/formulaVersion from `AKP-Formula-Registry-0.1.md`. Implementations MUST NOT invent IDs.

---

## AKP-1 Zeit

Age(t)=(t−createdAt)/T_scale · formulaId: age-1.0.0  
D(t)=exp(−lambda_decay·Δt) · formulaId: temporal-decay-1.0.0  
Defaults: T_scale=31536000s, lambda_decay=0.0

---

## AKP-2 Primitives

**Importance** formulaId: importance-1.0.0  
`I = explicitUserPriority when supplied else 0.5` — no system heuristic.

**Usage** formulaId: usage-1.0.0  
`U = min(1, access_count_in_rolling_window / access_window_size)` defaults window 30d size 20.

**EffectiveReliability** formulaId: effective-reliability-1.0.0  
`e.reliability if present else 0.5`

**Evidence Strength** formulaId: evidence-strength-1.0.0  
`E = average(EffectiveReliability)` · empty → E=0

**Source Diversity** formulaId: source-diversity-1.0.0  
`SD = |unique_groups| / max(1,|Evidence|)` · missing group → "unknown"

**Contradiction** formulaId: contradiction-1.0.0  
sum contradicting EffectiveReliability / max(1, sum all) · empty → C=0

**Novelty** formulaId: novelty-1.0.0  
1−max cosine · zero-vector cosine=0 · no others → N=1.0 · precomputed embeddings only

---

## AKP-3 Confidence · formulaId: confidence-1.0.0
Confidence = Clamp((E×SD)×(1−C), 0, 1)

## AKP-4 Resonance · formulaId: resonance-1.0.0
R_f,A_f,C_f,L_f,Q_f exact denominators as prior. L_f snapshot required.  
R = Clamp(R_raw × exp(−mu_temporal_factor·Age), 0, 1) weights PS-002

## AKP-5 Mass · formulaId: mass-1.0.0
Mass = Clamp(w_i·I+w_u·U+w_c·Confidence+w_r·R, 0, 1) weights PS-003

## AKP-6 Temperature · formulaId: temperature-1.0.0
AccessRate = min(1, accesses_in_last_24h/10)  
RecentInfluence = max(R_f,A_f,Q_f) last 7d  
**workingSetMembership** explicit boolean in inputSnapshot  
WorkingSetFactor = 1.0 if true else 0.3  
T = Clamp(AccessRate × RecentInfluence × WorkingSetFactor, 0, 1)  
Physics MUST NOT infer Working Set.

## AKP-7 Entropy · formulaId: entropy-1.0.0
AgeDecay=1−D(t)  
SourceDecay = 1 − avg(EffectiveReliability) **if |Evidence|=0: SourceDecay=1.0**  
Uncertainty=1−Confidence  
H = Clamp(weighted sum, 0, 1) weights PS-004

## AKP-8 Velocity · formulaId: velocity-1.0.0 · rates 1/s
## AKP-9 Energy · formulaId: energy-1.0.0
## AKP-10 Gravity · formulaId: gravity-1.0.0
## AKP-11 Dream simple · formulaId: dream-simple-1.0.0 (legacy only)
## AKP-13 Versioning: formulaId required in every PhysicsCalculation
## AKP-14 Prohibitions: no infer Working Set, Urgency, clusters, Trust, independenceGroup

## Status
AKP 0.1.4 closes Importance, empty SourceDecay, Working Set input purity.
