# AKP – AILEXSI Kernel Physics

**Version:** 0.2.2  
**Status:** Normative  
**Scope:** Graph Physics, Retrieval Physics and Cognitive Resource Model  
**Dependencies:** AKP 0.1.1, ACS, AKP-Parameter-Sets-0.1

---

## AKP-15 Graph Physics

### 15.1 Relation Strength

Default weights (sum=1): w_e=0.35, w_c=0.25, w_t=0.20, w_u=0.20

```text
S_r = Clamp(w_e·E + w_c·C + w_t·T + w_u·U, 0, 1)
```

LLM proposals start with S_r ≤ 0.3 and status = hypothesis.

### 15.2 Relation Types

Minimum set: supports, contradicts, extends, derived_from, inspired_by, causes, caused_by, references, answers, asks, belongs_to, part_of, depends_on, duplicates, similar_to, related_to.

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

Adjacency: directed weighted adjacency matrix A where A[i][j] = S_r of the edge i→j (0 if no edge).  
Self-loops are ignored (A[i][i] = 0).

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

Rules:
- Isolated nodes remain 0.
- Empty graph (N = 0) → empty result vector.
- If the iteration reaches max 100 without convergence, the last x_k is used (still deterministic).
- No random component. No damping factor.

---

## AKP-17 Graph Gravity

```text
Connectivity_v = min(1, WD(v)/10)
G_v = Clamp(M_v × R_v × Connectivity_v × (1 + Centrality_v), 0, 1)
```

---

## AKP-18–20 Clusters, Bridges, Distance

As previously defined. Distance uses Cost(e) = 1 − S_e on directed edges.

---

## AKP-21 Retrieval Physics

Default weights (sum=1): w_s=0.30, w_g=0.15, w_t=0.10, w_r=0.15, w_m=0.10, w_c=0.10, w_n=0.10

Missing component values default to 0.0.

---

## AKP-25–36 Attention, Dream, Emergence, Island, Invariants

As defined in AKP-Parameter-Sets-0.1 (PS-009 … PS-011) and previous formalizations.

Symmetric bidirectional storage rule from 15.3 applies to all graph-dependent scores.

---

## Status

AKP 0.2.2 is deterministic for the MVP. Bidirectional edges are mandatory for symmetric types. Eigenvector Centrality uses an explicit power-iteration algorithm with fixed parameters.
