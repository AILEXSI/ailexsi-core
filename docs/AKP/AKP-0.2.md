# AKP – AILEXSI Kernel Physics

**Version:** 0.2.3  
**Status:** Normative (self-contained)  
**Scope:** Graph Physics, Retrieval Physics and Cognitive Resource Model  
**Dependencies:** AKP 0.1.3, ACS 0.1.1, AKP-Parameter-Sets-0.1

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

### 15.4 Canonical Cluster Definition (MVP)

```text
A Cluster is a connected component over accepted, non-deprecated Relations
using the canonical direction rules of §15.3.

Included: status ∈ {accepted}
Excluded: status ∈ {hypothesis, proposed, rejected, deprecated}

ClusterId is supplied by KnowledgeDomain as an immutable normalized input
to PhysicsCalculation. AKP does not create or mutate clusters.

PossibleEdges for a cluster of size n (directed):
  PossibleEdges = n × (n − 1)
  (self-loops excluded)

If n ≤ 1: Density = 0, Cohesion = 0, IslandScore = 0.
If total_clusters = 0: ClusterDiversity(v) = 0, Bridge(v) = 0.
```

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
Cohesion  = mean(S_internal) over edges inside the cluster
Growth    = (ΔNodes + ΔEdges) / max(1, Δt)
```

Cluster membership: §15.4.

---

## AKP-19 Knowledge Bridges

```text
ClusterDiversity(v) = number of distinct clusters that v connects / max(1, total_clusters)
Bridge(v)           = Clamp(Centrality(v) × ClusterDiversity(v) × N_v, 0, 1)
```

If total_clusters = 0 → ClusterDiversity = 0, Bridge = 0.

---

## AKP-20 Graph Distance

```text
Cost(e)       = 1 − S_e
Distance(A,B) = sum of Costs along shortest path
```
Infinity if unreachable. Only accepted, non-deprecated edges participate.

---

## AKP-21 Retrieval Physics

Default weights (sum=1): w_s=0.30, w_g=0.15, w_t=0.10, w_r=0.15, w_m=0.10, w_c=0.10, w_n=0.10

```text
Graph relevance = 1 / (1 + Distance)
Novelty-Fit     = 1 − |N_query − N_cell|
Score(Q,M)      = Clamp(Σ w_i · signal_i, 0, 1)
```
Missing component values default to 0.0.

### AKP-21.1 Deterministic Retrieval Pipeline (MVP)

```text
1. Generate semantic candidates from EmbeddingProvider.
2. Candidate set = top 100 by semantic similarity.
3. Tie-break = MemoryId ascending (lexicographic UUID).
4. Expand accepted graph relations up to 2 hops from each candidate.
5. Deduplicate by MemoryId.
6. Apply temporal filter (if domain decay active).
7. Reject Confidence < confidence_threshold (default 0.0 = no reject).
8. Calculate all seven Retrieval signals for remaining candidates.
9. Calculate RetrievalScore.
10. Sort descending by RetrievalScore.
11. Tie-break MemoryId ascending.
12. Apply diversity penalty during sequential selection (§AKP-24).
13. Return maximum final_k results (default final_k = 20).
```

All thresholds (top_k=100, hops=2, confidence_threshold=0.0, final_k=20) are PhysicsParameters.

---

## AKP-22 Temporal Relevance

```text
TemporalRelevance = exp(−lambda_decay · Δt)
```
Only when the Knowledge Domain has temporal decay activated (default lambda_decay = 0).

---

## AKP-24 Diversity Penalty (sequential greedy)

```text
Candidates are considered in descending Base RetrievalScore order
(tie-break MemoryId ascending).

For each candidate:
  penalty = 1.0
  For every already-selected result:
    if same independenceGroup:
      penalty = min(penalty, 0.5)
    if cosineSimilarity(candidate, selected) > 0.92:
      penalty = min(penalty, 0.5)
  AdjustedScore = BaseScore × penalty

Select candidate if AdjustedScore is still among the best remaining
and final_k not yet reached.

Penalty is applied at most once per already-selected match type
(independenceGroup OR cosine). Multiple matches do not stack beyond 0.5
(using min, not product).
```

---

## AKP-25 Cognitive Attention Budget

```text
B_total = 100
maintenance_reservation = 0.15
```
Every operation declares Cost_i ≥ 0. Constraint: Σ Cost_i ≤ B_total.

---

## AKP-26 Cognitive Priority

```text
Relevance  = Retrieval Score for current context
Urgency    = 1.0 if user-initiated or deadline-driven, else Temperature
Potential  = Energy of the Cell

Priority = Clamp(I × Relevance × Urgency × Potential, 0, 1)
```

**No optional factors.** Trust is not part of Priority in MVP.

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

## AKP-31 Dream Mode 2.0 (canonical)

```text
BridgePotential     = Bridge(A) × Bridge(B)
AttentionAllocation = remaining_Budget / B_total
T_g                 = min(Confidence_A, Confidence_B)
S_r                 = existing Relation Strength between A and B (0 if none)

D = Clamp(
      E_A × E_B
    × BridgePotential
    × N
    × T_g
    × AttentionAllocation
    × (1 − S_r),
  0, 1)
```

formulaVersion for this formula: `dream-2.0.0`  
physicsVersion: `0.2.3`  
parameterSet: AKP-PS-010

---

## AKP-32 Dream Safety Gate

All must hold: T_g ≥ 0.4, N ≥ 0.3, S_r ≤ 0.5. Otherwise rejection.  
Output = HYPOTHESIS / CANDIDATE only. Never Fact.

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
| I1 | All Scores lie in [0,1]; Rates are unrestricted |
| I2 | Identical inputs → identical outputs |
| I3 | Physics-version change does not alter historical calculations |
| I4 | Dream Mode produces no Fact-Cells |
| I5 | Retrieval never uses exclusively semantic similarity |
| I6 | Duplicates of same source produce no artificial Source Diversity |
| I7 | Attention Allocation never exceeds B_total |
| I8 | High Emergence never automatically produces high Confidence |
| I9 | Graph Centrality does not automatically mean Truth or Importance |
| I10 | Physics possesses no side effects |
| I11 | Priority contains no optional factors |
| I12 | Cluster membership is an immutable input to Physics |

---

## Status

AKP 0.2.3 is fully self-contained. Clusters, Retrieval pipeline, Diversity, Priority and Dream 2.0 are deterministically defined.
