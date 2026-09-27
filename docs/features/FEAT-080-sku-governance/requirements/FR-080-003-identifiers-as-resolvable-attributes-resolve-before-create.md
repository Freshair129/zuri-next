---
id: FR-080-003
title: "Identifiers as resolvable attributes, resolve before create"
delivery: implemented
legacy: [FR-203, BR-002]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]

---

# FR-080-003 — Identifiers as resolvable attributes, resolve before create

The system SHALL let a SKU carry `ProductIdentifier` rows (GTIN/BARCODE/
SUPPLIER_CODE/MANUFACTURER_PART/LEGACY_CODE), unique per `(tenantId, kind, value)`,
the two scannable kinds sharing one value space
(`INVENTORY_IDENTIFIER_TAKEN` naming the holder); a GTIN SHALL be 8/12/13/14 digits
with a valid mod-10 check digit; a RETIRED value SHALL still block reuse. The system
SHALL expose `resolveProduct` answering which SKU a value names — checked in order
code, FlowAccount code, then any active identifier — following a merge to its
survivor, and answering `{ product: null }` with `200` on a miss, never an error.

## Acceptance criteria

- AC-080-003-01 — Given a GTIN with an invalid check digit, when submitted, then it is refused before being stored.
- AC-080-003-02 — Given a RETIRED identifier value, when a new SKU attempts to claim the same value, then it is refused — retirement does not free the value.
- AC-080-003-03 — Given a value that resolves to a SKU that was later merged into a survivor, when `resolveProduct` is called with that value, then it answers the survivor, not the archived duplicate.

## Implementation

- `apps/server/src/modules/inventory/application/inventory-identity-service.js`, `apps/server/src/app/api/inventory/products/[id]/identifiers/route.js`, `.../products/resolve/route.js`

## Verification

- TC-080-003 — Identifier validation, retirement, resolve-through-merge (see [verification.md](../verification.md))
