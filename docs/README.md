# AILEXSI Specification System

**Status:** Normative  
**Purpose:** Single source of truth for the First Artificial Cortex

## Normative Priority

```text
1. ACS
2. AKP
3. AAS
4. NORMATIVE PATCHES (historical only; Patch 0.3 Anti-Deletion is binding governance)
5. ABS
6. AUDIT (incl. Blocker Ledger + Surface Baseline)
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
- **Anti-Deletion:** never close a blocker by deleting/shortening the requirement.
- **Closure types only:** COMPLETE | DEFER | SUPERSEDE (see Blocker Ledger).
- **Surface Gate:** `node scripts/normative-surface-check.mjs` must PASS before GREEN.
- **REGRESSION_BY_DELETION** if Normative Surface falls without DEFER.

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
| AUDIT Open Source | `AUDIT/Open-Source-Audit-0.1.md` | 0.1 |
| AUDIT Blocker Ledger | `AUDIT/Blocker-Ledger.md` | 0.1 |
| AUDIT Surface Baseline | `AUDIT/Normative-Surface-Baseline-0.1.md` | 0.1 |
| DEFER rules | `DEFER/README.md` | 0.1 |
| AMBC | `AMBC/AMBC-0.1.md` | 0.1.2 |
| Build Manifest | `BUILD/Build-Manifest-0.1.md` | 0.2.1 |
| Patch 0.3 Anti-Deletion | `PATCHES/Normative-Patch-0.3-Anti-Deletion.md` | 0.3 |
| Surface Check Script | `scripts/normative-surface-check.mjs` | 0.1 |

## Agent Start Protocol

```text
STEP 0  Repository Analysis
STEP 1  Dependency Audit
STEP 2  Normative Cross-Check
STEP 3  Blocker Report → update docs/AUDIT/Blocker-Ledger.md (append-only)
STEP 3b node scripts/normative-surface-check.mjs   # must PASS

No implementation until STEP 3b PASSes and blockers are resolved honestly.
Physics Conformance Suite (AMBC Phase 04) must be green before any further implementation.

BLOCKERS = 0 requires:
  - Ledger rules satisfied
  - Surface Check PASS
  - No closure by deletion
```
