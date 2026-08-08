# AKP Physics Conformance Vectors 0.1.2

**Status:** Normative  
**Physics Version:** 0.1.3 / 0.2.4  
**Default Score tolerance:** absolute 1e-6  
**Cosine tolerance:** absolute 1e-9  

Cross-implementation: match within tolerance. Bit-identical across languages is NOT required unless a vector says so.

---

## CV-01 Confidence
```text
Input: E=0.8, SD=0.9, C=0.1 → Confidence=0.648  tol=1e-6
```

## CV-02 Mass
```text
Input: I=0.7 U=0.5 Confidence=0.648 R=0.4 → Mass=0.577  tol=1e-6
```

## CV-03 RelationStrength
```text
Input: E=0.8 C=0.7 T=0.9 U=0.5 → S_r=0.735  tol=1e-6
```

## CV-04 RetrievalScore
```text
Input: S=0.9 G=0.5 T=0.8 R=0.4 M=0.577 C=0.648 N=0.3 → Score=0.6375  tol=1e-6
```

## CV-05 DreamScore 2.0
```text
physics_version:0.2.4 formula_version:dream-2.0.0 parameter_set:AKP-PS-010
E_A=0.8 E_B=0.7 BridgeA=0.5 BridgeB=0.4 N=0.6 T_g=0.55 Att=0.5 S_r=0.2
→ D=0.014784  tol=1e-6  Gate=pass
```

## CV-06 Dream Rejection
```text
T_g=0.3 → Safety Gate fails. No DreamCandidate.
```

## CV-07 ConnectivityPotential
```text
3 distinct high_Mass targets weak/missing → count=3 ConnectivityPotential=0.6
```

## CV-08 Energy
```text
N=0.7 CP=0.6 H=0.3 R=0.5 → Energy=0.147
```

## CV-09 Emergence
```text
N=0.6 BP=0.4 Surprise=0.8 Coherence=0.7 → Emergence=0.1344
```

## CV-10 IslandScore
```text
Cohesion=0.9 Ext=0.2 → IslandScore=0.72
```

## CV-11 Empty Graph Centrality
```text
N=0 → all centralities=0.0
```

## CV-12 Attention Allocation
```text
A(0.9,30) B(0.8,40) C(0.8,20) D(0.5,50) reserved=15 → allocated A,B
```

## CV-13 BridgePotential=0 → D=0
## CV-14 AttentionAllocation=0 → D=0
## CV-15 T_g=0.4 pass
## CV-16 N=0.3 pass
## CV-17 S_r=0.5 pass
## CV-18 S_r=0.500001 fail

## CV-19 Priority
```text
I=0.8 Rel=0.7 Urgency=1.0 Pot=0.5 → Priority=0.28  Trust NOT a factor
```

## CV-20 EffectiveReliability
```text
0.8, missing, 0.6 → 0.8, 0.5, 0.6  E≈0.633333
```

## CV-21 Semantic Similarity
```text
formula_version: semantic-similarity-1.0.0
a=[1,0,0] b=[1,0,0] → cosine=1.0 S=1.0  tol_cos=1e-9
a=[1,0,0] b=[0,1,0] → cosine=0.0 S=0.5
a=[0,0,0] b=[1,0,0] → cosine=0.0 S=0.5  (zero-vector)
a=[1,0] b=[1,0,0] → rejected_snapshot (dimension mismatch)
```

## CV-22 Diversity Selection
```text
final_k=2
A:0.90 id=aaa G1; B:0.85 id=bbb G1; C:0.80 id=ccc G2
penalty_factor=0.5
Iter1: select A; Iter2: B adj=0.425 C adj=0.80 → select C
Expected order: [A, C]
```

## CV-23 Urgency explicit
```text
urgencySource=deadline urgencyValue=1.0 I=R=P=0.5 → Priority=0.125
missing urgency → Urgency=0.0 Priority=0.0
```

## CV-24 Symmetric relation integrity
```text
only A→B similar_to 0.7 → rejected_snapshot
A→B and B→A similar_to 0.7 → accepted
```

## CV-25 Explainability fields
```text
missing formulaId or inputSnapshot → non-conformant
all fields present → reconstructible → conformant
```

## CV-26 Connectivity count-once
```text
3 high_Mass targets (2 weak, 1 missing) → count=3 not 4
ConnectivityPotential=0.6
```

## Invariants
Scores∈[0,1]; same-impl identical; cross-impl within tol; Dream≠Fact;
no optional Priority factors; cluster never derived by AKP; Urgency never inferred.
