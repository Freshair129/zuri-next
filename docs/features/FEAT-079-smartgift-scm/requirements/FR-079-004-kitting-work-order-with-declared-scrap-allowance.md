---
id: FR-079-004
title: "Kitting work order with declared scrap allowance and FlowAccount code"
delivery: building
legacy: [FR-177]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]
---

# FR-079-004 — Kitting work order with declared scrap allowance and FlowAccount code

The system SHALL let a `KittingWorkOrder` explode one `ProductRecipe` for a planned
quantity, issuing `ceil(net × (1 + scrapAllowanceFactor))` gross (a fraction in
[0, 0.20], default 0 so every pre-existing recipe explodes exactly as before) up
front. Completion SHALL consume components, record assembled/scrapped quantities,
blend component landed cost plus packaging/assembly labour into the finished unit's
`costSatang`, and receive the set at `TH_FINISHED_GOODS`. The output SHALL carry a
`Product.flowAccountSku` matching `^[A-Z0-9]+-[0-9]+\([A-Z0-9_-]+\)$`; a run without
one SHALL be refused.

## Acceptance criteria

- AC-079-004-01 — Given a recipe with `scrapAllowanceFactor: 0.1` and net requirement 100, when a kitting run issues components, then it issues `ceil(100 × 1.1)` = 110 gross up front.
- AC-079-004-02 — Given an output SKU with no `flowAccountSku` set, when kitting completion is attempted, then it is refused.
- AC-079-004-03 — Given a recipe written before this requirement (`scrapAllowanceFactor` unset), when exploded, then it defaults to 0 and explodes exactly as it did before this feature.

## Implementation

- `apps/server/src/modules/inventory/application/kitting-work-order-service.js`, `apps/server/src/app/api/inventory/kitting-work-orders/**`

## Verification

- TC-079-004 — Kitting scrap allowance and FlowAccount code guard (see [verification.md](../verification.md))
