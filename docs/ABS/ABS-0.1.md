# ABS – AILEXSI Build Specification

**Version:** 0.2.0  
**Status:** Normative Implementation Specification  
**Dependencies:** ACS 0.1.1, AKP 0.1.3, AKP 0.2.4, AAS 0.1.2, AAS-Buch2 0.3.3, AAS-Buch3 0.2.0, AAS-Buch4 0.1.2

---

## 0. Purpose

ABS is the normative implementation contract for the First Artificial Cortex.  
AMBC and Build Manifest operationalize this contract; they do not replace it.

---

## 1. Stack (binding for MVP)

```text
Language: TypeScript (strict) · Runtime: Node.js · Package mgr: pnpm
API: Fastify · Frontend: Next.js · DB: PostgreSQL + pgvector · ORM: Drizzle
Validation: Zod · Queue: pg-boss · Test: Vitest · Log: Pino · Container: Docker
```

---

## 2. Repository layout (binding)

```text
ailexsi/
  apps/api, apps/web
  packages/core/{memory,identity,knowledge,trust,retrieval,reflection,learning}
  packages/physics, packages/contracts
  packages/infrastructure/{eventstore,projections,persistence,providers,scheduler}
  docs/
```

Physics package MUST have zero imports from infrastructure, apps, or providers.

---

## 3. Classification: BUILD | CONFIGURE | IMPORT | DEFER (AMBC).

## 4. Implementation order: AMBC Build Order. Physics Conformance = Phase 04 HARD GATE.

## 5. Mandatory tests before domain code beyond contracts

1. Physics Conformance Suite (all CV-* green within tolerance)
2. Architecture import boundaries
3. Dream ≠ Fact
4. Event append-only + idempotencyKey semantics
5. Replay equality (AAS-54)

## 6. Non-goals (MVP): Microservices, Kafka, Neo4j, dedicated vector DB, autonomous external actions, mobile, multimodal, federated learning, self-modification, marketplace, own LLM.

## Status

ABS 0.2.0 is the normative implementation contract. Deviations require a version bump.
