# AAS – AILEXSI Architecture Specification

## Buch 3 – Runtime Architecture

**Version:** 0.2.0  
**Status:** Normative  
**Dependencies:** ACS 0.1.1, AKP 0.1.3, AKP 0.2.4, AAS 0.1.2, AAS-Buch2 0.3.3

---

## Layers

```text
Application Layer    API, UI, Auth adapters
Domain Layer         Memory, Identity, Knowledge, Trust, Reflection, Learning, Retrieval
Physics Layer        Pure computation (AKP) — no I/O
Infrastructure       EventBus, EventStore, Projections, Persistence, Providers, Scheduler
```

---

## Allowed / Forbidden Dependencies

| Layer | MAY depend on | MUST NOT depend on |
|-------|---------------|--------------------|
| Physics | nothing external | DB, AI, HTTP, FS, EventBus, GUI |
| Domain | Physics (pure calls), own events | foreign domain mutation, providers directly |
| Application | Domain query interfaces, commands | Physics internals, raw DB |
| Infrastructure | external systems | Domain business rules |

---

## Boundaries

**EventBus**  
Transports DomainEvents only. No business logic. At-least-once delivery; idempotency handled by EventStore + idempotencyKey.

**EventStore**  
Append-only. Authority for history. Enforces aggregateVersion ordering and idempotencyKey rules (AAS-Buch2).

**Projection**  
Derived state only. Rebuildable from EventStore. MUST NOT generate new entity UUIDs on replay. DELETE PROJECTIONS → REPLAY → IDENTICAL STATE (AAS-54).

**Scheduler**  
Triggers Reflection / Dream / Maintenance cycles. Does not contain cognitive formulas. Passes work to Domain via commands.

**Provider boundary (AI / Embedding)**  
Behind AIProvider / EmbeddingProvider interfaces. Physics never calls providers. Domain may call providers only for non-authoritative suggestions; scores remain Physics.

**Transaction boundary**  
One command → zero or more events → single transactional append to EventStore. Projections update after successful append (eventually consistent within process for MVP).

**Failure boundary**  
Command failure before append: no event, safe retry with same idempotencyKey. Projection failure: rebuild from EventStore; never invent state.

---

## Status

Buch 3 defines runtime contracts only. Implementation order is AMBC 0.1.1 + Build Manifest 0.2.
