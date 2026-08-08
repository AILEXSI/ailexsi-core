# AKP – AILEXSI Kernel Physics

**Version:** 0.2.5  
**Status:** Normative (self-contained)  
**Scope:** Graph Physics, Retrieval Physics and Cognitive Resource Model  
**Dependencies:** AKP 0.1.4, ACS 0.1.1, AKP-Parameter-Sets-0.1, AKP-Formula-Registry-0.1

Every formula in this document has a concrete purpose in the Cortex. No speculative mathematics.

---

## AKP-15 Graph Physics

Memory Cell = Node. Relation = Edge.

### 15.1 Relation Strength — formulaId: `relation-strength-1.0.0`

Default weights (sum=1): w_e=0.35, w_c=0.25, w_t=0.20, w_u=0.20

```text
S_r = Clamp(w_e·E + w_c·C + w_t·T + w_u·U, 0, 1)
```

LLM-proposed relations start with S_r ≤ 0.3 and status = hypothesis.

### 15.2 Relation Types (minimum set)

supports, contradicts, extends, derived_from, inspired_by, causes, caused_by, references, answers, asks, belongs_to, part_of, depends_on, duplicates, similar_to, related_to

### 15.3 Directed vs Bidirectional (mandatory)

Symmetric types (`similar_to`, `related_to`, `duplicates`) **MUST** be stored as two directed edges (A→B and B→A) with identical type and identical strength.

**Symmetric relation integrity rule:**
```text
A symmetric relation is conformant only when both directed edges exist
with identical type and strength.
Missing counterpart = graph integrity violation.
PhysicsCalculation MUST reject a snapshot that contains a one-sided
symmetric relation.
```

All other types remain strictly directed (single edge).

### 15.4 Canonical Cluster Definition (MVP)

```text
KnowledgeDomain is the sole authority for cluster membership.

AKP MUST NOT derive, invent, or mutate cluster membership.

PhysicsCalculation.inputSnapshot MUST contain, for every participating node:
  clusterId: string | null

If a required clusterId is missing or inconsistent with KnowledgeDomain's
authoritative membership at calculation time, the calculation MUST reject
the snapshot (status = rejected_snapshot).

PossibleEdges for a cluster of size n (directed):
  PossibleEdges = n × (n − 1)
  (self-loops excluded)

If n ≤ 1: Density = 0, Cohesion = 0, IslandScore = 0.
If total_clusters = 0: ClusterDiversity(v) = 0, Bridge(v) = 0.
```

---

## AKP-16 Node Centrality

**Degree Centrality** — formulaId: `degree-centrality-1.0.0`
```text
D(v) = deg(v) / max(1, N − 1)
```

**Weighted Degree** — formulaId: `weighted-degree-1.0.0`
```text
WD(v) = Σ S_e / max(1, MaxPossibleStrength)
MaxPossibleStrength = max_degree_observed_in_graph * 1.0
(Fallback when graph empty or no edges: 1.0)
```

**Eigenvector Centrality (power iteration)** — formulaId: `eigenvector-centrality-1.0.0`

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

## AKP-17 Graph Gravity — formulaId: `graph-gravity-1.0.0`

```text
Connectivity_v = min(1, WD(v) / 10)
G_v = Clamp(M_v × R_v × Connectivity_v × (1 + Centrality_v), 0, 1)
```

---

## AKP-18 Knowledge Clusters — formulaId: `cluster-metrics-1.0.0`

```text
Density   = ActualEdges / max(1, PossibleEdges)
Cohesion  = mean(S_internal) over edges inside the cluster
Growth    = (ΔNodes + ΔEdges) / max(1, Δt)
```

Cluster membership: §15.4 (KnowledgeDomain authority only).

---

## AKP-19 Knowledge Bridges — formulaId: `bridge-1.0.0`

```text
ClusterDiversity(v) = number of distinct clusters that v connects / max(1, total_clusters)
Bridge(v)           = Clamp(Centrality(v) × ClusterDiversity(v) × N_v, 0, 1)
```

If total_clusters = 0 → ClusterDiversity = 0, Bridge = 0.

---

## AKP-20 Graph Distance — formulaId: `graph-distance-1.0.0`

```text
Cost(e)       = 1 − S_e
Distance(A,B) = sum of Costs along shortest path
```
Infinity if unreachable. Only accepted, non-deprecated edges participate.

---

## AKP-21 Semantic Similarity — formulaId: `semantic-similarity-1.0.0`

```text
cosine(a, b) = (a · b) / (||a||_2 × ||b||_2)

SemanticSimilarity(q, m) = cosine(embedding_q, embedding_m)
Range: [-1, 1] mathematically; for RetrievalScore the signal is
  S = Clamp((SemanticSimilarity + 1) / 2, 0, 1)
```

**Zero-vector behavior:** If ||a||_2 = 0 OR ||b||_2 = 0: cosine := 0.  
**Dimension mismatch:** reject snapshot.  
**Embedding identity** required in inputSnapshot. tol cosine 1e-9, S 1e-6.

---

## AKP-21.1 Retrieval Physics Score — formulaId: `retrieval-score-1.0.0`

Default weights (sum=1): w_s=0.30, w_g=0.15, w_t=0.10, w_r=0.15, w_m=0.10, w_c=0.10, w_n=0.10

```text
Graph relevance = 1 / (1 + Distance)
Novelty-Fit     = 1 − |N_query − N_cell|
Score(Q,M)      = Clamp(Σ w_i · signal_i, 0, 1)
```
Missing component values default to 0.0.

---

## AKP-21.2 Deterministic Retrieval Pipeline + CandidateUniverse (MVP)

Parameters (AKP-PS-012): retrieval_initial_top_k=100, retrieval_graph_hops=2, retrieval_confidence_threshold=0.0, retrieval_final_k=20.

**Candidate sets (deterministic stages):**
```text
C0  SemanticCandidateSet = lifecycle ∈ {active, dormant} AND embedding present
C1  InitialTopK = top retrieval_initial_top_k of C0 by S; tie-break MemoryId asc
C2  GraphExpanded = C1 ∪ hops≤retrieval_graph_hops accepted edges
C3  Deduplicated by MemoryId (first wins)
C4  TemporallyEligible per §AKP-22.1
C5  ConfidenceEligible Confidence ≥ retrieval_confidence_threshold
C6  Ranked by RetrievalScore desc, MemoryId asc
C7  FinalSelected = DiversitySelection(C6, retrieval_final_k) per §AKP-24
```
No hidden candidates.

---

## AKP-22 Temporal Relevance — formulaId: `temporal-relevance-1.0.0`

```text
TemporalRelevance = exp(−lambda_decay · Δt)
```
Score signal only.

### AKP-22.1 Temporal Eligibility
```text
If lambda_decay = 0: C4 = C3 (no removal).
If lambda_decay > 0:
  Exclude if validTo ≠ null AND validTo < queryTime.
  Exclude if deprecatedAt ≠ null AND deprecatedAt ≤ queryTime.
```

---

## AKP-24 Diversity Selection — formulaId: `diversity-selection-1.0.0`

```text
selected = []; remaining = C6
while |selected| < retrieval_final_k AND remaining not empty:
  for each c in remaining:
    penalty = 1.0
    for each s in selected:
      if same independenceGroup OR cosine > diversity_cosine_threshold:
        penalty = min(penalty, diversity_penalty_factor)
    adjusted = c.baseRetrievalScore × penalty
  select max adjusted; MemoryId ascending tie-break
  remove selected from remaining
return selected
```
Parameters from AKP-PS-007: diversity_cosine_threshold=0.92, diversity_penalty_factor=0.5.

---

## AKP-25 Cognitive Attention Budget

B_total=100; maintenance_reservation=0.15. Σ Cost_i ≤ B_total.

---

## AKP-26 Cognitive Priority — formulaId: `priority-1.0.0`

```text
Priority = Clamp(I × Relevance × Urgency × Potential, 0, 1)
Urgency = urgencyValue from inputSnapshot; missing → 0.0
```
Physics MUST NOT infer Urgency. No optional Trust factor.

---

## AKP-27 Attention Allocation — formulaId: `attention-allocation-1.0.0`

```text
1. reserved = maintenance_reservation × B_total
2. available = B_total − reserved
3. Sort by Priority desc, MemoryId asc
4. Allocate Cost_i while remaining_budget ≥ Cost_i; else skip
```
**ExplorationRate** (0.30 dream / 0.10 default) is recorded only in 0.2.5; does NOT alter allocation.

---

## AKP-28 Load — formulaId: `load-1.0.0`

```text
ContextSize ≥ 0; AttentionCapacity > 0 required else rejected_snapshot
Load = ContextSize / AttentionCapacity
While Load > load_threshold (0.85):
  remove lowest Priority; MemoryId ascending tie-break
```

### AKP-28.1 Cognitive Saturation — formulaId: `cognitive-saturation-1.0.0`

```text
TopKOverlap = |TopK_before ∩ TopK_after| / K
RankingChange = 1 − TopKOverlap
saturated = RankingChange < saturation_delta (0.02)
```

---

## AKP-29 ConnectivityPotential — formulaId: `connectivity-potential-1.0.0`

```text
count = distinct high_Mass targets (Mass ≥ high_Mass_threshold)
        within Graph Distance ≤ max_graph_distance
        with missing OR weak relation (S_r < weak_relation_threshold)
Each target counts once.
ConnectivityPotential = min(1, count / denominator)
```
Defaults PS-005: 0.6 / 0.4 / 2 / 5.

---

## AKP-31 Dream Mode 2.0 — formulaId: `dream-2.0.0`

```text
BridgePotential     = Bridge(A) × Bridge(B)
AttentionAllocation = remaining_Budget / B_total
T_g                 = min(Confidence_A, Confidence_B)
S_r                 = existing Relation Strength between A and B (0 if none)

D = Clamp(E_A × E_B × BridgePotential × N × T_g × AttentionAllocation × (1 − S_r), 0, 1)
```
physicsVersion: 0.2.5; parameterSet: AKP-PS-010

---

## AKP-32 Dream Safety Gate — formulaId: `dream-safety-gate-1.0.0`

T_g ≥ 0.4, N ≥ 0.3, S_r ≤ 0.5; else rejection. Output HYPOTHESIS/CANDIDATE only. Never Fact.

---

## AKP-33 Emergence Score — formulaId: `emergence-1.0.0`

```text
Surprise  = 1 − max similarity of the pair to any existing accepted Relation
Coherence = min(Confidence_A, Confidence_B)
Emergence = Clamp(N × BridgePotential × Surprise × Coherence, 0, 1)
```

---

## AKP-34 Knowledge Island Detection — formulaId: `island-score-1.0.0`

```text
ExternalConnectivity = (edges leaving the cluster) / max(1, total edges of the cluster)
IslandScore = Clamp(Cohesion × (1 − ExternalConnectivity), 0, 1)
```
Empty graph/cluster → IslandScore = 0.0.

---

## AKP-35 Cognitive Maintenance

15% of Attention Budget reserved for Validation, Contradiction Detection, Index Maintenance, Graph Cleanup, Decay Calculation, Backup Verification.

---

## AKP-36 Explainability

Every automatic score MUST be reconstructible from: formulaId, formulaVersion, parameterSetId, parameterSetVersion, parameterSet, inputSnapshot, output.

---

## AKP-37 Numerical Determinism

Same-implementation: bit-identical. Cross-implementation: within vector tolerance (default Scores 1e-6, cosine 1e-9).

---

## AKP-38 Invariants

I1 Scores∈[0,1]; Rates unrestricted  
I2 Identical inputs → identical outputs (same-impl)  
I3 Physics-version change does not alter historical calculations  
I4 Dream Mode produces no Fact-Cells  
I5 Retrieval never uses exclusively semantic similarity  
I6 No artificial Source Diversity via duplicate sources  
I7 Attention Allocation never exceeds B_total  
I8 High Emergence ≠ high Confidence  
I9 Centrality ≠ Truth/Importance  
I10 Physics has no side effects  
I11 Priority has no optional factors  
I12 Cluster membership immutable input; AKP never derives  
I13 Symmetric relations require both directed edges  
I14 Urgency explicit input only  
I15 Scores reconstructible from PhysicsCalculation  
I16 Working Set membership explicit only  
I17 ExplorationRate does not affect MVP allocation  
I18 AttentionCapacity ≤ 0 → rejected_snapshot

---

## Status

AKP 0.2.5 is fully self-contained. Full formula bodies retained. Operational closures: CandidateUniverse C0–C7, Temporal Eligibility, Load/Saturation, ExplorationRate inert in MVP.
