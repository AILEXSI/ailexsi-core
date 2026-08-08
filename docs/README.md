# AILEXSI Specification System

**Status:** Normative

## Normative Priority
ACS → AKP → AAS → PATCHES → ABS → AUDIT → AMBC → BUILD MANIFEST

## Absolute Rules
- No invented formulas/contracts/architecture
- Undefined behavior = BLOCKER
- camelCase (AAS-Buch2)
- Physics never infers Urgency, Working Set, clusters; never calls providers
- idempotencyKey: identical payload → original result; different payload → integrity violation

## Document Index
| Document | Path | Version |
|----------|------|--------|
| ACS | ACS/ACS-0.1.md | 0.1.1 |
| AKP Core | AKP/AKP-0.1.md | 0.1.4 |
| AKP Graph/Retrieval | AKP/AKP-0.2.md | 0.2.5 |
| AKP Parameter Sets | AKP/AKP-Parameter-Sets-0.1.md | 0.1.4/0.2.5 |
| AKP Formula Registry | AKP/AKP-Formula-Registry-0.1.md | 0.1 |
| AKP Conformance Vectors | AKP/AKP-Conformance-Vectors-0.1.md | 0.1.3 |
| AAS Domains | AAS/AAS-0.1.md | 0.1.2 |
| AAS Models | AAS/AAS-Buch2.md | 0.3.4 |
| AAS Runtime | AAS/AAS-Buch3.md | 0.2.0 |
| AAS MVP | AAS/AAS-Buch4.md | 0.1.2 |
| ABS | ABS/ABS-0.1.md | 0.2.0 |
| AUDIT | AUDIT/Open-Source-Audit-0.1.md | 0.1 |
| AMBC | AMBC/AMBC-0.1.md | 0.1.1 |
| Build Manifest | BUILD/Build-Manifest-0.1.md | 0.2 |

## Agent Start Protocol
STEP 0–3 before implementation. Physics Conformance (AMBC Phase 04) HARD GATE.
