---
id: FR-077-001
title: "Catalogue identity, eight ids as attributes"
delivery: building
legacy: [FR-154, BR-002]
relations:
  specified_by: [SDD-077]
  decided_by: [none]

---

# FR-077-001 — Catalogue identity, eight ids as attributes

The system SHALL let a Business OWNER or `INVENTORY_MANAGER` create and maintain
`InventoryCategory`, `ProductFamily`, `Factory`, `ProductMaster`, `Product` (SKU) and
`ProductBundle`/`ProductBundleItem`, each with a human `code` unique per Tenant as an
attribute (never a foreign key). Every cross-reference (category/family/factory/
master/bundle item) SHALL belong to the same Business or be refused. `Product`
SHALL fix `stockPolicy` (TRACKED/UNTRACKED) and `trackingMode` (NONE/LOT/SERIAL) at
creation, never edited afterward. `ProductBundle.availableSets` SHALL be derived
from the ledger; an uncounted item SHALL never limit it.

## Acceptance criteria

- AC-077-001-01 — Given a `ProductMaster` in category A, when a SKU is created naming a category from a different Business, then it is refused.
- AC-077-001-02 — Given a created `Product` with `stockPolicy: TRACKED`, when an `UPDATE` attempts to change `stockPolicy`, then it is refused — the field is fixed at creation.
- AC-077-001-03 — Given a bundle with one uncounted item and one tracked item, when `availableSets` is computed, then only the tracked item's on-hand limits it.

## Implementation

- `apps/server/src/modules/inventory/application/inventory-catalog-service.js`, `apps/server/src/app/api/inventory/categories/route.js`, `.../families/route.js`, `.../factories/route.js`, `.../product-masters/route.js`, `.../products/route.js`, `.../products/[id]/route.js`, `.../bundles/route.js`

## Verification

- TC-077-001 — Catalogue identity and cross-Business refusal (see [verification.md](../verification.md))
