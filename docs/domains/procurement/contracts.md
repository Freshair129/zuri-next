# Procurement — Contracts

UI page routes (`/procurement`, `/procurement/purchase-orders`,
`/procurement/receipts`) are console surfaces, not contracts, and are not
listed here (STD-001 R1 only requires API/EVT for externally callable
interfaces).

### API-223
Owner: DOM-PRC
Method+path: `GET /api/procurement/suppliers`
Purpose: List a Business's suppliers (ACTIVE by default; `includeArchived` to include archived).
Auth/scope: Business visibility + `procurement` domain (FR-024-003); `businessId` validated server-side.
Request: query `businessId`, `includeArchived?`.
Response: `[{ id, code, name, taxId, contactName, phone, email, address, paymentTerms, leadTimeDays, notes, status, version, purchaseOrders }]`.
Errors: `404` Business not found/not visible (FR-003-009).
Implements: FR-082-001
Legacy: `GET /api/procurement/suppliers`

### API-222
Owner: DOM-PRC
Method+path: `POST /api/procurement/suppliers`
Purpose: Create a Supplier for a Business.
Auth/scope: Business OWNER or `PROCUREMENT_BUYER` (`procurement.po.write`).
Request: `{ businessId, code, name, taxId?, contactName?, phone?, email?, address?, paymentTerms?, leadTimeDays?, notes? }`.
Response: created Supplier DTO.
Errors: `404` scope; `409 SUPPLIER_CODE_TAKEN`.
Implements: FR-082-001
Legacy: `POST /api/procurement/suppliers`

### API-224
Owner: DOM-PRC
Method+path: `GET /api/procurement/suppliers/[id]`
Purpose: Read one Supplier.
Auth/scope: Business visibility + `procurement` domain.
Response: Supplier DTO.
Errors: `404` unknown id or not visible (identical response, FR-003-009).
Implements: FR-082-001
Legacy: `GET /api/procurement/suppliers/[id]`

### API-221
Owner: DOM-PRC
Method+path: `PATCH /api/procurement/suppliers/[id]`
Purpose: Apply one versioned action — `UPDATE` the editable fields, or `ARCHIVE` (the row and its orders stay; an archived supplier takes no new order).
Auth/scope: Business OWNER or `PROCUREMENT_BUYER`.
Request: `{ action: 'UPDATE'|'ARCHIVE', version, fields? }` (compare-and-swap on `version`).
Response: updated Supplier DTO.
Errors: `404` scope; `409` version conflict / already archived.
Implements: FR-082-001
Legacy: `PATCH /api/procurement/suppliers/[id]`

### API-219
Owner: DOM-PRC
Method+path: `GET /api/procurement/purchase-orders`
Purpose: List a Business's purchase orders (DRAFT/SENT by default; `status` or `includeClosed` to widen; optional `supplierId` filter) plus a summary (`open`, `draft`, `awaitingDelivery`, `partiallyReceived`, `outstandingValue`).
Auth/scope: Business visibility + `procurement` domain.
Request: query `businessId`, `status?`, `supplierId?`, `includeClosed?`, `limit?`.
Response: `{ businessId, orders: [PurchaseOrderDTO], summary }`.
Errors: `404` scope.
Implements: FR-082-001
Legacy: `GET /api/procurement/purchase-orders`

### API-218
Owner: DOM-PRC
Method+path: `POST /api/procurement/purchase-orders`
Purpose: Create a DRAFT purchase order against an ACTIVE Supplier of the same Business, with lines (each optionally naming a non-archived Inventory SKU) at the unit cost agreed for this purchase.
Auth/scope: Business OWNER or `PROCUREMENT_BUYER` (`procurement.po.write`).
Request: `{ businessId, supplierId, currency?, expectedAt?, notes?, orderedAt?, lines: [{ productId?, description?, qty, unitCost }] }`.
Response: created PurchaseOrder DTO (`total`, `receivedValue`, `outstandingValue`, `receiptState` computed).
Errors: `404` scope; `422 SUPPLIER_NOT_FOUND` / `PRODUCT_NOT_FOUND`; `409 SUPPLIER_ARCHIVED` / `PRODUCT_ARCHIVED`.
Implements: FR-082-001
Legacy: `POST /api/procurement/purchase-orders`

### API-220
Owner: DOM-PRC
Method+path: `GET /api/procurement/purchase-orders/[id]`
Purpose: Read one purchase order with lines, receipts and computed totals/receipt state.
Auth/scope: Business visibility + `procurement` domain.
Errors: `404` unknown id or not visible.
Implements: FR-082-001
Legacy: `GET /api/procurement/purchase-orders/[id]`

### API-217
Owner: DOM-PRC
Method+path: `PATCH /api/procurement/purchase-orders/[id]`
Purpose: Apply one versioned action: `UPDATE` (lines/supplier only while DRAFT; notes/expectedAt while open), `SEND` (DRAFT→SENT, locks lines/supplier), `CLOSE` (SENT→SHORT_CLOSED with a reason, lines outstanding), `CANCEL` (DRAFT/SENT→CANCELLED, refused once anything was received).
Auth/scope: Business OWNER or `PROCUREMENT_BUYER`.
Request: `{ action, version, fields? | reason? }` (compare-and-swap on `version`).
Response: updated PurchaseOrder DTO.
Errors: `404` scope; `409 PURCHASE_ORDER_VERSION_CONFLICT` / `PURCHASE_ORDER_STATUS_INVALID` / `PURCHASE_ORDER_LINES_LOCKED` / `PURCHASE_ORDER_SUPPLIER_LOCKED` / `PURCHASE_ORDER_HAS_RECEIPTS`.
Implements: FR-082-001
Legacy: `PATCH /api/procurement/purchase-orders/[id]`

### API-214
Owner: DOM-PRC
Method+path: `GET /api/procurement/purchase-orders/[id]/receipts`
Purpose: List the receipts posted against one purchase order.
Auth/scope: Business visibility + `procurement` domain.
Response: `{ purchaseOrderId, purchaseOrderCode, receipts: [ReceiptDTO] }`.
Errors: `404` unknown order or not visible.
Implements: FR-082-002
Legacy: `GET /api/procurement/purchase-orders/[id]/receipts`

### API-215
Owner: DOM-PRC
Method+path: `POST /api/procurement/purchase-orders/[id]/receipts`
Purpose: Post a goods receipt against a SENT order. Each line names one order line and may not exceed its outstanding quantity; a line whose order line names a counted (TRACKED) SKU posts an Inventory `RECEIPT` movement in the same transaction (contract `API-194`, reference `PO:<code>/GRN:<code>`); the receipt that completes every line moves the order to RECEIVED in the same transaction.
Auth/scope: Business OWNER or `PROCUREMENT_BUYER`'s `procurement.receipt.post`, **plus** Inventory's own write authority when any line is counted (`API-194`'s `mayManage`) — a Procurement binding never widens it. The person posting may not be the order's own creator unless `selfVerifyAttested: true` is given (three-way-match; cross-cutting, not a PRC rule — see legacy `@req FR-032-002`).
Request: `{ receivedAt?, supplierReference?, notes?, batchCostSatang?, selfVerifyAttested?, lines: [{ purchaseOrderLineId, qty, lotCode?, expiresAt?, serialNos? }] }`.
Response: `{ receipt: ReceiptDTO, order: PurchaseOrderDTO, posted: [...] }`.
Errors: `404` scope; `409 PURCHASE_ORDER_NOT_RECEIVABLE` / `GOODS_RECEIPT_SELF_POST_FORBIDDEN` / `PROCUREMENT_RECEIPT_EXCEEDS_ORDERED`; `422 PROCUREMENT_RECEIPT_LINE_NOT_FOUND` / `PROCUREMENT_RECEIPT_LINE_NOT_COUNTED` / `PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE`; `403 PROCUREMENT_RECEIPT_REQUIRES_INVENTORY_AUTHORITY`.
Implements: FR-082-002
Legacy: `POST /api/procurement/purchase-orders/[id]/receipts`

### API-213
Owner: DOM-PRC
Method+path: `GET /api/procurement/receipts`
Purpose: Scoped, bounded (`limit`/`offset`, `hasMore`) Business-wide receipt registry, including persisted PO line/lot/serial detail for display.
Auth/scope: Business visibility + `procurement` domain.
Implements: FR-082-002
Legacy: `GET /api/procurement/receipts`

### API-216
Owner: DOM-PRC
Method+path: `GET /api/procurement/receipts/[id]`
Purpose: Read one persisted goods receipt (printable detail) within the viewer's Business scope.
Auth/scope: Business visibility + `procurement` domain.
Errors: `404` unknown id or not visible.
Implements: FR-082-002
Legacy: `GET /api/procurement/receipts/[id]`

## Not FR-backed (flagged, not redeclared as PRC contracts)

The following routes exist in code under `apps/server/src/app/api/procurement/cost-sheets/**`
(`GET/POST cost-sheets`, `GET cost-sheets/[id]`, `GET cost-sheets/template`,
`POST cost-sheets/preview`, `POST cost-sheets/commit`, `POST cost-sheets/xlsx`)
implementing `SupplierCostSheet`/`SupplierCostLine` intake (TASK-ZAI-053). They
are real, tested endpoints but are **not covered by FR-082-001 or FR-082-002** and
have no declared FR of their own in `docs/PRD-SDD-v1.0.md` — see
`docs/features/FEAT-082-procurement-core/feature.md` §9
for this gap. Not modelled as `API-PRC-*` here to avoid declaring a contract
with no requirement behind it; a future FR should claim them.
