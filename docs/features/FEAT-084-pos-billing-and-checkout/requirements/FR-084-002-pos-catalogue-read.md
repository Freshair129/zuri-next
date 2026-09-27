---
id: FR-084-002
title: "POS catalogue read"
delivery: building
legacy: [FR-183 (split 2/2 — catalogue read sub-behavior of the same PRD row)]
relations:
  specified_by: [SDD-084]
  decided_by: [ADR-076]
---

# FR-084-002 — POS catalogue read

The system SHALL expose a same-Business active-product catalogue read with
recomputed stock for POS use, deriving no price from inventory cost and applying no
fallback price.

## Acceptance criteria

- AC-084-002-01 — Given an active SKU with on-hand stock, when the POS catalogue is read, then the response shows current recomputed stock and no cost-derived price field.

## Implementation

- `apps/server/src/app/api/commerce/pos/catalogue/route.js`
