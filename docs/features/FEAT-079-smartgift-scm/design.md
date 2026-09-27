---
id: SDD-079
title: "SmartGift SCM — located ledger, WIP, landed cost, ATP, stocktake — design"
---

# SDD-079 — SmartGift SCM — located ledger, WIP, landed cost, ATP, stocktake design

- **Components:**
  - `CMP-238` — `application/warehouse-location-service.js`,
    `application/location-transfer-service.js`, `domain/warehouse-location.js`.
  - `CMP-233` — `domain/inventory-costing.js` (pure landed-cost/WAVG calculators).
  - `CMP-244` — `application/customization-work-order-service.js`,
    `application/kitting-work-order-service.js`, `application/de-kitting-service.js`,
    `domain/inventory-wip.js`.
  - `CMP-241` — `application/inventory-shelf-life-service.js`.
  - `CMP-227` — `application/inventory-atp-service.js`.
  - `CMP-243` — `application/inventory-stocktake-service.js`,
    `domain/inventory-stocktake.js`.
- **Data owned:** `WarehouseLocation`, `CustomizationWorkOrder`, `KittingWorkOrder`,
  `StockReservation`, `InventoryStocktake`, `InventoryLedgerFence`; `StockMovement`'s
  `sourceLocationId`/`targetLocationId`/`costSatang` columns (extending
  FEAT-077's ledger, not a separate ownership).
- **Contracts exposed:** `API-205`, `API-201`, `API-204`, `API-202`, `API-211`, `API-210`, `API-212`.
- **Contracts consumed:** `API-194` (this feature's own components
  are callers of FEAT-077's exported ledger contract, same domain).
- **Main sequence** (produce → customize → kit → promise → count):
  1. Raw stock transfers into `TH_WIP_CUSTOMIZATION`; a `CustomizationWorkOrder`
     completes into a dedicated `CUSTOM_COMPONENT`.
  2. A `KittingWorkOrder` explodes a recipe with scrap allowance, completes into a
     `TH_FINISHED_GOODS` set with blended landed cost and a FlowAccount code.
  3. `StockReservation`s hold QUOTE/ORDER promises against ATP without touching the
     ledger.
  4. A stocktake preview compares counted lines to expected; commit fences the
     ledger and appends signed ADJUSTMENTs atomically or nothing.
- **Failure modes:** stale stocktake snapshot refused; missing FlowAccount code
  refuses kitting completion; a component past `maxStorageDays` refuses issue/
  kitting; over-committed ATP refused per the domain's own rule; a SERIAL/untracked
  stocktake line refused.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-079-001 | `apps/server/src/modules/inventory/application/warehouse-location-service.js`, `location-transfer-service.js`, `domain/warehouse-location.js`, `apps/server/src/app/api/inventory/locations/**`, `.../location-stock/route.js`, `.../transfers/route.js` |
| FR-079-002 | `apps/server/src/modules/inventory/domain/inventory-costing.js` |
| FR-079-003 | `apps/server/src/modules/inventory/application/customization-work-order-service.js`, `domain/inventory-wip.js`, `apps/server/src/app/api/inventory/customization-work-orders/**` |
| FR-079-004 | `apps/server/src/modules/inventory/application/kitting-work-order-service.js`, `apps/server/src/app/api/inventory/kitting-work-orders/**` |
| FR-079-005 | `apps/server/src/modules/inventory/application/de-kitting-service.js`, `apps/server/src/app/api/inventory/de-kitting/route.js` |
| FR-079-006 | `apps/server/src/modules/inventory/application/inventory-shelf-life-service.js`, `domain/inventory-wip.js`, `apps/server/src/app/api/inventory/shelf-life/route.js` |
| FR-079-007 | `apps/server/src/modules/inventory/application/inventory-atp-service.js`, `apps/server/src/app/api/inventory/reservations/**`, `.../atp/route.js` |
| FR-079-008 | 13 route files under `apps/server/src/app/api/inventory/**`, `INVENTORY_TABS`, `apps/server/src/app/(pm)/inventory/locations/page.jsx`, `.../work-orders/page.jsx`, `.../reservations/page.jsx` |
| FR-079-009 | `apps/server/src/modules/inventory/application/inventory-stocktake-service.js`, `domain/inventory-stocktake.js`, `apps/server/src/app/api/inventory/stocktakes/**` |
