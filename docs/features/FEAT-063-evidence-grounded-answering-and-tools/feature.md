---
id: FEAT-063
title: Evidence-grounded answering and supply-chain tools
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: implemented
legacy: [FR-049, FR-132, FR-181]
relations:
  depends_on: [FR-074-002, FR-074-003, FR-079-002]
  decided_by: [ADR-060]
---

# FEAT-063 — Evidence-grounded answering and supply-chain tools

## Summary

How the agent turns a business question into a reply it can defend: classify
the question into a registered query, fetch a bounded evidence packet, ask
the configured model to answer strictly from that packet, verify the
candidate never invents a number or code the evidence does not contain, and
fall back to a deterministic, evidence-derived answer otherwise. Bundled
here too are the two ways this discipline is meant to extend to richer
tool calls on the LINE surface: a declared-only ladder-quotation tool and
the implemented (but currently unreachable — §9) six-tool SmartGift
supply-chain surface.

## Scope

**In:** `selectRegisteredQuery`/`answerBusinessQuestion`/`verifyCandidate`/
`deterministicFallback` (FR-063-001); the declared shape of a LINE
ladder-quotation read tool (FR-063-002); the six Gate E/F SmartGift
tools and their thin-adapter discipline (FR-063-003).
**Out:** the knowledge reader's own tenant-isolation guarantees
(FEAT-064); the Context Composer / grounding-mode selection layered on
top of this answer function by ADR-071/091 (declared, not built, per the
domain charter — read-only context for this pass).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-063-001](requirements/FR-063-001-evidence-grounded-answer.md) | Evidence-grounded answer | — |
| [FR-063-002](requirements/FR-063-002-line-ladder-quotation-tool-declared-only.md) | LINE ladder quotation tool (declared only) | — |
| [FR-063-003](requirements/FR-063-003-agent-supply-chain-tools-smartgift.md) | Agent supply-chain tools (SmartGift) | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
