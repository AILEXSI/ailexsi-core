# AILEXSI Specification System

**Status:** Normative  
**Purpose:** Single source of truth for the First Artificial Cortex

## Normative Priority

```text
1. ACS
2. AKP
3. AAS
4. NORMATIVE PATCHES (historical only)
5. ABS
6. AUDIT
7. AMBC
8. BUILD MANIFEST
```

Higher overrides lower. Canonical documents are the single source of truth.

## Absolute Rules for Coding Agents

- Specifications, not suggestions.
- Do not invent missing formulas, contracts, or architecture.
- Undefined normative behavior is a BLOCKER.
- Canonical field names: camelCase (AAS-Buch2).
- Physics never infers Urgency, Working Set, or clusters; never calls providers.
- same idempotencyKey + identical payload → original result, no new event.
- same idempotencyKey + different payload → integrity violation.
- No historical-reference language ("as previously defined", "as prior") in normative docs.

## Document Index (must match file headers)

| Document | Path | Version |
|----------|------|--------|
| ACS | `ACS/ACS-0.1.md` | 0.1.1 |
| AKP Core | `AKP/AKP-0.1.md` | 0.1.4 |
| AKP Graph/Retrieval | `AKP/AKP-0.2.md` | 0.2.5 |
| AKP Parameter Sets | `AKP/AKP-Parameter-Sets-0.1.md` | physics 0.1.4 / 0.2.5 |
| AKP Formula Registry | `AKP/AKP-Formula-Registry-0.1.md` | 0.1 |
| AKP Conformance Vectors | `AKP/AKP-Conformance-Vectors-0.1.md` | 0.1.3 |
| AAS Domains | `AAS/AAS-0.1.md` | 0.1.2 |
| AAS Models | `AAS/AAS-Buch2.md` | 0.3.4 |
| AAS Runtime | `AAS/AAS-Buch3.md` | 0.2.0 |
| AAS MVP | `AAS/AAS-Buch4.md` | 0.1.2 |
| ABS | `ABS/ABS-0.1.md` | 0.2.0 |
| AUDIT | `AUDIT/Open-Source-Audit-0.1.md` | 0.1 |
| AMBC | `AMBC/AMBC-0.1.md` | 0.1.1 |
| Build Manifest | `BUILD/Build-Manifest-0.1.md` | 0.2 |

## Agent Start Protocol

```text
STEP 0  Repository Analysis
STEP 1  Dependency Audit
STEP 2  Normative Cross-Check
STEP 3  Blocker Report

No implementation until STEP 3 is complete and blockers are resolved.
Physics Conformance Suite (AMBC Phase 04) must be green before any further implementation.
```
