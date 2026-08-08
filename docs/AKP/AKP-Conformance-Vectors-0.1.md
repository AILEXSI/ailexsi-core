# AKP Physics Conformance Vectors 0.1.3

**Physics:** 0.1.4 / 0.2.5  
**Default Score tol:** 1e-6 · **Cosine tol:** 1e-9

## CV-01..CV-26
Prior suite retained (Confidence, Mass, RelationStrength, RetrievalScore, Dream 2.0, gates, Priority, EffectiveReliability, Semantic Similarity, Diversity, Urgency, Symmetric integrity, Explainability, Connectivity count-once).

## CV-27 Importance default
No explicitUserPriority → I=0.5 · formulaId: importance-1.0.0

## CV-28 Importance explicit
explicitUserPriority=0.9 → I=0.9

## CV-29 Empty Evidence SourceDecay
|Evidence|=0 → SourceDecay=1.0; with AgeDecay=0 C=0 Confidence=0 → H=0.45

## CV-30 WorkingSet true → WorkingSetFactor=1.0
## CV-31 WorkingSet false → WorkingSetFactor=0.3

## CV-32 Load normal
ContextSize=50 AttentionCapacity=100 → Load=0.5 no eviction

## CV-33 Load overload
Load>0.85 → evict lowest Priority; tie MemoryId ascending

## CV-34 AttentionCapacity≤0 → rejected_snapshot

## CV-35 Saturation
|∩|=K → RankingChange=0 < 0.02 → saturated=true

## CV-36 Not saturated
|∩|=3 K=5 → RankingChange=0.4 ≥ 0.02 → saturated=false

## CV-37 CandidateUniverse dedup by MemoryId first-wins

## CV-38 lambda_decay=0 → C4=C3 no removal

## CV-39 deprecatedAt≤queryTime + lambda_decay>0 → excluded from C4

## CV-40 lambda_decay=0 → TemporalRelevance=1.0

## CV-41 missing formulaId → non-conformant

## CV-42 formulaId/output mismatch → non-conformant

## CV-43 Priority tie → lower MemoryId first

## CV-44 Replay under AAS-54 canonical equality

## Status
CV-01..CV-44 DEFINED. Implementers must pass within tolerance / rejection rules.
