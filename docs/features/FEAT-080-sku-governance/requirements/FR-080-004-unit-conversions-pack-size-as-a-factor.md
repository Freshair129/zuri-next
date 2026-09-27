---
id: FR-080-004
title: "Unit conversions, pack size as a factor not a SKU"
delivery: implemented
legacy: [FR-204, BR-037]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]

---

# FR-080-004 — Unit conversions, pack size as a factor not a SKU

The system SHALL let a SKU declare `ProductUnitConversion` (`unit`, integer
`factor`, `usage` PURCHASE/SALES/ANY), unique per `(productId, unit)`; the base unit
itself SHALL be refused (`INVENTORY_UNIT_IS_BASE`); a serial-tracked or service SKU
SHALL take none. A movement naming a `unit` SHALL be converted to base units before
`appendMovement` runs, refusing an unknown/retired unit
(`INVENTORY_UNIT_UNKNOWN`), and SHALL record `unitConversion { unit, factor,
quantityInUnit }` in the audit payload and response.

## Acceptance criteria

- AC-080-004-01 — Given `ProductUnitConversion { unit: 'BOX12', factor: 12 }`, when a receipt names `{ unit: 'BOX12', quantity: 5 }`, then the ledger row records 60 base units, with the conversion detail in the audit payload.
- AC-080-004-02 — Given a SERIAL-tracked SKU, when a unit conversion is declared for it, then it is refused (`INVENTORY_UNIT_NOT_FOR_SERIAL`).

## Implementation

- `apps/server/src/modules/inventory/application/inventory-identity-service.js`, `apps/server/src/app/api/inventory/products/[id]/unit-conversions/route.js`

## Verification

- TC-080-004 — Unit conversion base-quantity conversion (see [verification.md](../verification.md))
