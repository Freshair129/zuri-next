---
id: FEAT-084
title: POS billing and checkout
type: domain-feature
owner: DOM-COM
runtime: SRV-001
status: approved
delivery: building
legacy: []
relations:
  depends_on: [API-194, API-199]
  decided_by: [ADR-076]
---

# FEAT-084 — POS billing and checkout

## Summary

Lets a cashier ring up a walk-in sale in one atomic transaction — order, pending
payment and tracked-stock issue together, with cash change computed in integer satang
— and lets a Business owner configure billing identity/tax/PromptPay policy and issue
immutable invoice/receipt/tax-document snapshots against a completed sale, previewed
before they are ever numbered. Ships from the same 2026-09-10 owner-approved proposal
(`docs/change-requests/ZAI-PROPOSAL-COMMERCE-BILLING-POS-20260910.md`) as one slice.

## Scope

**In:** atomic POS checkout (order + pending payment + stock issue); POS catalogue
read; billing issuer/tax/PromptPay configuration; document preview (non-persistent);
document issuance (immutable snapshot, idempotency key, per-Business/type/year
sequence); THB-only, integer-satang VAT.

**Out:** void/correction routes; a persistent terminal registry or default station;
CRM writes; a live payment-provider call; non-THB currency/FX; production
activation of the shared migration.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-COM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-084-001](requirements/FR-084-001-atomic-pos-checkout.md) | Atomic POS checkout | — |
| [FR-084-002](requirements/FR-084-002-pos-catalogue-read.md) | POS catalogue read | — |
| [FR-084-003](requirements/FR-084-003-billing-issuer-tax-promptpay-configuration.md) | Billing issuer/tax/PromptPay configuration | — |
| [FR-084-004](requirements/FR-084-004-non-persistent-document-preview.md) | Non-persistent document preview | — |
| [FR-084-005](requirements/FR-084-005-idempotent-immutable-document-issuance.md) | Idempotent immutable document issuance | — |
| [NFR-084-001](requirements/NFR-084-001-document-level-rounding-rule.md) | Document-level rounding rule | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
