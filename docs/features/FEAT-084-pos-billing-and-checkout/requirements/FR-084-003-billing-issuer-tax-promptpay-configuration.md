---
id: FR-084-003
title: "Billing issuer/tax/PromptPay configuration"
delivery: building
legacy: [FR-186 (split 1/3 — issuer/tax/PromptPay configuration)]
relations:
  specified_by: [SDD-084]
  decided_by: [ADR-076]
---

# FR-084-003 — Billing issuer/tax/PromptPay configuration

The system SHALL let a Business OWNER configure `BusinessBillingProfile` (issuer
identity read from the Business's `LegalEntity`, versioned VAT policy, PromptPay
recipient, non-VAT and walk-in document policy) through a settings flow; missing,
inactive or unverified values SHALL remain explicitly unavailable rather than
defaulted.

## Acceptance criteria

- AC-084-003-01 — Given no active, verified VAT policy configured, when a VAT document issue is attempted, then it is refused as unavailable, never silently defaulted to a zero-rate or unconfigured value.
- AC-084-003-02 — Given `nonVatDocumentPolicy != ALLOW_INVOICE_RECEIPT`, when a non-VAT invoice/receipt is requested, then it is refused.

## Implementation

- `apps/server/src/modules/commerce/application/billing-invoice-service.js`, `apps/server/src/app/api/commerce/billing/config/route.js`

## Verification

- TC-084-002 — Billing config, preview non-persistence, issuance idempotency (see [verification.md](../verification.md))
