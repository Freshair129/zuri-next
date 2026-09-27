---
id: FR-080-007
title: "Replenishment suggestion, never a purchase order"
delivery: implemented
legacy: [FR-207, ADR-066]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]

---

# FR-080-007 — Replenishment suggestion, never a purchase order

The system SHALL let a SKU declare nullable `reorderPoint`, `reorderQty`,
`leadTimeDays` (refused on a service) and SHALL list every counted, ACTIVE SKU whose
on-hand is below `reorderPoint ?? safetyStock`, with `suggestedQty = reorderQty ??
(threshold − onHand)` and lead time. A phased-out or archived SKU SHALL never be
suggested. Turning a suggestion into an order SHALL remain Procurement's, never
written here.

## Acceptance criteria

- AC-080-007-01 — Given a counted SKU with on-hand 3 and `reorderPoint: 10, reorderQty: 50`, when replenishment is read, then it is listed with `suggestedQty: 50`.
- AC-080-007-02 — Given a PHASE_OUT SKU below its reorder point, when replenishment is read, then it is never listed.

## Implementation

- `apps/server/src/modules/inventory/domain/inventory-governance.js` (`replenishmentRow`), `apps/server/src/app/api/inventory/replenishment/route.js`

## Verification

- TC-080-007 — Replenishment suggestion and phase-out exclusion (see [verification.md](../verification.md))
