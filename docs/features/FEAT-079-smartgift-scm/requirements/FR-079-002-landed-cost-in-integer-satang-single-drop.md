---
id: FR-079-002
title: "Landed cost in integer satang, single-drop truck absorbed"
delivery: building
legacy: [FR-175]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]
---

# FR-079-002 — Landed cost in integer satang, single-drop truck absorbed

The system SHALL value every `StockMovement.costSatang` as
`factoryCostSatang + ceil(seaFreight/batch) + ceil(duty/batch) + ceil(inboundTruck/batch) + customizationPerUnit + kittingPerUnit`,
each shared cost divided by the batch and rounded up, with the inbound truck
defaulting to the flat 250,000-satang single-drop rate. Valuation across receipts
SHALL be moving weighted average, recomputed from the ledger.

## Acceptance criteria

- AC-079-002-01 — Given a batch of 100 units with sea freight 50,000 satang and duty 20,000 satang, when landed cost is computed, then each unit's shared-cost component is `ceil(50000/100) + ceil(20000/100)` = 700 satang, never rounded down.
- AC-079-002-02 — Given no explicit inbound truck cost supplied, when landed cost is computed, then the flat 250,000-satang single-drop rate is used, and a standard quote shows delivery as 0.00 (no separate freight line).

## Implementation

- `apps/server/src/modules/inventory/domain/inventory-costing.js`

## Verification

- TC-079-002 — Landed cost rounding and single-drop default (see [verification.md](../verification.md))
