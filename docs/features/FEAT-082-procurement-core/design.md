---
id: SDD-082
title: "Procurement core — suppliers, purchase orders, goods receipts — design"
---

# SDD-082 — Procurement core — suppliers, purchase orders, goods receipts design

- **Components:**
  - `CMP-249` — `application/supplier-service.js`: the only writer
    of `Supplier` (create, list, get, versioned UPDATE/ARCHIVE action).
  - `CMP-248` — `application/purchase-order-service.js`: the
    only writer of `PurchaseOrder`/`PurchaseOrderLine`; DTO shaping incl.
    computed totals/receipt state; versioned action dispatch
    (UPDATE/SEND/CLOSE/CANCEL).
  - `CMP-247` — `application/goods-receipt-service.js`: the
    only writer of `GoodsReceipt`/`GoodsReceiptLine`; plans and posts a
    receipt, calls Inventory's ledger contract, completes the order.
  - `CMP-245` — `application/procurement-authority.js`: the
    view/po/receipt authorization ladder and the FR-072-style 404 shape.
  - `CMP-246` — `domain/procurement.js`: pure calculators (money,
    totals, receipt state, status machine, code generation, receipt
    planning) — no I/O.
- **Data owned:** `Supplier`, `PurchaseOrder`, `PurchaseOrderLine`,
  `GoodsReceipt`, `GoodsReceiptLine` (all DOM-PRC). `SupplierCostSheet` /
  `SupplierCostLine` also live in this module's schema but are outside this
  feature's FRs (§9).
- **Contracts exposed:** none (Procurement exposes no contract another
  domain calls today; all `API-PRC-*` routes are console/HTTP client-facing,
  not domain-to-domain).
- **Contracts consumed:** `API-194` (post a stock movement
  for a counted receipt line), `API-199` (resolve a PO
  line's SKU when the line names one — used indirectly through Inventory's
  `Product` lookup in `resolveLines`).
- **Main sequence (PO create → send → receipt → close):**
  1. Buyer `POST /api/procurement/purchase-orders` → `createPurchaseOrder`
     validates the Supplier and any line `productId`, generates `PO-…` code,
     writes order + lines + one audit row, status DRAFT.
  2. Buyer `PATCH … {action:'SEND'}` → `applyPurchaseOrderAction` moves
     DRAFT→SENT, locks lines/supplier, bumps `version`, audits.
  3. Receiver `POST …/purchase-orders/[id]/receipts` → `postGoodsReceipt`:
     loads the order inside a transaction, checks SENT + receipt authority
     (+ Inventory authority if any line is counted, + the FR-032-002 self-verify
     guard), plans the receipt against outstanding quantities
     (`planReceipt`), creates the `GoodsReceipt`/lines, calls
     `appendMovement` per counted line (lot/expiry/serial handling), updates
     the order (RECEIVED if `plan.completesOrder`), writes 1–2 audit rows,
     returns receipt+order+posted lines.
  4. If lines remain outstanding and no more delivery is coming, buyer
     `PATCH … {action:'CLOSE', reason}` → SHORT_CLOSED.
- **Failure modes:**
  - Receipt posted against a non-SENT order → `409
    PURCHASE_ORDER_NOT_RECEIVABLE`.
  - Receipt quantity exceeds a line's outstanding amount → whole receipt
    refused, `409 PROCUREMENT_RECEIPT_EXCEEDS_ORDERED` with per-line detail.
  - Lot/expiry/serial data given for an uncounted or free-text line →
    `422 PROCUREMENT_RECEIPT_LINE_NOT_COUNTED`.
  - Receipt line names a `stockPolicy: SERVICE` product → `422
    PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE` (a service is performed, not
    received).
  - Counted line posted without Inventory write authority → `403
    PROCUREMENT_RECEIPT_REQUIRES_INVENTORY_AUTHORITY`, no ledger row, no
    receipt persisted (whole transaction rolls back).
  - Stale `version` on a PO action → `409 PURCHASE_ORDER_VERSION_CONFLICT`.
  - CANCEL after any receipt exists → `409
    PURCHASE_ORDER_HAS_RECEIPTS`.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-082-001 | `apps/server/src/modules/procurement/application/supplier-service.js`, `apps/server/src/modules/procurement/application/purchase-order-service.js`, `apps/server/src/modules/procurement/domain/procurement.js`, `apps/server/src/app/api/procurement/suppliers/route.js`, `apps/server/src/app/api/procurement/suppliers/[id]/route.js`, `apps/server/src/app/api/procurement/purchase-orders/route.js`, `apps/server/src/app/api/procurement/purchase-orders/[id]/route.js` |
| FR-082-002 | `apps/server/src/modules/procurement/application/goods-receipt-service.js`, `apps/server/src/app/api/procurement/purchase-orders/[id]/receipts/route.js`, `apps/server/src/app/api/procurement/receipts/route.js`, `apps/server/src/app/api/procurement/receipts/[id]/route.js` |
