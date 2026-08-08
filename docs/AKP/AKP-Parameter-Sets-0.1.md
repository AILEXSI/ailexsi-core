# AKP Parameter Sets 0.1

**Physics Version:** 0.1.4 / 0.2.5

PS-001 Temporal: T_scale=31536000 lambda_decay=0.0 mu_temporal_factor=0.1  
PS-002 ResonanceWeights: 0.25/0.20/0.20/0.20/0.15  
PS-003 MassWeights: 0.30/0.25/0.25/0.20  
PS-004 EntropyWeights: 0.25/0.30/0.20/0.25  
PS-005 EnergyThresholds: high_Mass=0.6 weak_rel=0.4 dist=2 denom=5  
PS-006 RelationStrength: 0.35/0.25/0.20/0.20 LLM_max=0.3  
PS-007 RetrievalScore: 0.30/0.15/0.10/0.15/0.10/0.10/0.10 diversity_cos=0.92 penalty=0.5  
PS-008 Centrality: max_iter=100 tol=1e-6  
PS-009 Attention: B_total=100 maint=0.15 explore_dream=0.30 explore_default=0.10 load_threshold=0.85 saturation_delta=0.02  
PS-010 DreamGates: T_g≥0.4 N≥0.3 S_r≤0.5  
PS-011 EmergenceAndIsland  
PS-012 RetrievalPipeline: initial_top_k=100 hops=2 confidence_threshold=0.0 final_k=20  
PS-013 Scheduler: maintenance_interval_s=3600 reflection_interval_s=21600 dream_interval_s=86400 cycle_jitter_s=0 max_concurrent_cycles=1 max_retries_per_cycle=3 retry_backoff_s=[60,300,900] quarantine_ttl_s=86400  
PS-014 Learning: baseDelta=0.01 weight_min=0.05 weight_max=0.60 diversity_penalty_min=0.20 diversity_penalty_max=0.80 load_threshold_min=0.70 load_threshold_max=0.95 retrieval_final_k_min=5 retrieval_final_k_max=50

Rule: PhysicsCalculation records Parameter Set version. Exact identifiers only.  
Learning may only adjust allow-listed keys (see AKP-Learning-0.1). Scheduler reads PS-013 only.
