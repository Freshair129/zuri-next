---
id: SDD-084
title: "POS billing and checkout — design"
---

# SDD-084 — POS billing and checkout design

- **Components:**
  - `CMP-254` — `application/pos-cashier-service.js` +
    `domain/billing.js`: atomic order/payment/stock composition.
  - `CMP-251` — `application/billing-invoice-service.js` +
    `domain/billing.js`: profile config, preview, issue, immutable document reads.
- **Data owned:** `BusinessBillingProfile`, `CommerceDocument`,
  `CommerceDocumentSequence`; `SalesOrder`/`Payment` rows created by checkout are
  owned by FEAT-083's components.
- **Contracts exposed:** `API-232`, `API-231`,
  `API-225`, `API-227`,
  `API-226`, `API-228`.
- **Contracts consumed:** `API-194`, `API-199`;
  Identity's `LegalEntity`/Branch read.
- **Main sequence** (checkout → later billing):
  1. Cashier `POST /api/commerce/pos/checkout`: validate Branch/location/lines/cash,
     one transaction creates order + PENDING payment + stock issue, returns change.
  2. Verifier later verifies the payment through `API-230` (FEAT-083).
  3. `POST /api/commerce/billing/documents/preview` shows a non-persistent snapshot.
  4. `POST /api/commerce/billing/documents` with an idempotency key issues the
     immutable, sequenced document.
- **Failure modes:** any checkout-step failure rolls back the whole transaction;
  reused idempotency key with changed input → 409; missing/unverified billing policy
  → refused, not defaulted; RECEIPT under-paid → refused.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-084-001 | `apps/server/src/modules/commerce/application/pos-cashier-service.js`, `apps/server/src/app/api/commerce/pos/checkout/route.js` |
| FR-084-002 | `apps/server/src/app/api/commerce/pos/catalogue/route.js` |
| FR-084-003 | `apps/server/src/modules/commerce/application/billing-invoice-service.js`, `apps/server/src/app/api/commerce/billing/config/route.js` |
| FR-084-004 | `apps/server/src/app/api/commerce/billing/documents/preview/route.js` |
| FR-084-005 | `apps/server/src/app/api/commerce/billing/documents/route.js`, `.../documents/[id]/route.js` |
