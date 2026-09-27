---
id: FR-063-003
title: "Agent supply-chain tools (SmartGift)"
delivery: implemented
legacy: [FR-181]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-063-003 — Agent supply-chain tools (SmartGift)

The system SHALL expose the supply chain to the agent through exactly six
tools and through no other path: three Gate E read-only descriptors
(`check_inventory_atp`, `calculate_smartgift_quote`, `audit_battery_lots`)
and three Gate F write actions (`create_quote_stock_reservation` at `LOW`
sensitivity; `dispatch_customization_work_order` and
`dispatch_kitting_work_order` at `HIGH`, so the action gate demands step-up
before stock is irreversibly branded or consumed). Every tool SHALL call
the same Inventory/Commerce application service a human console surface
would call, with the same viewer and therefore the same authority ladder —
no tool SHALL query Prisma directly for business data, and none SHALL
reach a Business the caller has not already proven. `calculate_smartgift_quote`
SHALL state absorbed freight explicitly (`freightSatang: 0,
freightAbsorbedSatang: <n>`) so a quote can never present it as a separate
line item.

## Acceptance criteria

- AC-063-003-01 — Given a SKU resolved by a FlowAccount finished-set code, when `check_inventory_atp` runs, then the buildable count comes from the recipe's bill of materials against Available-to-Promise, never from raw on-hand quantity, for a finished set.
- AC-063-003-02 — Given a destination matching `REMOTE_DESTINATION_PATTERN` (an island crossing, e.g. เกาะ/Samui/Phangan), when a quote is calculated, then the single-drop truck cost is not silently absorbed into the unit valuation — remote delivery is priced as Commerce's own separate line (BR-072).
- AC-063-003-03 — Given `dispatch_customization_work_order` invoked with no `stepUpToken`, when the action gate runs, then it is refused pending step-up (HIGH sensitivity, FR-061-002) and no stock is branded.
- AC-063-003-04 — Given any of the six tools invoked for a Business the caller's AuthContext does not already include, when the underlying Inventory/Commerce service runs its own viewer check, then the same refusal a human console call would receive is returned (FR-003-009 shape) — the tool grants no additional authority.

## Implementation

- `apps/server/src/modules/agent/tools/smartgift-inventory-tools.js`, `apps/server/src/modules/commerce/application/pricing-inventory-service.js`
