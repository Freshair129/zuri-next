---
id: FR-082-001
title: "Suppliers and purchase orders"
delivery: building
legacy: [FR-164]
relations:
  specified_by: [none]
  decided_by: [ADR-075]
---

# FR-082-001 — Suppliers and purchase orders

The system SHALL let a Business OWNER or a viewer holding
`PROCUREMENT_BUYER` (`procurement.po.write`) create and maintain
`Supplier` rows (a per-Tenant-unique human `code`, name, tax id, contact,
payment terms, lead time; ACTIVE until `ARCHIVE`, never deleted) and
`PurchaseOrder` rows against an ACTIVE Supplier of the same Business, with
`PurchaseOrderLine` rows that may name a non-archived Inventory SKU at the
unit cost agreed for this purchase (integer satang) or stay free-text. The
system SHALL drive the order through DRAFT → SENT (`SEND`, locks lines and
supplier) → RECEIVED (set only by the goods receipt that completes every
line, FR-082-002) | SHORT_CLOSED (`CLOSE`, explicit short-close with
lines outstanding) | CANCELLED (`CANCEL`, refused once any receipt exists),
and SHALL compute total, received value, outstanding value, each line's
received/outstanding quantity and the order's receipt state on every read
rather than storing them. Every write SHALL be one transaction with
compare-and-swap on `version` and one audit event; reading SHALL require
Business visibility plus the `procurement` domain, with every scope refusal
returning the same 404.

## Acceptance criteria

- AC-082-001-01 — Given an ACTIVE Supplier and a viewer with `PROCUREMENT_BUYER`, when they `POST /api/procurement/purchase-orders` with valid lines, then a DRAFT order is created with a generated `PO-YYYYMMDD-NNN` code and computed `total` matching the sum of `qty × unitCost`.
- AC-082-001-02 — Given a DRAFT order, when the buyer `SEND`s it, then its status becomes SENT and a further `UPDATE` of its `lines` or `supplierId` is refused with `PURCHASE_ORDER_LINES_LOCKED` / `PURCHASE_ORDER_SUPPLIER_LOCKED`.
- AC-082-001-03 — Given a SENT order with at least one posted receipt, when the buyer attempts `CANCEL`, then the action is refused with `PURCHASE_ORDER_HAS_RECEIPTS`.
- AC-082-001-04 — Given an order naming a Supplier of a different Business, when it is created, then the request is refused with `422 SUPPLIER_NOT_FOUND`.

## Implementation

- `apps/server/src/modules/procurement/application/supplier-service.js`, `apps/server/src/modules/procurement/application/purchase-order-service.js`, `apps/server/src/modules/procurement/domain/procurement.js`, `apps/server/src/app/api/procurement/suppliers/route.js`, `apps/server/src/app/api/procurement/suppliers/[id]/route.js`, `apps/server/src/app/api/procurement/purchase-orders/route.js`, `apps/server/src/app/api/procurement/purchase-orders/[id]/route.js`
