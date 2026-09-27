---
id: FR-077-002
title: "Append-only stock ledger with lot/serial identity and FEFO"
delivery: building
legacy: [FR-155]
relations:
  specified_by: [SDD-077]
  decided_by: [none]
---

# FR-077-002 — Append-only stock ledger with lot/serial identity and FEFO

The system SHALL record every stock change for a TRACKED product as an append-only
`StockMovement` (RECEIPT adds, ISSUE removes, ADJUSTMENT carries its own sign, with
reason/reference/actor/timestamp), computing on-hand as the recomputed sum on every
read — never stored — and flagging on-hand below `safetyStock`. An UNTRACKED product
SHALL refuse a movement (`INVENTORY_PRODUCT_UNTRACKED`) and report `null` on-hand,
never zero. A LOT-tracked receipt SHALL name or create its `ProductLot`; a receipt
into a CLOSED lot SHALL be refused. A SERIAL-tracked movement SHALL name exactly one
serial per unit, writing one ledger row per unit; a unit SHALL be created IN_STOCK
by receipt and ISSUED by issue; ADJUSTMENT SHALL be refused on a serial product. An
ISSUE naming no lot on a LOT-tracked SKU SHALL be consumed FEFO across OPEN lots
(unknown expiry last); an ISSUE that would take on-hand below zero SHALL be refused.

## Acceptance criteria

- AC-077-002-01 — Given an UNTRACKED product, when a movement is attempted, then it is refused with `INVENTORY_PRODUCT_UNTRACKED` and a summary read shows `null` on-hand.
- AC-077-002-02 — Given two OPEN lots with different expiry dates and sufficient combined on-hand, when an ISSUE names no lot, then units are drawn from the earliest-expiring lot first (FEFO), recorded per-lot in the audit payload.
- AC-077-002-03 — Given on-hand of 5 units, when an ISSUE of 6 is attempted, then it is refused rather than driving on-hand negative.
- AC-077-002-04 — Given a SERIAL-tracked product, when an ADJUSTMENT is attempted, then it is refused.

## Implementation

- `apps/server/src/modules/inventory/application/inventory-stock-service.js`, `domain/inventory.js`, `apps/server/src/app/api/inventory/lots/route.js`, `.../serial-units/route.js`, `.../stock-movements/route.js`, `.../stock/route.js`

## Verification

- TC-077-002 — Ledger append-only, FEFO, over-issue refusal (see [verification.md](../verification.md))
