# Contracts — Inventory & Catalogue

All routes require Business visibility + `inventory` domain to read; writes require
Business OWNER or `INVENTORY_MANAGER` (`inventory.catalog.write`); every scope
refusal is the shared 404 shape (`FR-003-009`).

### API-200
Owner: DOM-INV
Routes: `GET/POST /api/inventory/categories`, `.../families`, `.../factories`, `.../product-masters`
**Implements:** FR-077-001
**Legacy:** `apps/server/src/app/api/inventory/{categories,families,factories,product-masters}/route.js`

### API-207
Owner: DOM-INV
Routes: `GET/POST /api/inventory/products`, `GET/PATCH /api/inventory/products/[id]`
**Purpose:** SKU CRUD; supports `?nature=`/`?stockPolicy=` filtering (FR-080-001).
**Implements:** FR-077-001, FR-080-001
**Legacy:** `apps/server/src/app/api/inventory/products/route.js`, `.../products/[id]/route.js`

### API-195
Owner: DOM-INV
Route: `GET/POST /api/inventory/bundles`
**Implements:** FR-077-001
**Legacy:** `apps/server/src/app/api/inventory/bundles/route.js`

### API-194
Owner: DOM-INV
**Purpose:** The exported cross-domain stock-ledger write contract
(`appendMovement`) — not a public HTTP route of its own, but the internal contract
Procurement's goods-receipt posting and Commerce's order-completion/POS-checkout
call inside their own transactions. Publicly reachable via
`POST /api/inventory/stock-movements` for direct Inventory-console use.
**Implements:** FR-077-002
**Legacy:** `apps/server/src/modules/inventory/application/inventory-stock-service.js#appendMovement`, `apps/server/src/app/api/inventory/stock-movements/route.js`

### API-206
Owner: DOM-INV
Routes: `GET/POST /api/inventory/lots`, `GET /api/inventory/serial-units`, `GET /api/inventory/stock`
**Implements:** FR-077-002
**Legacy:** `apps/server/src/app/api/inventory/{lots,serial-units,stock}/route.js`

### API-208
Owner: DOM-INV
Routes: `GET/POST /api/inventory/recipes`, `GET/PATCH /api/inventory/recipes/[id]`, `POST /api/inventory/recipes/[id]/build`
**Implements:** FR-077-003
**Legacy:** `apps/server/src/app/api/inventory/recipes/**`

### API-205
Owner: DOM-INV
Routes: `GET/POST /api/inventory/locations`, `GET/PATCH /api/inventory/locations/[id]`, `GET /api/inventory/location-stock`, `POST /api/inventory/transfers`
**Implements:** FR-079-001
**Legacy:** `apps/server/src/app/api/inventory/locations/**`, `.../location-stock/route.js`, `.../transfers/route.js`

### API-201
Owner: DOM-INV
Routes: `GET/POST /api/inventory/customization-work-orders`, `PATCH /api/inventory/customization-work-orders/[id]` (action: RELEASE|COMPLETE|CANCEL)
**Implements:** FR-079-003, FR-079-008
**Legacy:** `apps/server/src/app/api/inventory/customization-work-orders/**`

### API-204
Owner: DOM-INV
Routes: `GET/POST /api/inventory/kitting-work-orders`, `PATCH /api/inventory/kitting-work-orders/[id]` (action: RELEASE|COMPLETE|CANCEL)
**Implements:** FR-079-004, FR-079-008
**Legacy:** `apps/server/src/app/api/inventory/kitting-work-orders/**`

### API-202
Owner: DOM-INV
Route: `POST /api/inventory/de-kitting`
**Implements:** FR-079-005
**Legacy:** `apps/server/src/app/api/inventory/de-kitting/route.js`

### API-211
Owner: DOM-INV
Route: `GET /api/inventory/shelf-life`
**Implements:** FR-079-006
**Legacy:** `apps/server/src/app/api/inventory/shelf-life/route.js`

### API-210
Owner: DOM-INV
Routes: `GET/POST /api/inventory/reservations`, `GET/PATCH /api/inventory/reservations/[id]`, `GET /api/inventory/atp`
**Implements:** FR-079-007
**Legacy:** `apps/server/src/app/api/inventory/reservations/**`, `.../atp/route.js`

### API-212
Owner: DOM-INV
Routes: `POST /api/inventory/stocktakes/preview`, `POST /api/inventory/stocktakes/commit`, `GET /api/inventory/stocktakes/[id]`
**Errors:** 409 `INVENTORY_STOCKTAKE_SNAPSHOT_STALE`.
**Implements:** FR-079-009
**Legacy:** `apps/server/src/app/api/inventory/stocktakes/**`

### API-199
Owner: DOM-INV
Route: `GET /api/inventory/products/resolve?identifier=`
**Purpose:** The exported cross-domain SKU-resolution contract (code, FlowAccount
code, or any active identifier, following a merge) — used internally by catalogue
intake and by Procurement's PO line entry / Commerce's POS catalogue read.
**Implements:** FR-080-003
**Legacy:** `apps/server/src/app/api/inventory/products/resolve/route.js`

### API-203
Owner: DOM-INV
Routes: `GET/POST/PATCH /api/inventory/products/[id]/identifiers`, `GET/POST/PATCH /api/inventory/products/[id]/unit-conversions`
**Implements:** FR-080-003, FR-080-004
**Legacy:** `apps/server/src/app/api/inventory/products/[id]/identifiers/route.js`, `.../unit-conversions/route.js`

### API-196
Owner: DOM-INV
Route: `GET /api/inventory/catalog-hygiene?businessId=&dormantDays=`
**Implements:** FR-080-006
**Legacy:** `apps/server/src/app/api/inventory/catalog-hygiene/route.js`

### API-209
Owner: DOM-INV
Route: `GET /api/inventory/replenishment?businessId=`
**Implements:** FR-080-007
**Legacy:** `apps/server/src/app/api/inventory/replenishment/route.js`

### API-197
Owner: DOM-INV
Routes: `POST /api/inventory/catalog-intakes/preview`, `POST /api/inventory/catalog-intakes/commit`, `GET /api/inventory/catalog-intakes`, `GET/PATCH /api/inventory/catalog-intakes/[id]` (CANCEL)
**Errors:** 409 `INVENTORY_CATALOG_INTAKE_CORRELATION_REUSED` / `..._PLAN_STALE` / `..._NOT_COMMITTABLE`.
**Implements:** FR-081-001
**Legacy:** `apps/server/src/app/api/inventory/catalog-intakes/**`

### API-198
Owner: DOM-INV
Routes: `GET /api/inventory/catalog-intakes/template?businessId=`, `POST /api/inventory/catalog-intakes/xlsx`
**Implements:** FR-081-002
**Legacy:** `apps/server/src/app/api/inventory/catalog-intakes/template/route.js`, `.../xlsx/route.js`
