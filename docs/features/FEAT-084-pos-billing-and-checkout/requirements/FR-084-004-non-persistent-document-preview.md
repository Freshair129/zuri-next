---
id: FR-084-004
title: "Non-persistent document preview"
delivery: building
legacy: [FR-186 (split 2/3 — preview)]
relations:
  specified_by: [SDD-084]
  decided_by: [ADR-076]
---

# FR-084-004 — Non-persistent document preview

The system SHALL let an authorized viewer preview a `CommerceDocument`
(INVOICE/RECEIPT/TAX_INVOICE/ABB_TAX_INVOICE) for a Business/order/active Branch
without persisting a number, issued timestamp or audit event, validating scope,
configured issuer/tax/recipient policy and buyer `ISSUANCE_INPUT`.

## Acceptance criteria

- AC-084-004-01 — Given a valid order and configured policy, when preview is requested twice in a row, then no sequence number is consumed by either call and no `CommerceDocument` row exists after either.
- AC-084-004-02 — Given an unpaid order, when a RECEIPT is previewed, then the preview may show unpaid/pending state but never claims money was received.

## Implementation

- `apps/server/src/app/api/commerce/billing/documents/preview/route.js`

## Verification

- TC-084-002 — Billing config, preview non-persistence, issuance idempotency (see [verification.md](../verification.md))
