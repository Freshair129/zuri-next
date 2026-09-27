---
id: FEAT-073
title: Knowledge admission, corpus publication & console
type: domain-feature
owner: DOM-KNW
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-173, FR-254]
relations:
  depends_on: [FEAT-072, FR-067-001]
  decided_by: [ADR-067, ADR-068]
---

# FEAT-073 — Knowledge admission, corpus publication & console

## Summary

The one authorized entry surface for a knowledge source (Text/Markdown or an existing
readable FileAsset) and the read surfaces that let a Business viewer see what it
admitted, browse execution evidence, and query a published corpus with resolvable
citations. Admission, query and console all converge on the same admission/corpus
services so that no second write path into a corpus ever exists. Owner-facing surface
in the web console (Business owner Files browser, `/knowledge/documents`,
`/knowledge/console`).

## Scope

**In:** admitting an immutable Text/Markdown source or an existing readable FileAsset
under a Business + optional live Project; durable queued ingestion with idempotency on
request/key; publishing verified per-source Stage 17 receipts into an immutable,
append-only corpus generation manifest; querying one pinned corpus manifest with
reciprocal-rank fusion across per-snapshot MSP-relayed results; resolving citations
against current ACL/revocation; withdrawing a source; the knowledge base console
(source/version library, FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 run evidence with stage-by-stage detail, corpus
generations, generation-bound cited search, citation-to-artifact resolution).

**Out:** the seventeen-stage pipeline execution itself (`FEAT-072`). The SmartGift
structured-record adapter's own identity/Zero-PII rules (`FEAT-075`, though it
enters through this same admission queue). The Knowledge (GKS) navigation slot and
data pipeline map (`FEAT-076`) — the console lives inside that same slot but is a
distinct page. LINE-originated knowledge candidates (`FR-096-002`, out of this
conversion's FR set).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-073-001](requirements/FR-073-001-knowledge-source-admission-and-corpus-publication.md) | Knowledge source admission and corpus publication | — |
| [FR-073-002](requirements/FR-073-002-knowledge-base-console.md) | Knowledge base console | — |
| [NFR-073-001](requirements/NFR-073-001-authorization-precedes-disclosure.md) | Authorization precedes disclosure | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
