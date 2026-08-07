# AKP – AILEXSI Kernel Physics

**Version:** 0.2.1 (Normative Patch 0.1 + 0.2 applied)  
**Status:** Normative  
**Scope:** Graph Physics, Retrieval Physics and Cognitive Resource Model  
**Dependencies:** AKP 0.1.1, ACS, Normative-Patch-0.1

---

## AKP-15 Graph Physics

### 15.1 Relation Strength

Default weights (sum=1): w_e=0.35, w_c=0.25, w_t=0.20, w_u=0.20

```text
S_r = Clamp(w_e·E + w_c·C + w_t·T + w_u·U, 0, 1)
```

LLM proposals start with S_r ≤ 0.3 and status = hypothesis.

### 15.2–15.3 Relation Types & Direction

Minimum set as previously defined. Standard = directed. Symmetric types may be bidirectional.

---

## AKP-16 Node Centrality

```text
D(v)  = deg(v) / max(1, N−1)
WD(v) = Σ S_e / max(1, MaxPossibleStrength)
```

MaxPossibleStrength = max_degree_observed_in_graph * 1.0  
(Fallback when graph empty or no edges: 1.0)  
Computed once per PhysicsCalculation and stored in the parameter_set.

Eigenvector (power iteration):
- Start vector: uniform 1/N
- Max iterations: 100
- Convergence tolerance: 1e-6
- Isolated nodes → 0
- Empty graph → all 0
- Result normalized to [0,1]

---

## AKP-17 Graph Gravity

```text
Connectivity_v = min(1, WD(v)/10)
G_v = Clamp(M_v × R_v × Connectivity_v × (1 + Centrality_v), 0, 1)
```

---

## AKP-18 Knowledge Clusters

```text
Density  = ActualEdges / max(1, PossibleEdges)
Cohesion = mean(S_internal)
Growth   = (ΔNodes + ΔEdges) / max(1, Δt)
```

---

## AKP-19 Knowledge Bridges

```text
ClusterDiversity(v) = distinct clusters connected by v / total_clusters
Bridge(v) = Clamp(Centrality(v) × ClusterDiversity(v) × N_v, 0, 1)
```

---

## AKP-20 Graph Distance

```text
Cost(e) = 1 − S_e
Distance(A,B) = sum of Costs on shortest path (∞ if unreachable)
```

---

## AKP-21 Retrieval Physics

Default weights (sum=1): w_s=0.30, w_g=0.15, w_t=0.10, w_r=0.15, w_m=0.10, w_c=0.10, w_n=0.10

```text
Graph relevance = 1 / (1 + Distance)
Novelty-Fit     = 1 − |N_query − N_cell|
Score(Q,M)      = Clamp(Σ w_i · signal_i, 0, 1)
```

---

## AKP-22–24 Temporal, Pipeline, Diversity

TemporalRelevance = e^(−λ·Δt) when domain enables decay (default λ = 0).  
Full pipeline as previously specified.  
Diversity: same independenceGroup or cosine > 0.92 → down-rank ×0.5.

---

## AKP-25–30 Attention Budget & Priority

```text
B_total = configurable capacity units (default 100)
Priority = Clamp(I × Relevance × Urgency × Potential × optional Trust, 0, 1)
ExplorationRate default 0.3 (Dream) / 0.1 otherwise
Load > 0.85 → drop lowest Priority items
Saturation when top-k ranking delta < 0.02
```

---

## AKP-31 Dream Mode 2.0 (formalized)

```text
BridgePotential     = Bridge(A) × Bridge(B)
AttentionAllocation = remaining_Budget / B_total
D = Clamp(E_A × E_B × BridgePotential × N × T_g × AttentionAllocation × (1 − S_r), 0, 1)
```

---

## AKP-32 Dream Safety Gate

All must hold: T_g ≥ 0.4, N ≥ 0.3, S_r ≤ 0.5

---

## AKP-33 Emergence Score

```text
Surprise  = 1 − max similarity of pair to any accepted Relation
Coherence = min(Confidence_A, Confidence_B)
Emergence = Clamp(N × BridgePotential × Surprise × Coherence, 0, 1)
```

---

## AKP-34 Island Score

```text
ExternalConnectivity = fraction of edges leaving the cluster
IslandScore = Clamp(Cohesion × (1 − ExternalConnectivity), 0, 1)
```

---

## AKP-35–36 Maintenance & Invariants

15 % of Attention Budget reserved for maintenance by default.  
All previous I1–I10 invariants remain in force.

---

## Status

AKP 0.2.1 is fully formalized for the MVP. All previously undefined symbols have explicit definitions, default parameters and ranges.
