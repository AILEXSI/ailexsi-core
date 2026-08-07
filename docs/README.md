# AILEXSI Specification System

**Status:** Normative  
**Purpose:** Single source of truth for the First Artificial Cortex

## Normative Priority

Higher-priority documents override lower-priority documents in case of conflict.

```text
1. ACS            – Constitution, Cognitive Laws, Principle Zero
2. AKP            – Kernel Physics (computational models)
3. AAS            – Architecture Specification (domains, runtime, models)
4. NORMATIVE PATCHES – Targeted corrections that override lower docs when listed
5. ABS            – Build Specification (implementation contract)
6. AUDIT          – Open Source Reality Check
7. AMBC           – Master Build Contract (execution rules for coding agents)
8. BUILD MANIFEST – Executable checklist
```

**Rule:** When a Normative Patch is present, its statements override any contradictory statements in lower-priority documents.  
The preferred long-term state is that all patches are folded into the canonical documents and the PATCHES folder becomes pure change history.

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
| AKP 0.1.1 | `AKP/AKP-0.1.md` | Core Physics (formalized) |
| AKP 0.2.1 | `AKP/AKP-0.2.md` | Graph, Retrieval, Attention, Dream (formalized) |
| AAS 0.1 | `AAS/AAS-0.1.md` | Bounded Contexts, Domain Architecture |
| AAS Buch 2 v0.3 | `AAS/AAS-Buch2.md` | Full Canonical Domain Models & Event Contracts |
| AAS Buch 3 | `AAS/AAS-Buch3.md` | Runtime Architecture (Modular Monolith) |
| AAS Buch 4 | `AAS/AAS-Buch4.md` | MVP Runtime |
| ABS 0.1 | `ABS/ABS-0.1.md` | Executable Build Contract |
| AUDIT 0.1 | `AUDIT/Open-Source-Audit-0.1.md` | Reality Check |
| AMBC 0.1 | `AMBC/AMBC-0.1.md` | Master Build Contract |
| Build Manifest 0.1 | `BUILD/Build-Manifest-0.1.md` | Phase-by-phase checklist |
| Normative Patch 0.1 | `PATCHES/Normative-Patch-0.1.md` | Authority + summary of closed blockers |

## Agent Start Protocol

```text
STEP 0  Repository Analysis
STEP 1  Dependency Audit
STEP 2  Normative Cross-Check
STEP 3  Blocker Report

No implementation until STEP 3 is complete and blockers are resolved.
Physics Conformance Suite must be green before any further implementation.
```
