# AILEXSI Open Source Audit 0.1

**Status:** Normative  
**Date:** 2026-08-08  
**Basis:** ABS 0.1 + concrete examination against Mem0, Graphiti/Zep, Letta, pgvector, pg-boss, Vercel AI SDK and others.

---

## Result Summary

| Category     | Count | Meaning |
|--------------|-------|---------|
| **BUILD**    | 18    | Genuine AILEXSI IP – must be implemented oneself |
| **CONFIGURE**| 7+    | Use infrastructure + place AILEXSI Contracts on top |
| **IMPORT**   | —     | Pure external building blocks |
| **DEFER**    | —     | Deliberately not part of 0.1 |

**Core statement of the Audit:**  
We must build significantly less ourselves than the first ABS suggested.  
At the same time we must define the cognitive layer **harder**, because that is exactly where AILEXSI becomes AILEXSI.

---

## Final Classification (binding)

**BUILD**  
MemoryDomain · IdentityDomain · KnowledgeDomain · TrustDomain · RetrievalDomain · ReflectionDomain · LearningDomain  
SignalEngine · TemporalEngine · GraphPhysics · RetrievalPhysics · AttentionEngine · DreamEngine  
ProjectionEngine  
AIProvider Interface · EmbeddingProvider Interface  
CognitiveAPI · AILEXSIWeb

**CONFIGURE**  
CognitiveEventBus · EventStore (infrastructure) · CognitiveScheduler · PostgresRepository · VectorRepository · GraphRepository  
AI- and Embedding-Provider Adapters

**IMPORT**  
PostgreSQL · pgvector · Drizzle · Zod · Fastify · Next.js · pg-boss · Pino · Docker · Vercel AI SDK / Provider-SDKs · Vitest

**DEFER**  
Microservices · Kubernetes · Kafka · Neo4j · dedicated Vector-DB · autonomous Agents · external Actions · Mobile · Multimodal · Federated Learning · Self-Modification · Advanced Reasoning · Enterprise Multi-Tenancy · Marketplace · own LLM / Embedding model

---

## Key Corrections from the Audit

1. **Memory is Commodity**  
   Mem0, Graphiti, Zep, Letta etc. already solve persistent Memory + Graph + Temporal + Provenance.  
   → “We store memories” is no longer a differentiator.

2. **The real Kernel**  
   Cognitive State Vector (Mass, Energy, Gravity, Entropy, Velocity, Confidence, Resonance, Temperature, Novelty)  
   + versioned, explainable, reproducible calculation  
   + Dream Physics with Safety Gate  
   + Attention Budget  
   + Immutable Cognitive History + Event Replay  

   That is AILEXSI.

3. **Cognitive State is not a neuroscientific model**  
   It is an **AILEXSI-internal computational state representation**.

4. **EventStore**  
   Changed from pure “BUILD” to **CONFIGURE + BUILD**:  
   PostgreSQL infrastructure + AILEXSI Event Contract + Projection Engine.

5. **Scheduler**  
   pg-boss (PostgreSQL-based) → **CONFIGURE**.

6. **AI / Embeddings**  
   Only Interfaces + Adapters. No own Provider Layer.

---

## Competitive Differentiation

AILEXSI should **not** try to beat Mem0, Graphiti or Letta at their own game.  
That would be the wrong battle.

We build a **cognitive orchestration layer above** that formalizes exactly the things that are not the central subject of classical Memory systems:

- versioned Cognitive State Physics
- temporal memory with explicit time dimension
- explainable multi-signal Retrieval
- Attention Budget
- controlled Dreaming (Candidates only)
- human Feedback Loop
- complete Replayability

---

## New Build Gates (binding)

Before actual Runtime code:

1. **Physics Conformance Suite**  
   Every formula receives: Input · Expected Output · Tolerance · Parameter Set · Physics Version · Edge Cases · Invariant Tests.

2. **Event Replay as integrity test**  
   DELETE PROJECTIONS → REPLAY → State must be identical.

Only when both are green may the coding agent continue.
