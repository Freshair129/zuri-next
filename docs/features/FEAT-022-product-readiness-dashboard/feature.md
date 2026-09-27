---
id: FEAT-022
title: Product readiness dashboard
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-124]
relations:
  depends_on: [FR-024-003]
  decided_by: []
---

# FEAT-022 — Product readiness dashboard

## Summary

A read-only Platform page (`/platform/product-readiness`, with a per-domain drilldown) that answers
four questions separately instead of one green number: how much evidence-backed implementation exists,
which requirements are verified, whether a complete feature is ready to use, and what a person can use it
for. It renders a committed, generated projection of the product's own requirement/feature graph and
nothing else.

## Scope

**In:** summary KPIs (Domains, Features, Ready, Progress, Verified requirements, Open gaps); per-domain
drilldown; readiness vs progress distinction; methodology disclosure; server-side authorization before
render.
**Out:** any database model, runtime write, scheduled poll or external API; producing the projection
(done by the documentation indexer at build time).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-022-001](requirements/FR-022-001-readiness-is-not-progress.md) | Readiness is not progress | — |
| [FR-022-002](requirements/FR-022-002-complete-projection.md) | Complete projection | — |
| [FR-022-003](requirements/FR-022-003-server-side-access-decision.md) | Server-side access decision | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
