---
id: FR-083-002
title: "Fulfilment issues counted stock through Inventory's contract"
delivery: building
legacy: [FR-166 (split 2/2 — fulfilment sub-behavior of the same PRD row)]
relations:
  specified_by: [SDD-083]
  decided_by: [ADR-076]
---

# FR-083-002 — Fulfilment issues counted stock through Inventory's contract

The system SHALL, on `COMPLETE`, issue every line naming a counted (TRACKED) SKU
through `API-194` inside the order's own transaction (FEFO lot
selection, reference `ORDER:<code>`), refusing the whole completion — with a per-SKU
shortage list — when any line is short, when any line names a SERIAL-tracked SKU, or
when the viewer lacks Inventory's own write authority. `CANCEL` SHALL keep the order
row and its payments (nothing is deleted).

## Acceptance criteria

- AC-083-002-01 — Given a CONFIRMED order whose lines all have sufficient on-hand counted stock, when `COMPLETE` is called by a viewer with both Commerce and Inventory write authority, then stock is issued FEFO with reference `ORDER:<code>` and the order becomes COMPLETED in the same transaction.
- AC-083-002-02 — Given one line short of on-hand stock, when `COMPLETE` is attempted, then the whole completion is refused with a per-SKU shortage list and no partial stock issue occurs.
- AC-083-002-03 — Given a line naming a SERIAL-tracked SKU, when `COMPLETE` is attempted, then it is refused — a sale cannot pick specific serials in this slice.

## Implementation

- `apps/server/src/modules/commerce/application/sales-order-service.js` (COMPLETE action, Inventory call)

## Verification

- TC-083-002 — Fulfilment stock issue, shortage and SERIAL refusal (see [verification.md](../verification.md))
