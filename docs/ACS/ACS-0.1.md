# AILEXSI Core Specification (ACS)

**Version:** 0.1.1  
**Status:** Normative  
**Scope:** Philosophy, Mission, Definition, Cognitive Laws, Principle Zero

---

## Buch 0 – Mathematical Foundation (Principle)

Every quantitative property of a Memory Cell must be reducible to a reproducible, deterministic (or clearly documented stochastic) formula.  
No score may arise “somehow”.

The Physics Engine knows:
- no LLMs
- no databases
- no GUIs
- no network calls

It receives only numbers and graphs and returns only numbers and graphs.

---

## Buch 1 – Die Grundlagen

### 1.1 Definition

AILEXSI is a **Personal Knowledge Operating System (PKOS)**.  
It organizes information in a living semantic memory, recognizes relationships, documents developments, and supports the human in reflection and decision-making.

### 1.2 Ziel

AILEXSI does not primarily answer questions.  
It helps the human:
- remember themselves
- recognize connections
- make better decisions
- build knowledge long-term
- foster creativity

### 1.3 Was AILEXSI nicht ist

- kein Chatbot
- kein Obsidian-Klon
- kein Notion-Klon
- kein Dokumentenspeicher
- keine Suchmaschine
- keine AGI

AILEXSI is a new category: **digitale Kognition** (the processes with which humans structure, reflect on, and further develop knowledge over years) — without claim to consciousness.

---

## Principle Zero (Architekturgrundsatz)

Before any implementation check:

1. Does a mature open-source building block already exist?
2. Is it only configuration / orchestration?
3. Is it genuine AILEXSI innovation?

Only if the answer to point 3 is **Yes** is own development time invested.  
Everything else is imported, configured, or orchestrated.

---

## Cognitive Laws (normativ)

These laws are **non-negotiable**. Every implementation must enforce them.

**Law 1 – Source Integrity / Provenance**  
Every Memory Cell must possess a traceable Provenance.  
Factual claims additionally require Evidence.  
Allowed origins: user, conversation, document, web, sensor, event, system, agent, import.

**Law 2 – Immutability of History**  
Every change to a Memory Cell produces a new version. The history is append-only.

**Law 3 – Reflection Isolation**  
Reflection and Dream Mode may never alter original data of a Memory Cell. They only produce new Cells, Relations, or Hypotheses.

**Law 4 – Dream Mode Constraint**  
Dream Mode produces exclusively Hypotheses / Candidates.  
Canonical representation:
- `DreamCandidate.status` ∈ {generated, reviewed, accepted, rejected}
- When accepted as knowledge, a new Memory Cell may be created with `lifecycle.state = "hypothesis"`
- Never `lifecycle.state = "active"` without explicit human or authorized promotion
- `DreamCandidate ≠ Fact`

**Law 5 – Trust Separation**  
Trust scores may never be calculated by an LLM alone. LLM suggestions must be calibrated by Evidence, History, and manual/heuristic rules.

**Law 6 – Explainability**  
Every automatic decision (prioritization, archival, relation strength, Dream suggestion) must be able to deliver an explainable justification.

**Law 7 – Time as Dimension**  
Time is not a simple timestamp column. Every Memory Cell possesses at least the six temporal fields.

**Canonical field names (AAS / implementation):**
```text
createdAt, observedAt, validFrom, validTo, confirmedAt, deprecatedAt
```

ACS prose may use snake_case for readability; the **canonical contract is camelCase** as defined in AAS-Buch2 TemporalMetadata. Implementations MUST use the AAS field names.

Knowledge is time-dependent.

---

## First Milestone

**Der erste künstliche Cortex**

Once Cortex Memory + Cortex Identity + Cortex History + Memory Cell 2.0 + the daily cycle (including Dream Mode) run stably and support interchangeable embeddings + LLM backends, the first artificial Cortex is considered reached.

---

## Notes

This document is the constitutional layer.  
Lower documents (AKP, AAS, ABS, AMBC) may not contradict these laws.
