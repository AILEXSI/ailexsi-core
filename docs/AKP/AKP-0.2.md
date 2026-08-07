# AKP – AILEXSI Kernel Physics

**Version:** 0.2  
**Status:** Normative Draft  
**Scope:** Graph Physics, Retrieval Physics and Cognitive Resource Model  
**Dependencies:** AKP 0.1 + ACS (Cognitive Laws)

Every formula in this document has a concrete purpose in the Cortex. No speculative mathematics.

---

## AKP-15 Graph Physics

The Knowledge Graph is a calculation space.  
Memory Cell = Node. Relation = Edge.

### 15.1 Relation Strength

```text
S_r = w_e · E + w_c · C + w_t · T + w_u · U
```

with ∑ w_i = 1.

- E = Evidence of the relationship
- C = semantic coherence
- T = temporal consistency
- U = usage/confirmation of the relationship

An LLM-proposed relation starts as a hypothesis and initially possesses low S_r.

### 15.2 Relation Types (minimum set)

```text
supports, contradicts, extends, derived_from, inspired_by,
causes, caused_by, references, answers, asks,
belongs_to, part_of, depends_on, duplicates, similar_to, related_to
```

### 15.3 Directed vs. Undirected Relations

Standard: directed.  
Symmetric types (`similar_to`, `related_to`, `duplicates`) may be modelled bidirectionally.

---

## AKP-16 Node Centrality

**Degree Centrality**

```text
D(v) = deg(v) / (N − 1)
```

**Weighted Degree**

```text
WD(v) = Σ S_e / MaxPossibleStrength
```

**Eigenvector Centrality**  
A Cell is central when it is connected to other central Cells.  
Implementation: classic power-iteration algorithm (deterministic, versioned).

---

## AKP-17 Graph Gravity

Extension of Gravity from AKP 0.1:

```text
G_v = M_v × R_v × C_v × (1 + Centrality_v)
G_v = Clamp(G_v, 0, 1)
```

---

## AKP-18 Knowledge Clusters

Every cluster possesses:
- cluster_id
- density
- cohesion
- growth_rate
- temperature
- centrality

**18.1 Density**

```text
Density = ActualEdges / PossibleEdges
```

**18.2 Cohesion**

```text
Cohesion = mean(S_internal)
```

**18.3 Growth**

```text
Growth = (ΔNodes + ΔEdges) / Δt
```

---

## AKP-19 Knowledge Bridges

**Bridge Score**

```text
Bridge(v) = Centrality(v) × ClusterDiversity(v) × N_v
```

Cells with high Bridge Score connect otherwise separated knowledge domains and are preferred candidates for Dream Mode and Creativity.

---

## AKP-20 Graph Distance

```text
Cost(e) = 1 − S_e
Distance(A,B) = Σ (1 − S_e)  for e in path
```

(weighted shortest path length)

---

## AKP-21 Retrieval Physics

**Candidate Score** for Query Q and Cell M:

```text
Score(Q,M) = w_s S + w_g G + w_t T + w_r R + w_m M + w_c C + w_n N
```

with ∑ w_i = 1.

- S = semantic similarity
- G = Graph relevance
- T = temporal relevance
- R = Resonance
- M = Mass
- C = Confidence
- N = Novelty-Fit to the Query

---

## AKP-22 Temporal Relevance

```text
TemporalRelevance = e^(−λ Δt)
```

only active when the Knowledge Domain has temporal decay activated.

---

## AKP-23 Cognitive Retrieval Pipeline

```text
Semantic Retrieval
      ↓
Graph Expansion
      ↓
Temporal Filtering
      ↓
Trust Filtering
      ↓
Resonance Ranking
      ↓
Diversity Filtering
      ↓
Final Context Window
```

---

## AKP-24 Diversity Penalty

Results that duplicate already strongly represented information are down-ranked.  
Goal: maximal epistemic coverage, not maximal repetition.

---

## AKP-25 Cognitive Attention Budget

```text
B_total = available cognitive capacity of a cycle
```

Every operation carries an estimated Cost.  
Constraint:

```text
Σ Cost_i ≤ B_total
```

---

## AKP-26 Cognitive Priority

```text
Priority = I × Relevance × Urgency × Potential × (optional: Trust)
```

---

## AKP-27 Attention Competition

Multiple processes (Reflection, Dream Mode, Indexing, Maintenance …) compete for the same budget.  
Allocation occurs dynamically according to Priority and remaining budget.

---

## AKP-28 Exploration vs. Exploitation

```text
ExplorationRate ∈ [0,1]
ExploitationRate = 1 − ExplorationRate
```

The rate is adjusted dynamically (uncertainty, novelty, available budget, Dream Mode active).

---

## AKP-29 Cognitive Load

```text
Load = ContextSize / AttentionCapacity
```

When Load > Threshold, reduction is required (Cells, Graph depth, redundant sources).

---

## AKP-30 Cognitive Saturation

Beyond a defined point, additional context produces no significant benefit.  
AILEXSI must know when enough knowledge is enough.

---

## AKP-31 Dream Mode 2.0

```text
D = E_A × E_B × BridgePotential × N × T_g × AttentionAllocation × (1 − S_r)
```

Prefers distant but trustworthy knowledge domains.

---

## AKP-32 Dream Safety Gate

A Dream candidate is only generated when:
- T_g ≥ minimum_threshold
- N ≥ minimum_threshold
- S_r ≤ maximum_threshold

Otherwise rejection.

---

## AKP-33 Emergence Score

```text
Emergence = N × BridgePotential × Surprise × Coherence
```

High Emergence ≠ truth. Only unusual, potentially interesting connection.

---

## AKP-34 Knowledge Island Detection

```text
IslandScore = Cohesion × (1 − ExternalConnectivity)
```

Recognizes isolated knowledge domains and can deliberately seek bridges.

---

## AKP-35 Cognitive Maintenance

A fixed share of the Attention Budget is reserved for maintenance:
- Validation
- Contradiction Detection
- Index Maintenance
- Graph Cleanup
- Decay Calculation
- Backup Verification

---

## AKP-36 Invariants (automatically testable)

| ID  | Invariant |
|-----|-----------|
| I1  | All scores lie in their defined range |
| I2  | Identical inputs → identical outputs |
| I3  | Physics-version change does not alter historical calculations |
| I4  | Dream Mode produces no Fact-Cells |
| I5  | Retrieval never uses exclusively semantic similarity |
| I6  | Duplicates of the same source produce no artificial Source Diversity |
| I7  | Attention Allocation never exceeds B_total |
| I8  | High Emergence never automatically produces high Confidence |
| I9  | Graph Centrality does not automatically mean Truth or Importance |
| I10 | Physics possesses no side effects |

---

## Status

AKP 0.2 is content-complete.  
We now possess:
- primitive signals
- derived cognitive states
- Graph calculation space
- Retrieval Physics
- Attention-Budget model
- Dream Mode with Safety Gates and Emergence
