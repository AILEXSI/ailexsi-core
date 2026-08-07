# AKP Physics Conformance Vectors 0.1

**Status:** Normative  
**Purpose:** Independent implementers must produce identical outputs for these vectors.

Tolerance for floating-point comparisons: absolute 1e-6 unless stated otherwise.

Parameter Sets used: AKP-PS-001 … AKP-PS-011 (version 0.1).

---

## CV-01 Confidence

```text
Input:
  E  = 0.8
  SD = 0.9
  C  = 0.1

Expected:
  BaseEvidence        = 0.72
  ContradictionFactor = 0.9
  Confidence          = 0.648
```

---

## CV-02 Mass

```text
Input:
  I          = 0.7
  U          = 0.5
  Confidence = 0.648
  R          = 0.4

Expected (weights 0.30 / 0.25 / 0.25 / 0.20):
  M_raw = 0.30*0.7 + 0.25*0.5 + 0.25*0.648 + 0.20*0.4
        = 0.210 + 0.125 + 0.162 + 0.080
        = 0.577
  Mass  = 0.577
```

---

## CV-03 RelationStrength

```text
Input:
  E = 0.8
  C = 0.7
  T = 0.9
  U = 0.5

Expected (weights 0.35 / 0.25 / 0.20 / 0.20):
  S_r = 0.35*0.8 + 0.25*0.7 + 0.20*0.9 + 0.20*0.5
      = 0.280 + 0.175 + 0.180 + 0.100
      = 0.735
```

---

## CV-04 RetrievalScore

```text
Input:
  S = 0.9   # semantic
  G = 0.5   # graph relevance
  T = 0.8   # temporal
  R = 0.4
  M = 0.577
  C = 0.648
  N = 0.3   # novelty-fit

Expected (weights 0.30/0.15/0.10/0.15/0.10/0.10/0.10):
  Score = 0.30*0.9 + 0.15*0.5 + 0.10*0.8 + 0.15*0.4
        + 0.10*0.577 + 0.10*0.648 + 0.10*0.3
        = 0.270 + 0.075 + 0.080 + 0.060
        + 0.0577 + 0.0648 + 0.030
        = 0.6375
```

---

## CV-05 DreamScore (Safety Gate)

```text
Input:
  E_A = 0.8, E_B = 0.7
  R_A = 0.5, R_B = 0.4
  S   = 0.2
  N   = 0.6
  T_g = 0.55

Expected (simple DreamScore, AKP-11):
  DreamScore = 0.8 * 0.7 * 0.5 * 0.4 * (1-0.2) * 0.6 * 0.55
             = 0.03696

Safety Gate:
  T_g ≥ 0.4 → pass
  N   ≥ 0.3 → pass
  S   ≤ 0.5 → pass
  → candidate is admissible
```

---

## CV-06 Dream Rejection

```text
Input:
  T_g = 0.3   # below minimum

Expected:
  Safety Gate fails
  No DreamCandidate is emitted
```

---

## CV-07 ConnectivityPotential

```text
Input:
  high_Mass_cells within Distance ≤ 2: 4
  of which weak or missing relations: 3

Expected:
  count = 3
  ConnectivityPotential = min(1, 3/5) = 0.6
```

---

## CV-08 Energy

```text
Input:
  N = 0.7
  ConnectivityPotential = 0.6
  H = 0.3
  R = 0.5

Expected:
  Energy = 0.7 * 0.6 * (1-0.3) * 0.5 = 0.147
```

---

## CV-09 Emergence

```text
Input:
  N = 0.6
  BridgePotential = 0.4
  Surprise = 0.8
  Coherence = 0.7

Expected:
  Emergence = 0.6 * 0.4 * 0.8 * 0.7 = 0.1344
```

---

## CV-10 IslandScore

```text
Input:
  Cohesion = 0.9
  ExternalConnectivity = 0.2

Expected:
  IslandScore = 0.9 * (1-0.2) = 0.72
```

---

## CV-11 Empty Graph Centrality

```text
Input:
  N = 0 nodes

Expected:
  All centralities = 0.0
  MaxPossibleStrength fallback = 1.0
```

---

## CV-12 Attention Allocation (deterministic)

```text
Input:
  B_total = 100
  maintenance_reservation = 0.15 → reserved = 15
  available = 85

  Candidates (Priority, Cost, MemoryId):
  A: Priority 0.9, Cost 30, id=...a
  B: Priority 0.8, Cost 40, id=...b
  C: Priority 0.8, Cost 20, id=...c   # same Priority as B → tie-break by id
  D: Priority 0.5, Cost 50, id=...d

Expected order of consideration: A, then B vs C by MemoryId ascending, then D.
Assume id_B < id_C lexicographically.

Allocation:
  A takes 30 → remaining 55
  B takes 40 → remaining 15
  C cost 20 > 15 → skip
  D cost 50 > 15 → skip

Allocated: A, B
```

---

## Invariant Checks (must hold for every vector)

- All scores ∈ [0, 1] after Clamp
- Σ weights of any weight set = 1.0
- Dream output is never stored as Fact
- Identical (input, parameter_set, physics_version) → identical output
