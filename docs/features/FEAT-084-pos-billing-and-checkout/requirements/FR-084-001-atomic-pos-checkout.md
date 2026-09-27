---
id: FR-084-001
title: "Atomic POS checkout"
delivery: building
legacy: [FR-183, FR-163]
relations:
  specified_by: [SDD-084]
  decided_by: [ADR-076]

---

# FR-084-001 — Atomic POS checkout

The system SHALL let an authorized Business viewer, for a selected active Branch and
active `WarehouseLocation`, checkout a WALK_IN order in one transaction: create the
`SalesOrder` with manually supplied `unitPrice` lines (integer satang), record a
PENDING `Payment` (method QR/CASH/TRANSFER/CARD/OTHER), issue tracked stock through
`API-194` with Inventory's own authority, and return exact cash
change — rolling back every row on any failure (invalid line/product/customer scope,
missing location, insufficient cash, duplicate payment reference, inventory
shortage, lot/serial refusal, or any later audit failure). A separate existing
verifier (`FR-083-003`) SHALL remain the only path from PENDING to VERIFIED.

## Acceptance criteria

- AC-084-001-01 — Given a valid Branch/WarehouseLocation and sufficient tracked stock, when checkout is submitted with `CASH` and cash tendered greater than the total, then one transaction creates the order, a PENDING payment, issues stock and returns exact integer-satang change.
- AC-084-001-02 — Given a checkout with insufficient on-hand stock for one line, when submitted, then the whole checkout is refused and no order, payment or stock movement is created (full rollback).
- AC-084-001-03 — Given a duplicate payment reference already used, when checkout is submitted, then it is refused before any row is created.
- AC-084-001-04 — Given a successful checkout, when the resulting payment is read, then its status is PENDING, not VERIFIED — POS checkout never self-verifies its own payment.

## Implementation

- `apps/server/src/modules/commerce/application/pos-cashier-service.js`, `apps/server/src/app/api/commerce/pos/checkout/route.js`

## Verification

- TC-084-001 — Atomic checkout, rollback and change calculation (see [verification.md](../verification.md))
- TC-084-003 — Domain calculators (unit) (see [verification.md](../verification.md))
- TC-084-004 — Console end-to-end billing/POS flow (see [verification.md](../verification.md))
