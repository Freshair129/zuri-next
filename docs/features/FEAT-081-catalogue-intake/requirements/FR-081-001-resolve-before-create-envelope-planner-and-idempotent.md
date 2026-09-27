---
id: FR-081-001
title: "Resolve-before-create envelope, planner and idempotent preview/commit"
delivery: implemented
legacy: [FR-208, BR-041]
relations:
  specified_by: [SDD-081]
  decided_by: [ADR-074]

---

# FR-081-001 — Resolve-before-create envelope, planner and idempotent preview/commit

The system SHALL convert every surface (JSON/Excel/LINE) into one
`InventoryCatalogIntake` envelope v1 (businessId, source channel + correlationId,
1–500 items), validating items individually so one bad row is an INVALID item, not
a rejected envelope. The planner SHALL resolve each valid item first by active
identifiers, then by SKU code (following a merge to its survivor): two different
resolved SKUs is a CONFLICT; one SKU is a MATCH that only adds identifiers/
conversions it lacks, never overwriting; a CREATE SHALL still pass every FEAT-080
guard against the catalogue and the rest of the batch (duplicate code/identifier/
variant key/description within the batch is a CONFLICT). `POST .../preview` SHALL
persist the plan with its `planHash`, idempotent on (Business, channel,
correlation) — the identical payload re-previews against today's catalogue, a
committed/cancelled one replays, a different payload under the same correlation is
refused (`INVENTORY_CATALOG_INTAKE_CORRELATION_REUSED`). `POST .../commit` SHALL
re-plan inside one transaction, refusing a changed plan
(`INVENTORY_CATALOG_INTAKE_PLAN_STALE`), any CONFLICT/INVALID item
(`INVENTORY_CATALOG_INTAKE_NOT_COMMITTABLE`), an expired preview (24h; 30 min from
LINE) or a cancelled one, then run every action through the existing catalogue
writers in that transaction so a refusal rolls back the whole batch.

## Acceptance criteria

- AC-081-001-01 — Given an envelope with one item resolving by identifier to SKU A and another item's SKU code also resolving to a different SKU B, when planned, then that item is a CONFLICT, not silently resolved to either.
- AC-081-001-02 — Given a preview committed successfully, when the same correlation is previewed again with the identical payload, then it replays the same result rather than erroring.
- AC-081-001-03 — Given a preview whose plan has gone stale (catalogue changed since), when commit is attempted, then it is refused with `INVENTORY_CATALOG_INTAKE_PLAN_STALE` and nothing is written.
- AC-081-001-04 — Given a batch containing two items with the same identifier value, when planned, then the second is a CONFLICT against the first, not two independent creates.

## Implementation

- `apps/server/src/modules/inventory/domain/catalog-intake.js`, `application/catalog-intake-service.js`, `apps/server/src/app/api/inventory/catalog-intakes/preview/route.js`, `.../commit/route.js`, `.../route.js`, `.../[id]/route.js`

## Verification

- TC-081-001 — Resolve-before-create planning and conflict detection (see [verification.md](../verification.md))
- TC-081-002 — Idempotent preview/commit and stale-plan refusal (see [verification.md](../verification.md))
