---
id: FR-080-002
title: "Variant identity: one physical variant, one SKU"
delivery: implemented
legacy: [FR-202, BR-039]
relations:
  specified_by: [SDD-080]
  decided_by: [ADR-073]

---

# FR-080-002 — Variant identity: one physical variant, one SKU

The system SHALL let `ProductMaster.variantAxes` declare the ordered axes that
distinguish its SKUs (fixed at creation); each SKU SHALL carry `variant` (one value
per declared axis — a missing axis `INVENTORY_VARIANT_AXES_INCOMPLETE`, an
undeclared one `INVENTORY_VARIANT_AXIS_UNKNOWN`); the system SHALL derive
`variantKey` (normalized `axis=value|axis=value`), unique per master across
archived and live rows, refusing a duplicate combination
(`INVENTORY_PRODUCT_VARIANT_EXISTS`, naming the first; REACTIVATE is the fix when
the first is archived). A master declaring no axes SHALL instead apply an
exact-match lookalike guard (`INVENTORY_PRODUCT_LOOKALIKE` on matching normalized
name/colour/material/variant) unless the caller passes `allowLookalike` (audited).

## Acceptance criteria

- AC-080-002-01 — Given a master with axes `["color","size"]` and an existing SKU `{color: red, size: M}`, when a second SKU with the identical combination is created, then it is refused naming the first SKU.
- AC-080-002-02 — Given that first SKU is archived, when a new SKU with the same combination is created, then `REACTIVATE` on the archived one is offered as the fix (per the domain's stated behavior), not a second live row.
- AC-080-002-03 — Given a master with no declared axes, when two SKUs with identical normalized name/colour/material/variant are created without `allowLookalike`, then the second is refused with `INVENTORY_PRODUCT_LOOKALIKE`.

## Implementation

- `apps/server/src/modules/inventory/domain/inventory-governance.js` (`variantKeyFor`, `lookalikeFingerprint`)

## Verification

- TC-080-002 — Variant key uniqueness and lookalike guard (see [verification.md](../verification.md))
