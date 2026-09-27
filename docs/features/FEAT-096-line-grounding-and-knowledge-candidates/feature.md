---
id: FEAT-096
title: LINE grounding and knowledge candidates
type: cross-domain-feature
owner: DOM-KNW            # DOM-KNW over DOM-LOA: two of four parts (P02, P03) write and own the
                           # corpus-entering data (KnowledgeCandidate, the gap report) and the Zero-PII
                           # gate that governs it; LOA's two parts (P01, P04) each own only a thin
                           # config column / description composer that hands off to knowledge's existing
                           # admission and query contracts. The behavior a reader would call "grounding"
                           # is knowledge's corpus and its rules, not LOA's account row.
runtime: SRV-001
participants:
  - domain: DOM-LOA
    part: FEAT-096-P01
    role: "LINE answer grounding mode"
  - domain: DOM-KNW
    part: FEAT-096-P02
    role: "Knowledge candidate lifecycle"
  - domain: DOM-KNW
    part: FEAT-096-P03
    role: "Knowledge gap report"
  - domain: DOM-LOA
    part: FEAT-096-P04
    role: "LINE Studio description admission"
status: proposed
delivery: implemented      # code for all four FRs is merged into origin/main (verified against this
                           # worktree's HEAD, not the legacy doc snapshot — see Open issues); no evidence
                           # found of a production switch, so not `live`.
legacy: [FEAT-038, FR-235, FR-236, FR-237, FR-238]
relations:
  decided_by: [ADR-071]
---

# FEAT-096 — LINE grounding and knowledge candidates

## Summary

A LINE OA account can answer a customer's question from the Business's own published knowledge
corpus instead of (or before falling back to) its curated business-knowledge table, with every
retrieval hop traced and never a model call when no evidence is found. What the business learns
from those LINE conversations can feed back into that same corpus only as a reviewed,
locator-only question-and-answer pair — never a raw transcript — that a Business OWNER or LINE OA
publisher must approve. Questions nobody could answer are aggregated into a per-Business gap
report so the business sees where its knowledge is missing, and a LINE OA Studio publisher action
(rich menu, LIFF app, bot profile) can itself become a knowledge source, described only by its
human-readable copy.

## Scope

**In:**
- A publisher-configurable per-account grounding mode (`BUSINESS_KNOWLEDGE`, `GKS_CORPUS`,
  `GKS_THEN_BUSINESS_KNOWLEDGE`) and the mode-gated, budgeted, traced read it selects.
- Drafting, editing and deciding a `KnowledgeCandidate` from a consent-GRANTED LINE conversation,
  and admitting an approved one as one immutable TEXT source.
- The per-Business gap report over unanswered (`NO_EVIDENCE`) questions.
- Admitting a published rich menu's / LIFF app's / bot profile's human-readable copy as a TEXT
  source, and withdrawing it on unpublish.

**Out:**
- Raw transcript or MSP episode admission into the corpus (refused explicitly, ADR-071 D6).
- Automatic promotion of anything into the corpus; a Tier 1 call to `gks_knowledge_promote`.
- The corpus pipeline itself (ingestion stages, `queryKnowledgeCorpus`, GKS/GenesisBlockDB
  internals) — this feature is a consumer (the grounding read) and a source-admission caller
  (candidates, studio descriptions) of that pipeline, not its owner.
- The MSP session/memory tiers this feature composes alongside (ADR-041, FR-095-012, FR-095-013) — referenced
  only as a contract this feature shares one prompt-wide budget with.
- The SmartGift production switch itself and the second-Business routing decision (ADR-071 D5;
  legacy ADR-069, ADR-045 — not converted by this group).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-001 |

<!-- Cross-domain: participants -->

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-096-P01 | LINE answer grounding mode | DOM-LOA | SRV-001 | FR-096-001 |
| FEAT-096-P02 | Knowledge candidate lifecycle | DOM-KNW | SRV-001 | FR-096-002 |
| FEAT-096-P03 | Knowledge gap report | DOM-KNW | SRV-001 | FR-096-003 |
| FEAT-096-P04 | LINE Studio description admission | DOM-LOA | SRV-001 | FR-096-004 |

Not a formal part: the **agent** lane (`apps/server/src/modules/agent/`) composes the mode-gated
reader, the evidence verifier and the per-turn trace for P01, and pre-fetches/composes knowledge
evidence alongside MSP slices for P02's downstream read — but it owns no data this feature adds and
writes no new model; it consumes DOM-KNW's `knowledge.query` port and DOM-LOA's account row exactly
as STD-001 R4 describes a domain that "only reads through another domain's public contract."
DOM-CRM and DOM-PRJ participate the same way: CRM exposes a narrow, read-only consent projection
(`conversation-consent-reader.js`) for P02 and gains no writer here; PRJ's `business` module owns
the separate `Business.knowledgeCandidatesEnabled` per-Business toggle that gates P02's drafting
(see Design and Open issues) — narrow enough, and with no value of its own apart from P02, that it
is documented as a dependency of P02 rather than a fifth part.

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-096-001](requirements/FR-096-001-publisher-configured-grounding-mode-selects-the-evidence.md) | Publisher-configured grounding mode selects the evidence read | FEAT-096-P01 |
| [FR-096-002](requirements/FR-096-002-line-faq-knowledge-candidates-enter-the-corpus.md) | LINE FAQ knowledge candidates enter the corpus only as reviewed, locator-only Q/A | FEAT-096-P02 |
| [FR-096-003](requirements/FR-096-003-unanswered-line-questions-are-reported-as-a.md) | Unanswered LINE questions are reported as a per-Business knowledge gap, never entering the corpus | FEAT-096-P03 |
| [FR-096-004](requirements/FR-096-004-published-studio-copy-becomes-a-withdrawable-knowledge.md) | Published Studio copy becomes a withdrawable knowledge source | FEAT-096-P04 |
| [NFR-096-001](requirements/NFR-096-001-bounded-configurable-retrieval-budget-for-the-gks.md) | Bounded, configurable retrieval budget for the GKS corpus hop | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Appendix — Decision record

This cross-domain feature's decision was previously embedded here as "legacy:ADR-090" — not
a valid ADR scope (`X` is the cross-domain feature namespace, not a domain code,
STD-002 R1). It is now `ADR-071` on the feature owner's own decisions.md:
[`docs/domains/knowledge/decisions.md`](../../domains/knowledge/decisions.md).
See `registry/crosswalk/X-006.csv` for the legacy `ADR-071` → `ADR-071` mapping.

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
