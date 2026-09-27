---
id: SDD-077
title: "Inventory core ledger — design"
---

# SDD-077 — Inventory core ledger design

- **Components:**
  - `CMP-232` — `application/inventory-catalog-service.js`: the only
    writer of category/family/factory/master/SKU/bundle.
  - `CMP-237` — `application/inventory-stock-service.js` + `domain/inventory.js`:
    the only writer of the ledger; FEFO, `appendMovement` (the exported cross-domain
    write contract).
  - `CMP-240` — `application/inventory-recipe-service.js`: explosion and
    atomic build.
  - `CMP-228` — `application/inventory-authority.js`: view/manage ladder.
- **Data owned:** `InventoryCategory`, `ProductFamily`, `Factory`, `ProductMaster`,
  `Product`, `ProductBundle`, `ProductBundleItem`, `ProductLot`, `SerialUnit`,
  `StockMovement`, `ProductRecipe`, `ProductRecipeLine`.
- **Contracts exposed:** `API-200`, `API-200`,
  `API-200`, `API-200`, `API-207`,
  `API-195`, `API-194`, `API-206`,
  `API-206`, `API-INV-stock-movements`, `API-206`,
  `API-208`, `API-208`.
- **Contracts consumed:** none (foundational feature).
- **Main sequence** (create SKU → receive → issue → build):
  1. Manager creates catalogue rows; SKU fixes stockPolicy/trackingMode.
  2. `POST /api/inventory/stock-movements {type:'RECEIPT', lotCode?}` creates/uses a
     lot, appends the row.
  3. `POST /api/inventory/stock-movements {type:'ISSUE'}` FEFO-consumes lots when no
     lot named; refuses a negative on-hand.
  4. `POST /api/inventory/recipes/[id]/build` issues components, receives output, in
     one transaction.
- **Failure modes:** cross-Business reference refused; UNTRACKED movement refused;
  CLOSED-lot receipt refused; over-issue refused; recipe shortage refuses whole
  build; SERIAL output/component refuses build.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-077-001 | `apps/server/src/modules/inventory/application/inventory-catalog-service.js`, `apps/server/src/app/api/inventory/categories/route.js`, `.../families/route.js`, `.../factories/route.js`, `.../product-masters/route.js`, `.../products/route.js`, `.../products/[id]/route.js`, `.../bundles/route.js` |
| FR-077-002 | `apps/server/src/modules/inventory/application/inventory-stock-service.js`, `domain/inventory.js`, `apps/server/src/app/api/inventory/lots/route.js`, `.../serial-units/route.js`, `.../stock-movements/route.js`, `.../stock/route.js` |
| FR-077-003 | `apps/server/src/modules/inventory/application/inventory-recipe-service.js`, `apps/server/src/app/api/inventory/recipes/route.js`, `.../recipes/[id]/route.js`, `.../recipes/[id]/build/route.js` |
