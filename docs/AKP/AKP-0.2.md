# AKP – AILEXSI Kernel Physics

**Version:** 0.2.5  
**Status:** Normative (self-contained)  
**Dependencies:** AKP 0.1.4, ACS 0.1.1, AKP-Parameter-Sets-0.1, AKP-Formula-Registry-0.1

---

## AKP-15 Graph
Relation Strength formulaId: relation-strength-1.0.0  
Symmetric integrity: both directed edges required or rejected_snapshot.  
Cluster: KnowledgeDomain authority only; clusterId in snapshot or reject.

## AKP-16 Centrality
degree-centrality-1.0.0, weighted-degree-1.0.0, eigenvector-centrality-1.0.0 (power iteration max 100, tol 1e-6).

## AKP-17..20
graph-gravity-1.0.0, cluster-metrics-1.0.0, bridge-1.0.0, graph-distance-1.0.0

## AKP-21 Semantic Similarity · formulaId: semantic-similarity-1.0.0
cosine; S=Clamp((cosine+1)/2,0,1); zero-vector→0; dim mismatch→rejected_snapshot

## AKP-21.1 RetrievalScore · formulaId: retrieval-score-1.0.0

## AKP-21.2 CandidateUniverse (deterministic stages)
```text
C0 SemanticCandidateSet = eligible lifecycle {active,dormant} + embedding present
C1 InitialTopK = top retrieval_initial_top_k by S, MemoryId asc
C2 GraphExpanded = C1 ∪ hops≤retrieval_graph_hops accepted edges
C3 Deduplicated by MemoryId (first wins)
C4 TemporallyEligible per §22.1
C5 ConfidenceEligible Confidence≥retrieval_confidence_threshold
C6 Ranked by RetrievalScore desc, MemoryId asc
C7 FinalSelected = DiversitySelection(C6, retrieval_final_k)
```
No hidden candidates.

## AKP-22 TemporalRelevance · formulaId: temporal-relevance-1.0.0
TemporalRelevance=exp(−lambda_decay·Δt) — score only.

### AKP-22.1 Temporal Eligibility
lambda_decay=0 → C4=C3 (no removal).  
lambda_decay>0 → exclude if validTo<queryTime or deprecatedAt≤queryTime.

## AKP-24 Diversity · formulaId: diversity-selection-1.0.0
Greedy: all remaining → penalty → max adjusted + MemoryId tie-break → repeat.

## AKP-26 Priority · formulaId: priority-1.0.0
Urgency=urgencyValue explicit; missing→0.0. No Trust factor.

## AKP-27 Attention Allocation · formulaId: attention-allocation-1.0.0
Reserve maintenance; sort Priority desc MemoryId asc; allocate while budget allows.  
**ExplorationRate recorded only in MVP; does NOT alter allocation in 0.2.5.**

## AKP-28 Load · formulaId: load-1.0.0
ContextSize≥0, AttentionCapacity>0 required; else rejected_snapshot.  
Load=ContextSize/AttentionCapacity.  
While Load>load_threshold: remove lowest Priority (MemoryId asc tie-break).

## AKP-28.1 Saturation · formulaId: cognitive-saturation-1.0.0
TopKOverlap=|∩|/K; RankingChange=1−TopKOverlap; saturated=(RankingChange<saturation_delta).

## AKP-29 ConnectivityPotential · formulaId: connectivity-potential-1.0.0
Count distinct high_Mass targets once.

## AKP-31 Dream · formulaId: dream-2.0.0
## AKP-32 Gate · formulaId: dream-safety-gate-1.0.0
## AKP-33 Emergence · formulaId: emergence-1.0.0
## AKP-34 IslandScore · formulaId: island-score-1.0.0

## AKP-36 Explainability: formulaId required
## AKP-37 Same-impl bit-identical; cross-impl within tol
## AKP-38 I1–I18 including Working Set explicit, ExplorationRate inert MVP, AttentionCapacity guard

## Status
AKP 0.2.5 closes Load, Saturation, CandidateUniverse, Temporal Eligibility, ExplorationRate MVP behavior.
