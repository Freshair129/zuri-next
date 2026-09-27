---
id: SDD-083
title: "Orders and payments — design"
---

# SDD-083 — Orders and payments design

- **Components:**
  - `CMP-252` — `application/sales-order-service.js` + `domain/commerce.js`:
    the only writer of `SalesOrder`/`SalesOrderLine`; status machine, totals.
  - `CMP-253` — `application/payment-service.js`: the only writer of
    `Payment`; record/verify/reject.
  - `CMP-260` — `application/revenue-read-model.js`: read-only aggregation.
  - `CMP-250` — `application/commerce-authority.js`: view/order/verify
    ladder, FR-072-style 404.
- **Data owned:** `SalesOrder`, `SalesOrderLine`, `Payment`.
- **Contracts exposed:** `API-229`, `API-230`, `API-237`.
- **Contracts consumed:** `API-194` (fulfilment stock issue).
- **Main sequence** (sell → confirm → complete → verify):
  1. `POST /api/commerce/orders` creates DRAFT with lines.
  2. `PATCH … {action:'CONFIRM'}` locks lines.
  3. `PATCH … {action:'COMPLETE'}` issues counted stock via `appendMovement`
     (FEFO, `ORDER:<code>` reference), moves to COMPLETED.
  4. `POST /api/commerce/orders/[id]/payments` records a PENDING payment.
  5. `PATCH /api/commerce/payments/[id]` (verifier role) VERIFIES or REJECTS.
  6. `GET /api/commerce/revenue` aggregates VERIFIED payments net of VERIFIED
     refunds by origin/day.
- **Failure modes:** stock shortage refuses whole COMPLETE with per-SKU detail;
  SERIAL-tracked line refuses COMPLETE outright; missing Inventory write authority
  refuses COMPLETE; duplicate `bankReference` refuses payment recording; acting on a
  non-PENDING payment refused; payment on a CANCELLED order refused.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-083-001 | `apps/server/src/modules/commerce/application/sales-order-service.js`, `domain/commerce.js`, `apps/server/src/app/api/commerce/orders/route.js`, `.../orders/[id]/route.js` |
| FR-083-002 | `apps/server/src/modules/commerce/application/sales-order-service.js` (COMPLETE action, Inventory call) |
| FR-083-003 | `apps/server/src/modules/commerce/application/payment-service.js`, `apps/server/src/app/api/commerce/orders/[id]/payments/route.js`, `.../payments/[id]/route.js` |
| FR-083-004 | `apps/server/src/modules/commerce/application/revenue-read-model.js`, `apps/server/src/app/api/commerce/revenue/route.js` |
