# AILEXSI Specification System

**Status:** Normative  
**Purpose:** Single source of truth for the First Artificial Cortex

## Normative Priority

Higher-priority documents override lower-priority documents in case of conflict.

```text
1. ACS   – Constitution, Cognitive Laws, Principle Zero
2. AKP   – Kernel Physics (computational models)
3. AAS   – Architecture Specification (domains, runtime, models)
4. ABS   – Build Specification (implementation contract)
5. AUDIT – Open Source Reality Check
6. AMBC  – Master Build Contract (execution rules for coding agents)
7. BUILD MANIFEST – Executable checklist
```

## Absolute Rules for Coding Agents

- The normative documents are **specifications, not suggestions**.
- Do **not** invent missing cognitive laws, physics formulas, domain contracts, or architecture.
- Undefined normative behavior is a **BLOCKER**.
- Physics formulas that are not fully defined in AKP must **not** be invented.
- Architecture discrepancies must be reported as blockers before implementation.
- Do not modify the architecture during repository analysis.

## Document Index

| Document | Path | Content |
|----------|------|---------|
| ACS 0.1 | `ACS/ACS-0.1.md` | Foundations, Cognitive Laws, Principle Zero |
| AKP 0.1 | `AKP/AKP-0.1.md` | Mathematical Foundation, Temporal Model, Primitive Signals, Core Physics |
| AKP 0.2 | `AKP/AKP-0.2.md` | Graph Physics, Retrieval Physics, Attention Budget, Dream Mode 2.0 |
| AAS 0.1 | `AAS/AAS-0.1.md` | Bounded Contexts, Domain Architecture |
| AAS Buch 2 | `AAS/AAS-Buch2.md` | Canonical Domain Models & Event Contracts |
| AAS Buch 3 | `AAS/AAS-Buch3.md` | Runtime Architecture (Modular Monolith) |
| AAS Buch 4 | `AAS/AAS-Buch4.md` | MVP Runtime (24 components, phases, Definition of Done) |
| ABS 0.1 | `ABS/ABS-0.1.md` | Executable Build Contract |
| AUDIT 0.1 | `AUDIT/Open-Source-Audit-0.1.md` | Reality Check against existing open-source systems |
| AMBC 0.1 | `AMBC/AMBC-0.1.md` | Master Build Contract for coding agents |
| Build Manifest 0.1 | `BUILD/Build-Manifest-0.1.md` | Phase-by-phase executable checklist |

## Agent Start Protocol

```text
STEP 0  Repository Analysis
STEP 1  Dependency Audit
STEP 2  Normative Cross-Check
STEP 3  Blocker Report

No implementation until STEP 3 is complete and blockers are resolved.
Physics Conformance Suite must be green before any further implementation.
```
