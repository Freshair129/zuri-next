---
id: FR-083-003
title: "Payment recording, second-hat verification and computed order state"
delivery: building
legacy: [FR-163, BR-002]
relations:
  specified_by: [SDD-083]
  decided_by: [ADR-076]

---

# FR-083-003 — Payment recording, second-hat verification and computed order state

The system SHALL let a Business OWNER or `SALES_REP` record a `Payment`
(PAYMENT or REFUND; method TRANSFER/CASH/QR/CARD/OTHER; exact `amountSatang`;
optional `bankReference` unique per Tenant as an attribute; optional slip as a
`FileAsset` of the same Business) as PENDING, and SHALL let a Business OWNER or
`PAYMENT_VERIFIER` — a role distinct from the recorder — VERIFY or REJECT it with a
reason; only a PENDING payment may be acted on. The order's paid amount, balance due
and payment state (UNPAID/PARTIAL/PAID/OVERPAID/REFUNDED) SHALL be derived only from
VERIFIED payments, never stored. A payment SHALL NOT be recorded against a CANCELLED
order; a refund SHALL NOT verify beyond what was verifiably paid.

## Acceptance criteria

- AC-083-003-01 — Given a PENDING payment equal to the order's total, when a `PAYMENT_VERIFIER` verifies it, then the order's derived payment state becomes PAID.
- AC-083-003-02 — Given a payment already VERIFIED, when any caller attempts to verify or reject it again, then it is refused (only PENDING is actionable).
- AC-083-003-03 — Given a CANCELLED order, when a new payment is recorded against it, then it is refused.
- AC-083-003-04 — Given a duplicate `bankReference` already used by another payment of the same Tenant, when a new payment is recorded with it, then it is refused (unique-as-attribute, BR-047).

## Implementation

- `apps/server/src/modules/commerce/application/payment-service.js`, `apps/server/src/app/api/commerce/orders/[id]/payments/route.js`, `.../payments/[id]/route.js`

## Verification

- TC-083-003 — Payment record/verify/reject and two-ladder authority (see [verification.md](../verification.md))
- TC-083-005 — Route wiring and calculators (unit) (see [verification.md](../verification.md))
- TC-083-006 — Console end-to-end order/payment flow (see [verification.md](../verification.md))
