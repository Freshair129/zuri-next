---
id: FR-080-001
title: "Nature declared once at the master, inherited by every SKU"
delivery: implemented
legacy: [FR-201, BR-038]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]

---

# FR-080-001 — Nature declared once at the master, inherited by every SKU

The system SHALL fix `ProductMaster.nature` (GOOD or SERVICE) at creation with a
`defaultStockPolicy` for GOOD; every SKU under a SERVICE master SHALL be
`stockPolicy: SERVICE` (a request for anything else refused,
`INVENTORY_NATURE_MISMATCH`); every SKU under a GOOD master SHALL be TRACKED or
UNTRACKED, never SERVICE; a service SKU SHALL be stored with `safetyStock: 0`,
`trackingMode: NONE` and no replenishment parameters. The system SHALL list one
class at a time by `nature`/`stockPolicy` query and report `services` as its own
stock-summary count.

## Acceptance criteria

- AC-080-001-01 — Given a SERVICE master, when a SKU under it is created with `stockPolicy: TRACKED`, then it is refused with `INVENTORY_NATURE_MISMATCH`.
- AC-080-001-02 — Given a legacy master backfilled where all its SKUs were SERVICE, when the migration runs, then the master's `nature` becomes SERVICE.
- AC-080-001-03 — Given a service left under a GOOD master (a pre-existing inconsistency), when the hygiene report runs, then it is reported as a finding rather than silently accepted or silently fixed.

## Implementation

- `apps/server/src/modules/inventory/domain/inventory-governance.js` (`natureRule`), `application/inventory-catalog-service.js`, `apps/server/src/app/api/inventory/products/route.js`

## Verification

- TC-080-001 — Nature inheritance, mismatch refusal, migration backfill (see [verification.md](../verification.md))
