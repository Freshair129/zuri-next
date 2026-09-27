---
id: FR-083-001
title: "Sales orders with priced lines and status machine"
delivery: building
legacy: [FR-166, BR-002]
relations:
  specified_by: [SDD-083]
  decided_by: [ADR-076]

---

# FR-083-001 — Sales orders with priced lines and status machine

The system SHALL let a Business OWNER or `SALES_REP` create and maintain
`SalesOrder` rows (generated `ORD-YYYYMMDD-NNN` code unique per Tenant) Business-
scoped, with an optional `customerId`/`conversationId` reached only through the
Business's own Tenant — a Conversation supplies its own Customer and refuses a
different one, and forces `origin: CHAT`; otherwise `origin` is WALK_IN or ONLINE.
`SalesOrderLine` rows SHALL be real rows (never a JSON blob), may name an ACTIVE
Inventory SKU of the same Business, and SHALL carry the price given at the time of
sale, quantity and discount in integer satang. The system SHALL drive the order
DRAFT → CONFIRMED (locks lines) → COMPLETED (may issue stock) or DRAFT/CONFIRMED →
CANCELLED, and SHALL compute subtotal/total/paid/balance/payment state on every read,
never storing them.

## Acceptance criteria

- AC-083-001-01 — Given a Conversation with Customer C, when an order names that Conversation, then `customerId` is forced to C and `origin` is CHAT; naming a different `customerId` in the same request is refused.
- AC-083-001-02 — Given a CONFIRMED order, when `UPDATE` targets its lines, then it is refused with `SALES_ORDER_LINES_LOCKED`; notes/discount may still change while open.
- AC-083-001-03 — Given a DRAFT order, when `COMPLETE` is attempted directly (skipping CONFIRMED), then it is refused (COMPLETE requires CONFIRMED first).

## Implementation

- `apps/server/src/modules/commerce/application/sales-order-service.js`, `domain/commerce.js`, `apps/server/src/app/api/commerce/orders/route.js`, `.../orders/[id]/route.js`

## Verification

- TC-083-001 — Order lifecycle, Conversation-forced origin, line locking (see [verification.md](../verification.md))
- TC-083-005 — Route wiring and calculators (unit) (see [verification.md](../verification.md))
- TC-083-006 — Console end-to-end order/payment flow (see [verification.md](../verification.md))
