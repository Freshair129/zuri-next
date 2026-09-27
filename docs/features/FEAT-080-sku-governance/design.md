---
id: SDD-080
title: "SKU governance — nature, variant identity, identifiers, lifecycle, hygiene — design"
---

# SDD-080 — SKU governance — nature, variant identity, identifiers, lifecycle, hygiene design

- **Components:**
  - `CMP-234` — `domain/inventory-governance.js`: `natureRule`,
    `variantValues`/`variantKeyFor`/`lookalikeFingerprint`, `productLifecycleRule`/
    `archiveGuard`/`mergeRule`, `hygieneReport`, `replenishmentRow`.
  - `CMP-236` — `application/inventory-identity-service.js`: identifiers,
    unit conversions, `resolveProduct`.
  - `CMP-235` — `application/inventory-hygiene-service.js`: hygiene report +
    replenishment read.
  - `CMP-242` — `ui/sku-console.js`: pure console helpers (identifier
    input problems, base-quantity preview, Thai refusal text).
- **Data owned:** `ProductMaster.nature`/`defaultStockPolicy`/`variantAxes`,
  `Product.variant`/`variantKey`/`status`/`mergedIntoProductId`/`reorderPoint`/
  `reorderQty`/`leadTimeDays`, `ProductIdentifier`, `ProductUnitConversion`.
- **Contracts exposed:** `API-199`, `API-203`, `API-196`, `API-209`.
- **Contracts consumed:** none (extends FEAT-077's catalogue/ledger in-domain).
- **Main sequence:** create master (declare nature/axes) → create SKU (inherits
  nature, keyed by variant) → attach identifiers/conversions → lifecycle actions as
  needed → hygiene report/replenishment read on demand.
- **Failure modes:** nature mismatch refused at SKU creation; duplicate variant
  combination refused (named); lookalike refused without explicit override;
  duplicate/retired identifier value refused; archive-with-stock refused; merge
  blocked by open references.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-080-001 | `apps/server/src/modules/inventory/domain/inventory-governance.js` (`natureRule`), `application/inventory-catalog-service.js`, `apps/server/src/app/api/inventory/products/route.js` |
| FR-080-002 | `apps/server/src/modules/inventory/domain/inventory-governance.js` (`variantKeyFor`, `lookalikeFingerprint`) |
| FR-080-003 | `apps/server/src/modules/inventory/application/inventory-identity-service.js`, `apps/server/src/app/api/inventory/products/[id]/identifiers/route.js`, `.../products/resolve/route.js` |
| FR-080-004 | `apps/server/src/modules/inventory/application/inventory-identity-service.js`, `apps/server/src/app/api/inventory/products/[id]/unit-conversions/route.js` |
| FR-080-005 | `apps/server/src/modules/inventory/domain/inventory-governance.js` (`productLifecycleRule`, `mergeRule`), `application/inventory-catalog-service.js` (`applyProductAction`) |
| FR-080-006 | `apps/server/src/modules/inventory/domain/inventory-governance.js` (`hygieneReport`), `apps/server/src/app/api/inventory/catalog-hygiene/route.js` |
| FR-080-007 | `apps/server/src/modules/inventory/domain/inventory-governance.js` (`replenishmentRow`), `apps/server/src/app/api/inventory/replenishment/route.js` |
