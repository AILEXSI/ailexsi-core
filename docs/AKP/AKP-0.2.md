# AKP – AILEXSI Kernel Physics

**Version:** 0.2.2  
**Status:** Normative (self-contained)  
**Scope:** Graph Physics, Retrieval Physics and Cognitive Resource Model  
**Dependencies:** AKP 0.1.2, ACS, AKP-Parameter-Sets-0.1

Every formula in this document has a concrete purpose in the Cortex. No speculative mathematics.

---

## AKP-15 Graph Physics

Memory Cell = Node. Relation = Edge.

### 15.1 Relation Strength

Default weights (sum=1): w_e=0.35, w_c=0.25, w_t=0.20, w_u=0.20

```text
S_r = Clamp(w_e·E + w_c·C + w_t·T + w_u·U, 0, 1)
```

LLM-proposed relations start with S_r ≤ 0.3 and status = hypothesis.

### 15.2 Relation Types (minimum set)

supports, contradicts, extends, derived_from, inspired_by, causes, caused_by, references, answers, asks, belongs_to, part_of, depends_on, duplicates, similar_to, related_to

### 15.3 Directed vs Bidirectional (mandatory)

Symmetric types (`similar_to`, `related_to`, `duplicates`) **MUST** be stored as two directed edges (A→B and B→A) with identical strength and type.  
All other types remain strictly directed (single edge).  
This rule is mandatory so that Degree, WeightedDegree, Centrality, Distance and Bridge remain deterministic.

---

## AKP-16 Node Centrality

**Degree Centrality**
```text
D(v) = deg(v) / max(1, N − 1)
```

**Weighted Degree**
```text
WD(v) = Σ S_e / max(1, MaxPossibleStrength)
MaxPossibleStrength = max_degree_observed_in_graph * 1.0
(Fallback when graph empty or no edges: 1.0)
```

**Eigenvector Centrality (power iteration) – fully deterministic**

Adjacency: directed weighted adjacency matrix A where A[i][j] = S_r of edge i→j (0 if no edge). Self-loops ignored (A[i][i] = 0).

```text
x_0[i] = 1/N for all i
for k = 1 .. 100:
  y = A · x_{k-1}
  ||y||_1 = sum(|y_i|)
  if ||y||_1 == 0:
    x_k = zeros
    break
  x_k = y / ||y||_1
  if max_i |x_k[i] − x_{k-1}[i]| < 1e-6:
    break
return x_k
```

Rules: Isolated nodes remain 0. Empty graph → empty result. Max 100 iterations without convergence → last x_k used. No random component. No damping factor.

---

## AKP-17 Graph Gravity

```text
Connectivity_v = min(1, WD(v) / 10)
G_v = Clamp(M_v × R_v × Connectivity_v × (1 + Centrality_v), 0, 1)
```

---

## AKP-18 Knowledge Clusters

```text
Density   = ActualEdges / max(1, PossibleEdges)
Cohesion  = mean(S_internal)
Growth    = (ΔNodes + ΔEdges) / max(1, Δt)
```

---

## AKP-19 Knowledge Bridges

```text
ClusterDiversity(v) = number of distinct clusters that v connects / total_clusters
Bridge(v)           = Clamp(Centrality(v) × ClusterDiversity(v) × N_v, 0, 1)
```

---

## AKP-20 Graph Distance

```text
Cost(e)       = 1 − S_e
Distance(A,B) = sum of Costs along shortest path
```
Infinity if unreachable.

---

## AKP-21 Retrieval Physics

Default weights (sum=1): w_s=0.30, w_g=0.15, w_t=0.10, w_r=0.15, w_m=0.10, w_c=0.10, w_n=0.10

```text
Graph relevance = 1 / (1 + Distance)
Novelty-Fit     = 1 − |N_query − N_cell|
Score(Q,M)      = Clamp(Σ w_i · signal_i, 0, 1)
```
Missing component values default to 0.0.

---

## AKP-22 Temporal Relevance

```text
TemporalRelevance = e^(−λ · Δt)
```
Only when the Knowledge Domain has temporal decay activated (default λ = 0).

---

## AKP-23 Cognitive Retrieval Pipeline

```text
Semantic Retrieval → Graph Expansion (1–2 hops) → Temporal Filtering
→ Trust Filtering (Confidence ≥ threshold) → Resonance Ranking
→ Diversity Filtering → Final Context Window
```

---

## AKP-24 Diversity Penalty

Results that share the same independenceGroup or have cosine similarity > 0.92 to an already selected result are down-ranked by factor 0.5.

---

## AKP-25 Cognitive Attention Budget

```text
B_total = 100                    # abstract capacity units (MVP default)
maintenance_reservation = 0.15   # 15 % of B_total reserved
```
Every operation declares an estimated Cost_i ≥ 0. Constraint: Σ Cost_i ≤ B_total.

---

## AKP-26 Cognitive Priority

```text
Relevance  = Retrieval Score for current context
Urgency    = 1.0 if user-initiated or deadline-driven, else Temperature
Potential  = Energy of the Cell
Priority   = Clamp(I × Relevance × Urgency × Potential × (optional Trust), 0, 1)
```

---

## AKP-27 Attention Allocation Algorithm (deterministic)

```text
1. reserved = maintenance_reservation × B_total
2. available = B_total − reserved
3. Sort candidates by Priority descending
4. Tie-break by MemoryId ascending (lexicographic UUID)
5. For each candidate in order:
     if Cost_i ≤ remaining_budget: allocate; remaining_budget -= Cost_i
     else: skip
6. ExplorationRate = 0.30 if Dream Mode active, else 0.10
```
Identical input + parameter set → identical allocation.

---

## AKP-28 Load & Saturation

```text
Load = ContextSize / AttentionCapacity
If Load > 0.85 → drop lowest Priority items until Load ≤ 0.85
Cognitive Saturation: when additional context changes top-k ranking by < 0.02, stop expansion.
```

---

## AKP-31 Dream Mode 2.0

```text
BridgePotential     = Bridge(A) × Bridge(B)
AttentionAllocation = remaining_Budget / B_total
D = Clamp(E_A × E_B × BridgePotential × N × T_g × AttentionAllocation × (1 − S_r), 0, 1)
```

---

## AKP-32 Dream Safety Gate

All must hold: T_g ≥ 0.4, N ≥ 0.3, S_r ≤ 0.5. Otherwise rejection. Output = HYPOTHESIS / CANDIDATE only.

---

## AKP-33 Emergence Score

```text
Surprise  = 1 − max similarity of the pair to any existing accepted Relation
Coherence = min(Confidence_A, Confidence_B)
Emergence = Clamp(N × BridgePotential × Surprise × Coherence, 0, 1)
```

---

## AKP-34 Knowledge Island Detection

```text
ExternalConnectivity = (edges leaving the cluster) / max(1, total edges of the cluster)
IslandScore = Clamp(Cohesion × (1 − ExternalConnectivity), 0, 1)
```
Empty graph / empty cluster → IslandScore = 0.0.

---

## AKP-35 Cognitive Maintenance

15 % of Attention Budget reserved for: Validation, Contradiction Detection, Index Maintenance, Graph Cleanup, Decay Calculation, Backup Verification.

---

## AKP-36 Invariants

| ID | Invariant |
|----|-----------|
| I1 | All scores lie in their defined range |
| I2 | Identical inputs → identical outputs |
| I3 | Physics-version change does not alter historical calculations |
| I4 | Dream Mode produces no Fact-Cells |
| I5 | Retrieval never uses exclusively semantic similarity |
| I6 | Duplicates of same source produce no artificial Source Diversity |
| I7 | Attention Allocation never exceeds B_total |
| I8 | High Emergence never automatically produces high Confidence |
| I9 | Graph Centrality does not automatically mean Truth or Importance |
| I10 | Physics possesses no side effects |

---

## Status

AKP 0.2.2 is fully self-contained. All formulas and defaults are defined in this document. Parameter Sets freeze numeric values for conformance testing.
