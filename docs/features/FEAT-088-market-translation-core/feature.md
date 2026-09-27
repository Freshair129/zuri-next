---
id: FEAT-088
title: Market translation core
type: domain-feature
owner: DOM-MKI
runtime: SRV-007
status: approved
delivery: implemented
legacy: [FR-092]
relations:
  depends_on: []
  decided_by: [ADR-081, ADR-082]
---

# FEAT-088 — Market translation core

## Summary

Turns one eligible, Integration-owned `RawExternalRecord` into a provider-neutral,
Market-owned `MarketObservation` with full source lineage, and exposes it to the
console: a Business viewer reads a translated feed, and a Business owner can trigger an
on-demand translation run over the Business's untranslated backlog. Used by the
`/market` console page (`MarketDashboard.jsx`) and, downstream, by Procurement,
Marketing and Business Home as read-only consumers of translated market facts.

## Scope

**In:** loading one eligible raw record through a trusted scoped read port; translating
it into a `MarketObservation` draft via an injected, provider-neutral extractor;
resolving canonical Product identity via an injected Knowledge/GKS port with a truthful
`UNRESOLVED` fallback; atomic idempotent persistence keyed by a deterministic lineage
hash; a Business-scoped read feed; an owner-triggered translation run over a backlog.

**Out:** raw acquisition/ingestion (Integration's `FR-053-001, FR-053-002, FR-053-003, FR-053-004`); canonical Product/Category
authority (Knowledge/GKS); `ExternalOffer`, `PriceObservation`, `SupplierCandidate`,
`WatchRule`, competitor/demand/category signal models (later, separately chartered
requirements); wiring the marketplace/retail acquisition adapters to a live scraper or
scheduled job (deliberately deferred pending a source-specific legal/ToS review); the
extracted-service cutover itself (`MARKET_EXECUTOR=service` — ADR-082 M3/M4/Cutover,
not authorized by this feature).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-MKI |
| Runtime owner | SRV-007 (in-process module today; extracted service standing by behind `MARKET_EXECUTOR`, default `legacy` — see ADR-082) |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-088-001](requirements/FR-088-001-translate-one-raw-record-into-a-provider.md) | Translate one raw record into a provider-neutral observation | — |
| [FR-088-002](requirements/FR-088-002-business-scoped-observation-feed.md) | Business-scoped observation feed | — |
| [FR-088-003](requirements/FR-088-003-owner-triggered-translation-run-over-a-businesss.md) | Owner-triggered translation run over a Business's backlog | — |
| [NFR-088-001](requirements/NFR-088-001-fail-closed-provenance-scope.md) | Fail-closed provenance scope | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
