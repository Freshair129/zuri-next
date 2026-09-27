---
id: FEAT-082
title: Procurement core — suppliers, purchase orders, goods receipts
type: domain-feature
owner: DOM-PRC
runtime: SRV-001
status: proposed
delivery: building
legacy: [FEAT-024]
relations:
  depends_on: [API-194, API-199]
  decided_by: [ADR-075]
---

# FEAT-082 — Procurement core — suppliers, purchase orders, goods receipts

## Summary

Lets a Business's buyer keep an approved supplier list with terms and lead
time, raise purchase orders with lines naming Inventory SKUs at the agreed
cost, and post goods receipts that record what a delivery actually contained
and put counted goods (lots, expiry, serials) into the Inventory stock
ledger. Used on the web console (`/procurement`, `/procurement/purchase-orders`,
`/procurement/receipts`) and its `/api/procurement/**` HTTP API.

## Scope

**In:** supplier CRUD/archive; purchase order create, update-while-draft,
send, short-close, cancel; line-by-line goods receipt posting against a sent
order with lot/expiry/serial capture for counted SKUs; computed totals and
receipt state; the Inventory ledger call for counted receipt lines.
**Out:** purchase requests and approvals, RFQs and supplier quotes, purchase
returns and credit notes, supplier invoices and payables, landed cost,
warehouse locations for a receipt, promoting a Market Intelligence
`SupplierCandidate` into a `Supplier`, and the supplier cost-sheet intake
routes (TASK-ZAI-053 — not FR-backed, see §9).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRC |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-082-001](requirements/FR-082-001-suppliers-and-purchase-orders.md) | Suppliers and purchase orders | — |
| [FR-082-002](requirements/FR-082-002-goods-receipts-post-counted-lines-into-the.md) | Goods receipts post counted lines into the Inventory ledger | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
