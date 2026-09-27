---
id: FR-078-001
title: "TRACKED / UNTRACKED / SERVICE as an accounting distinction"
delivery: implemented
legacy: [FR-168]
relations:
  specified_by: [SDD-078]
  decided_by: [none]
---

# FR-078-001 — TRACKED / UNTRACKED / SERVICE as an accounting distinction

The system SHALL let a `Product` declare one of `stockPolicy` TRACKED (a counted
good, every movement a ledger row, cost held in stock until issued), UNTRACKED
(still a good, buyable/receivable, but carrying no perpetual count — no on-hand at
all rather than a zero) or SERVICE (not a good; no stock fields exist). A movement
against a SERVICE product SHALL be refused by its own code
(`INVENTORY_PRODUCT_IS_A_SERVICE`), distinct from the UNTRACKED refusal
(`INVENTORY_PRODUCT_UNTRACKED`) because a service can never be reversed into a
counted good the way an UNTRACKED good could start being counted. A Procurement
goods receipt line naming a SERVICE product SHALL be refused
(`PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE`) — it may still sit on a purchase order and
be paid for, just never received into a warehouse. Anything without a ledger
(`UNTRACKED` or `SERVICE`) SHALL be stored with `trackingMode: NONE`, so neither can
ask for lot or serial identity it can never have. The catalogue form SHALL narrow to
the fields the chosen nature actually uses.

## Acceptance criteria

- AC-078-001-01 — Given a SERVICE product, when any stock movement is attempted against it, then it is refused with `INVENTORY_PRODUCT_IS_A_SERVICE`, distinct from the UNTRACKED refusal code.
- AC-078-001-02 — Given a SERVICE product named on a Procurement goods receipt line, when the receipt is posted, then it is refused with `PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE`.
- AC-078-001-03 — Given an UNTRACKED product, when its stock summary is read, then on-hand is `null`, never `0`.
- AC-078-001-04 — Given a SERVICE product, when the catalogue form is opened, then no `trackingMode` or safety-stock field is offered.

## Implementation

- `apps/server/src/modules/inventory/domain/inventory.js` (`movementRule`, `INVENTORY_PRODUCT_IS_A_SERVICE`, `INVENTORY_PRODUCT_UNTRACKED`), `apps/server/src/modules/procurement/application/goods-receipt-service.js` (`PROCUREMENT_RECEIPT_LINE_IS_A_SERVICE`)

## Verification

- TC-078-001 — Service/untracked refusal codes and catalogue form narrowing (see [verification.md](../verification.md))
- TC-078-002 — Procurement receipt refuses a service line (see [verification.md](../verification.md))
