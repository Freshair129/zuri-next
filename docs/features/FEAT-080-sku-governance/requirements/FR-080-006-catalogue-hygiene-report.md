---
id: FR-080-006
title: "Catalogue hygiene report"
delivery: implemented
legacy: [FR-206]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]
---

# FR-080-006 — Catalogue hygiene report

The system SHALL expose a read-only, pure-function hygiene report over the
catalogue and ledger returning findings of kind `NATURE_MISMATCH`,
`LOOKALIKE_SKUS`, `MASTER_WITHOUT_AXES`, `MASTER_WITHOUT_SKUS`, `DORMANT_SKU`
(counted, zero on-hand, no movement within `dormantDays`, default 180),
`SKU_WITHOUT_IDENTIFIER`, `SERVICE_WITH_STOCK_FIELDS` and `PHASE_OUT_WITH_STOCK`,
each with severity, named rows, a Thai message and the repairing action, sorted most
severe first with counts by kind/severity. The report SHALL write nothing.

## Acceptance criteria

- AC-080-006-01 — Given a GOOD master with 2 live SKUs and no declared `variantAxes`, when the report runs, then it includes a `MASTER_WITHOUT_AXES` finding for that master.
- AC-080-006-02 — Given a counted SKU with zero on-hand and no movement in 200 days (default `dormantDays: 180`), when the report runs, then it is flagged `DORMANT_SKU`.

## Implementation

- `apps/server/src/modules/inventory/domain/inventory-governance.js` (`hygieneReport`), `apps/server/src/app/api/inventory/catalog-hygiene/route.js`

## Verification

- TC-080-006 — Hygiene report findings (see [verification.md](../verification.md))
