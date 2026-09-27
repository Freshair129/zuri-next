---
id: FR-082-002
title: "Goods receipts post counted lines into the Inventory ledger"
delivery: building
legacy: [FR-165]
relations:
  specified_by: [none]
  decided_by: [ADR-075]
---

# FR-082-002 — Goods receipts post counted lines into the Inventory ledger

The system SHALL let a viewer holding Business OWNER or the buyer's
`procurement.receipt.post` post a `GoodsReceipt` against a SENT
`PurchaseOrder`, with each `GoodsReceiptLine` naming exactly one order line
and never exceeding that line's outstanding quantity (refused whole, with
the per-line violation list, otherwise). For a receipt line whose order line
names a counted (`stockPolicy: TRACKED`) SKU, the system SHALL call
Inventory's `API-194` contract inside the receipt's own
transaction with reason `GOODS_RECEIPT` and reference `PO:<code>/GRN:<code>`,
requiring the viewer to hold Inventory's own write authority in addition to
the Procurement buyer's; a receipt made only of free-text or uncounted lines
SHALL require no Inventory authority. The system SHALL move the order to
RECEIVED, in the same transaction, when a receipt completes every
outstanding line, and SHALL never allow a `GoodsReceipt` to be edited or
deleted once posted.

## Acceptance criteria

- AC-082-002-01 — Given a SENT order with one TRACKED line fully outstanding, when a viewer with both Procurement receipt authority and Inventory write authority posts a full-quantity receipt, then an Inventory `RECEIPT` movement is created with reference `PO:<code>/GRN:<code>` and the order's status becomes RECEIVED.
- AC-082-002-02 — Given the same order, when a viewer holding only Procurement receipt authority (no Inventory write authority) attempts the same receipt, then it is refused with `403 PROCUREMENT_RECEIPT_REQUIRES_INVENTORY_AUTHORITY` and no ledger row is created.
- AC-082-002-03 — Given a line whose remaining outstanding quantity is 2, when a receipt line requests qty 3 against it, then the whole receipt is refused with `409 PROCUREMENT_RECEIPT_EXCEEDS_ORDERED` and the per-line detail names that line.
- AC-082-002-04 — Given a posted receipt, when any caller attempts to modify or delete it, then no such route exists (no PATCH/DELETE) and the receipt is unchanged.

## Implementation

- `apps/server/src/modules/procurement/application/goods-receipt-service.js`, `apps/server/src/app/api/procurement/purchase-orders/[id]/receipts/route.js`, `apps/server/src/app/api/procurement/receipts/route.js`, `apps/server/src/app/api/procurement/receipts/[id]/route.js`
