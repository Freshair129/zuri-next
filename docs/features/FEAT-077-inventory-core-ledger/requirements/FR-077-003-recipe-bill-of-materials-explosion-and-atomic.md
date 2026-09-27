---
id: FR-077-003
title: "Recipe (bill of materials) explosion and atomic build"
delivery: building
legacy: [FR-156]
relations:
  specified_by: [SDD-077]
  decided_by: [none]
---

# FR-077-003 — Recipe (bill of materials) explosion and atomic build

The system SHALL let a manager declare one `ProductRecipe` per (output SKU,
`batchSize`) with component `ProductRecipeLine` rows (`qty` per batch, optional
`fixed` for non-scaling lines). A read SHALL explode a requested quantity against
the recipe closest to it (largest batch size that fits, else smallest), compare
against ledger-recomputed on-hand, and state the maximum buildable quantity — a
fractional requirement rounds up to the next whole unit; an uncounted component
never blocks. `POST …/build` SHALL be one transaction issuing every counted
component (FEFO for lots) and receiving the output when it is counted, refusing the
whole build with a per-component shortage list when any is short, and refusing when
a component or the output is SERIAL-tracked or a LOT-tracked output has no
`outputLotCode`.

## Acceptance criteria

- AC-077-003-01 — Given a recipe at batch size 10 requesting quantity 25, when exploded, then scaled lines multiply by `25/10` and fixed lines do not.
- AC-077-003-02 — Given one component short by 2 units, when build is attempted, then the whole build is refused with `INVENTORY_RECIPE_SHORTAGE` naming that component, and no partial issue occurs.
- AC-077-003-03 — Given a LOT-tracked output with no `outputLotCode` supplied, when build is attempted, then it is refused.

## Implementation

- `apps/server/src/modules/inventory/application/inventory-recipe-service.js`, `apps/server/src/app/api/inventory/recipes/route.js`, `.../recipes/[id]/route.js`, `.../recipes/[id]/build/route.js`

## Verification

- TC-077-003 — Recipe explosion and atomic build shortage handling (see [verification.md](../verification.md))
