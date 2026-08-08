# AKP Physics Conformance Vectors 0.1.4

**Physics:** 0.1.4 / 0.2.5  
**Default Score tol:** 1e-6 · **Cosine tol:** 1e-9  
**Executable fixtures:** `phase04/fixtures/CV-01.json` … `CV-44.json`  
**Rule:** Expected values are frozen in fixtures. Implementations MUST NOT derive expected from SUT output.

Machine-readable fixtures are normative for input/expected pairs. This document indexes them.

| CV | formulaId | Summary expected |
|----|-----------|------------------|
| CV-01 | confidence-1.0.0 | Confidence=0.32 (E=0.8,SD=0.5,C=0.2) |
| CV-02 | mass-1.0.0 | Mass=0.37 |
| CV-03 | relation-strength-1.0.0 | S_r=0.61 |
| CV-04 | retrieval-score-1.0.0 | Score=0.604 |
| CV-05 | dream-2.0.0 | D=0.01512 BridgePotential=0.2 |
| CV-06 | dream-safety-gate-1.0.0 | PASS HYPOTHESIS |
| CV-07 | dream-safety-gate-1.0.0 | REJECTED |
| CV-08 | priority-1.0.0 | Priority=0.1 |
| CV-09 | effective-reliability-1.0.0 | 0.7 |
| CV-10 | semantic-similarity-1.0.0 | cosine=1 S=1 |
| CV-11 | diversity-selection-1.0.0 | selected [m1,m3] |
| CV-12 | priority-1.0.0 | Urgency missing → Priority=0 |
| CV-13 | (graph integrity) | symmetric conformant |
| CV-14 | (graph integrity) | graph_integrity_violation |
| CV-15 | (explainability) | conformant |
| CV-16 | connectivity-potential-1.0.0 | count=2 CP=0.4 |
| CV-17 | resonance-1.0.0 | R≈0.13120142561521414 |
| CV-18 | evidence-strength-1.0.0 | E=0 empty |
| CV-19 | source-diversity-1.0.0 | SD=1.0 |
| CV-20 | contradiction-1.0.0 | C=0.5 |
| CV-21 | novelty-1.0.0 | N=1.0 |
| CV-22 | usage-1.0.0 | U=0.5 |
| CV-23 | energy-1.0.0 | Energy=0.048 |
| CV-24 | gravity-1.0.0 | G=0.06 |
| CV-25 | degree-centrality-1.0.0 | D=2/3 |
| CV-26 | emergence-1.0.0 | Emergence=0.048 |
| CV-27 | importance-1.0.0 | I=0.5 default |
| CV-28 | importance-1.0.0 | I=0.9 |
| CV-29 | entropy-1.0.0 | SourceDecay=1 H=0.45 |
| CV-30 | temperature-1.0.0 | WorkingSetFactor=1.0 |
| CV-31 | temperature-1.0.0 | WorkingSetFactor=0.3 |
| CV-32 | load-1.0.0 | Load=0.5 |
| CV-33 | load-1.0.0 | evict m0,m1 remaining 8 |
| CV-34 | load-1.0.0 | rejected_snapshot |
| CV-35 | cognitive-saturation-1.0.0 | saturated=true |
| CV-36 | cognitive-saturation-1.0.0 | rankingChange=0.4 |
| CV-37 | (CandidateUniverse) | dedup first-wins |
| CV-38 | temporal-relevance-1.0.0 | lambda=0 → C4=C3 |
| CV-39 | temporal-relevance-1.0.0 | deprecated excluded |
| CV-40 | temporal-relevance-1.0.0 | TemporalRelevance=1.0 |
| CV-41 | (PhysicsCalculation) | missing formulaId → non-conformant |
| CV-42 | confidence-1.0.0 | output mismatch → non-conformant |
| CV-43 | priority-1.0.0 | tie MemoryId asc |
| CV-44 | (AAS-54) | replay equality true |

## Status

CV-01..CV-44 fully fixture-backed. Phase 04 requires 44/44 PASS via `node phase04/run.mjs`.
