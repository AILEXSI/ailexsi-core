# AKP Physics Conformance Vectors 0.1.1

**Status:** Normative  
**Purpose:** Independent implementers must produce identical outputs for these vectors.  
**Physics Version:** 0.1.3 / 0.2.3  
**Tolerance:** absolute 1e-6 unless stated otherwise.

Parameter Sets used: AKP-PS-001 … AKP-PS-011 (version 0.1).

---

## CV-01 Confidence

```text
Input: E=0.8, SD=0.9, C=0.1
Expected:
  BaseEvidence        = 0.72
  ContradictionFactor = 0.9
  Confidence          = 0.648
```

---

## CV-02 Mass

```text
Input: I=0.7, U=0.5, Confidence=0.648, R=0.4
Expected (weights 0.30/0.25/0.25/0.20):
  M_raw = 0.30*0.7 + 0.25*0.5 + 0.25*0.648 + 0.20*0.4 = 0.577
  Mass  = 0.577
```

---

## CV-03 RelationStrength

```text
Input: E=0.8, C=0.7, T=0.9, U=0.5
Expected (weights 0.35/0.25/0.20/0.20):
  S_r = 0.35*0.8 + 0.25*0.7 + 0.20*0.9 + 0.20*0.5 = 0.735
```

---

## CV-04 RetrievalScore

```text
Input: S=0.9, G=0.5, T=0.8, R=0.4, M=0.577, C=0.648, N=0.3
Expected (weights 0.30/0.15/0.10/0.15/0.10/0.10/0.10):
  Score = 0.6375
```

---

## CV-05 DreamScore 2.0 (canonical)

```text
physics_version:  0.2.3
formula_version:  dream-2.0.0
parameter_set:    AKP-PS-010

Input:
  E_A = 0.8
  E_B = 0.7
  Bridge(A) = 0.5
  Bridge(B) = 0.4
  BridgePotential = 0.5 × 0.4 = 0.2
  N = 0.6
  T_g = 0.55
  AttentionAllocation = 0.5
  S_r = 0.2

Expected:
  D = 0.8 × 0.7 × 0.2 × 0.6 × 0.55 × 0.5 × (1 − 0.2)
    = 0.8 × 0.7 × 0.2 × 0.6 × 0.55 × 0.5 × 0.8
    = 0.014784

Safety Gate:
  T_g ≥ 0.4 → pass
  N   ≥ 0.3 → pass
  S_r ≤ 0.5 → pass
  → candidate is admissible
```

---

## CV-06 Dream Rejection (T_g below gate)

```text
Input: T_g = 0.3  (all other inputs as CV-05)
Expected: Safety Gate fails. No DreamCandidate emitted.
```

---

## CV-07 ConnectivityPotential

```text
Input: high_Mass cells within Distance ≤ 2: 4; of which weak/missing: 3
Expected: count=3, ConnectivityPotential = min(1, 3/5) = 0.6
```

---

## CV-08 Energy

```text
Input: N=0.7, ConnectivityPotential=0.6, H=0.3, R=0.5
Expected: Energy = 0.7 × 0.6 × 0.7 × 0.5 = 0.147
```

---

## CV-09 Emergence

```text
Input: N=0.6, BridgePotential=0.4, Surprise=0.8, Coherence=0.7
Expected: Emergence = 0.6 × 0.4 × 0.8 × 0.7 = 0.1344
```

---

## CV-10 IslandScore

```text
Input: Cohesion=0.9, ExternalConnectivity=0.2
Expected: IslandScore = 0.9 × 0.8 = 0.72
```

---

## CV-11 Empty Graph Centrality

```text
Input: N = 0 nodes
Expected: All centralities = 0.0; MaxPossibleStrength fallback = 1.0
```

---

## CV-12 Attention Allocation (deterministic)

```text
Input:
  B_total = 100
  maintenance_reservation = 0.15 → reserved = 15
  available = 85
  Candidates (Priority, Cost, MemoryId):
    A: 0.9, 30, id=...a
    B: 0.8, 40, id=...b
    C: 0.8, 20, id=...c
    D: 0.5, 50, id=...d
  Assume id_B < id_C lexicographically.

Expected:
  A takes 30 → remaining 55
  B takes 40 → remaining 15
  C cost 20 > 15 → skip
  D cost 50 > 15 → skip
  Allocated: A, B
```

---

## CV-13 BridgePotential = 0

```text
physics_version: 0.2.3
formula_version: dream-2.0.0
Input: Bridge(A)=0, Bridge(B)=0.5, all other positive
Expected: BridgePotential = 0 → D = 0
```

---

## CV-14 AttentionAllocation = 0

```text
physics_version: 0.2.3
formula_version: dream-2.0.0
Input: AttentionAllocation = 0, all other positive
Expected: D = 0
```

---

## CV-15 Gate boundary T_g = 0.4

```text
Input: T_g = 0.4, N = 0.5, S_r = 0.3
Expected: Gate PASSES (T_g ≥ 0.4)
```

---

## CV-16 Gate boundary N = 0.3

```text
Input: T_g = 0.5, N = 0.3, S_r = 0.3
Expected: Gate PASSES (N ≥ 0.3)
```

---

## CV-17 Gate boundary S_r = 0.5

```text
Input: T_g = 0.5, N = 0.5, S_r = 0.5
Expected: Gate PASSES (S_r ≤ 0.5)
```

---

## CV-18 Gate reject S_r = 0.500001

```text
Input: T_g = 0.5, N = 0.5, S_r = 0.500001
Expected: Gate FAILS (S_r > 0.5)
```

---

## CV-19 Priority (no optional Trust)

```text
Input: I=0.8, Relevance=0.7, Urgency=1.0, Potential=0.5
Expected: Priority = Clamp(0.8 × 0.7 × 1.0 × 0.5, 0, 1) = 0.28
Note: Trust is NOT a factor.
```

---

## CV-20 EffectiveReliability

```text
Evidence list:
  e1.reliability = 0.8
  e2.reliability = missing
  e3.reliability = 0.6
Expected EffectiveReliabilities: 0.8, 0.5, 0.6
E = (0.8 + 0.5 + 0.6) / 3 = 0.633333...
```

---

## Invariant Checks (must hold for every vector)

- All Scores ∈ [0, 1] after Clamp
- Rates (Velocity) unrestricted
- Σ weights of any weight set = 1.0
- Dream output is never stored as Fact
- Identical (input, parameter_set, physics_version, formula_version) → identical output
- Priority has no optional factors
