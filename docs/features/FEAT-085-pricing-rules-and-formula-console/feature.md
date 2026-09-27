---
id: FEAT-085
title: Pricing rules and formula console
type: domain-feature
owner: DOM-COM
runtime: SRV-001
status: approved
delivery: building
legacy: []
relations:
  depends_on: [FR-075-001]
  decided_by: [ADR-077]
---

# FEAT-085 — Pricing rules and formula console

## Summary

Lets a Business OWNER author versioned, typed pricing formulas and variables, preview
exact satang results, compare revisions, approve immutable effective-dated rule sets
and revoke them without rewriting prior calculations. One Commerce evaluator serves
both console previews and authorized runtime callers (e.g. SmartGift's quote
engine); persisted results pin rule/input/evaluator lineage. Customer-safe approved
sell-side records may enter Knowledge only through the existing pre-Stage-1 admission
contract — never by writing the substrate or exposing cost/margin.

## Scope

**In:** `PricingRuleSet` draft authoring/approval/revocation/expiry; bounded formula
expressions (typed variables, allowed functions, acyclic dependency graph — never
`eval`); deterministic evaluation with exact satang arithmetic; pinned calculation
lineage; scoped, allowlisted sell-side Knowledge admission for approved computed
prices.

**Out:** Procurement cost intake; ledger-cost changes; the full Quote lifecycle; LINE
sending; GKS calculating or calling into Commerce pricing (explicitly rejected
direction, ADR-077 D5); production activation/live ingestion/service deploy.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-COM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-085-001](requirements/FR-085-001-versioned-immutable-once-approved-pricing-rule-sets.md) | Versioned, immutable-once-approved pricing rule sets | — |
| [FR-085-002](requirements/FR-085-002-deterministic-preview-and-persisted-calculation-lineage.md) | Deterministic preview and persisted calculation lineage | — |
| [FR-085-003](requirements/FR-085-003-scoped-allowlisted-sell-side-knowledge-admission.md) | Scoped, allowlisted sell-side Knowledge admission | — |
| [NFR-085-001](requirements/NFR-085-001-formula-sandboxing.md) | Formula sandboxing | — |
| [NFR-085-002](requirements/NFR-085-002-tenant-business-isolation-audit-concurrency.md) | Tenant/Business isolation, audit, concurrency | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
