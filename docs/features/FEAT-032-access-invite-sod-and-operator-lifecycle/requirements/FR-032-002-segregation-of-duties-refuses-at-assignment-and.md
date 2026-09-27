---
id: FR-032-002
title: "Segregation of duties refuses at assignment and at transaction"
delivery: implemented
legacy: [FR-196]
relations:
  specified_by: [SDD-032]
  decided_by: [ADR-025]
---

# FR-032-002 — Segregation of duties refuses at assignment and at transaction

`ROLE_CONFLICTS` SHALL declare `SALES_REP`/`PAYMENT_VERIFIER` and
`PROCUREMENT_BUYER`/`GOODS_RECEIVER`; `assignRoleBinding` SHALL refuse 409
`ROLE_CONFLICT` when the assignee already holds the conflicting half in the
same Tenant, unless a TENANT owner passes `sodOverride: { reason }`.
Independently, `applyPaymentAction` SHALL refuse 409
`PAYMENT_SELF_VERIFY_FORBIDDEN` when the verifier recorded the same payment
— **including a Business OWNER** — unless `selfVerifyAttested: true` is
passed and recorded in the audit payload; `postGoodsReceipt` SHALL apply the
identical shape against the purchase order's creator.

## Acceptance criteria

- AC-032-002-01 — Given a Person who already holds `PROCUREMENT_BUYER` in Tenant T, when they are assigned `GOODS_RECEIVER` in the same Tenant without an override, then the assignment refuses 409.
- AC-032-002-02 — Given a Business OWNER who recorded a payment, when they attempt to verify that same payment without `selfVerifyAttested`, then it refuses — the OWNER bypass that applies to every other check in that file does **not** apply here.
- AC-032-002-03 — Given the conflict is attempted across two separate assignment calls rather than one, when the second call runs, then it is still refused (cannot be assembled in stages).

## Implementation

- `apps/server/src/modules/identity/{rbac.js,rbac-service.js}`, `apps/server/src/modules/commerce/application/payment-service.js`, `apps/server/src/modules/procurement/application/goods-receipt-service.js`

## Verification

- TC-032-002 — Segregation of duties: assignment and transaction refusals (see [verification.md](../verification.md))
