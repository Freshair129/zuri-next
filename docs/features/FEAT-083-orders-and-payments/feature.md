---
id: FEAT-083
title: Orders and payments
type: domain-feature
owner: DOM-COM
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-023]
relations:
  depends_on: [API-194, FR-024-003, FR-003-009]
  decided_by: [ADR-076]
---

# FEAT-083 — Orders and payments

## Summary

Records what a Business sold — a `SalesOrder` with priced, discounted lines that may
name an Inventory SKU, attributed to a Conversation (CHAT), a walk-in or an online
sale — and how the money settled: `Payment` rows a second hat verifies before they
count, with revenue counted only from verified money, by origin and day. Fulfilment
issues counted stock through Inventory's own contract.

## Scope

**In:** sales order CRUD/status machine; line pricing/discount/quantity; payment
record/verify/reject; computed subtotal/total/paid/balance/payment state; revenue
read model by origin and day; Inventory fulfilment call on COMPLETE.

**Out:** the offer/price catalogue (tiers, segments — deferred to a future Commerce
FR); billing documents and POS (FEAT-084); pricing-rule engine (FEAT-085);
store credit; an Ad model/ROAS attribution; serial-tracked fulfilment (a sale cannot
pick serials — refused, not supported).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-COM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-083-001](requirements/FR-083-001-sales-orders-with-priced-lines-and-status.md) | Sales orders with priced lines and status machine | — |
| [FR-083-002](requirements/FR-083-002-fulfilment-issues-counted-stock-through-inventorys-contract.md) | Fulfilment issues counted stock through Inventory's contract | — |
| [FR-083-003](requirements/FR-083-003-payment-recording-second-hat-verification-and-computed.md) | Payment recording, second-hat verification and computed order state | — |
| [FR-083-004](requirements/FR-083-004-revenue-read-model-by-origin-and-day.md) | Revenue read model by origin and day | — |
| [NFR-083-001](requirements/NFR-083-001-two-ladder-authority-for-verified-money.md) | Two-ladder authority for verified money | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
