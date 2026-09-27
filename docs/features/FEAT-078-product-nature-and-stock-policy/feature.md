---
id: FEAT-078
title: Product nature and stock policy
type: domain-feature
owner: DOM-INV
runtime: SRV-001
status: approved
delivery: implemented
legacy: []
relations:
  depends_on: []
  decided_by: []
---

# FEAT-078 — Product nature and stock policy

## Summary

Declares the accounting distinction between a counted good, an uncounted good and a
service — TRACKED / UNTRACKED / SERVICE — and makes it fail closed everywhere stock
is touched: the ledger refuses a service by its own code, and a Procurement goods
receipt naming a service is refused too, because a service is performed, not
delivered. This is a single, standalone requirement that predates and is later
subsumed by FEAT-080's ADR-073 governance (nature moves to the master, inherited
by every SKU) — it stands on its own as the foundational distinction FEAT-080
builds on.

## Scope

**In:** the `stockPolicy` TRACKED/UNTRACKED/SERVICE vocabulary on `Product`; the
`INVENTORY_PRODUCT_UNTRACKED` and `INVENTORY_PRODUCT_IS_A_SERVICE` refusals;
Procurement's `PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE` refusal (cross-domain
consequence, not owned here); the catalogue form narrowing to the chosen nature.
**Out:** nature declared at the master (superseded/extended by FEAT-080's
FR-080-001); variant identity, identifiers, lifecycle (FEAT-080).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INV |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-078-001](requirements/FR-078-001-tracked-untracked-service-as-an-accounting-distinction.md) | TRACKED / UNTRACKED / SERVICE as an accounting distinction | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
