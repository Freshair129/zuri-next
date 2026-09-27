---
id: FR-080-005
title: "SKU lifecycle and merge"
delivery: implemented
legacy: [FR-205, BR-040]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]

---

# FR-080-005 — SKU lifecycle and merge

The system SHALL drive `Product.status` ACTIVE → PHASE_OUT (refuses receipts,
allows issues/sell-down, never suggested by replenishment) → ARCHIVED (refused
while on-hand or a live reservation exists) via versioned actions UPDATE, ARCHIVE,
PHASE_OUT, REACTIVATE and MERGE. MERGE `{ into }` SHALL require same Business and
nature and an ACTIVE survivor, move the duplicate's on-hand to the survivor as an
ISSUE/RECEIPT pair (reference `MERGE:<code>`) when both are TRACKED/NONE (otherwise
`INVENTORY_MERGE_REQUIRES_EMPTY_STOCK`), re-point identifiers/unit conversions/
bundle items/recipe lines to the survivor unless blocked by an open work order
(`INVENTORY_MERGE_BLOCKED_BY_REFERENCES`), and leave the duplicate ARCHIVED with
`mergedIntoProductId` set. Nothing SHALL be deleted or rewritten; every action
SHALL record the caller's `reason`.

## Acceptance criteria

- AC-080-005-01 — Given a SKU with on-hand stock, when ARCHIVE is attempted, then it is refused with `INVENTORY_PRODUCT_HAS_STOCK`.
- AC-080-005-02 — Given two TRACKED SKUs of the same nature/Business, when MERGE moves the duplicate into the survivor, then the duplicate's on-hand becomes 0 via an ISSUE/RECEIPT pair referenced `MERGE:<code>`, and the duplicate ends ARCHIVED with `mergedIntoProductId` set.
- AC-080-005-03 — Given a duplicate named by an open work order, when MERGE is attempted, then it is refused with `INVENTORY_MERGE_BLOCKED_BY_REFERENCES` naming the blocking reference.
- AC-080-005-04 — Given a merged (ARCHIVED, `mergedIntoProductId` set) SKU, when REACTIVATE is attempted, then it is refused with `INVENTORY_PRODUCT_MERGED`.

## Implementation

- `apps/server/src/modules/inventory/domain/inventory-governance.js` (`productLifecycleRule`, `mergeRule`), `application/inventory-catalog-service.js` (`applyProductAction`)

## Verification

- TC-080-005 — Lifecycle guards and merge re-pointing (see [verification.md](../verification.md))
