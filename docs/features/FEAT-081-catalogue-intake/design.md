---
id: SDD-081
title: "Catalogue intake — resolve before it creates — design"
---

# SDD-081 — Catalogue intake — resolve before it creates design

- **Components:**
  - `CMP-229` — `domain/catalog-intake.js` (envelope, pure
    resolve-before-create planner, payload/plan hashes),
    `application/catalog-intake-service.js` (preview/commit/cancel/read).
  - `CMP-231` — `import/catalog-workbook.js` (Excel template and
    reader).
  - `CMP-230` — `import/catalog-line-command.js` (parser,
    reply formatters) + `agent/line-catalog-command.js` (`withLineCatalogCommand`,
    `lineCatalogViewer`, in the Agent Runtime module but consuming this domain's
    envelope/planner).
- **Data owned:** `InventoryCatalogIntake` (preview + plan + result; no catalogue
  data of its own — created SKUs are written by FEAT-077/004's writers).
- **Contracts exposed:** `API-197`, `API-198`.
- **Contracts consumed:** FEAT-077's catalogue writers (accept a transaction
  client, `inTx`), FEAT-080's identifier/variant/lifecycle guards (the planner
  re-checks them against the batch).
- **Main sequence** (any surface → preview → commit):
  1. JSON/Excel/LINE all produce the same `InventoryCatalogIntake` envelope shape.
  2. The pure planner resolves each item (MATCH/CREATE/CONFLICT/INVALID) against
     today's catalogue and the rest of the batch.
  3. `preview` persists the plan + hash, idempotent on correlation.
  4. `commit` re-plans in one transaction, refuses on staleness/non-committable
     items/expiry, else runs every planned action through the existing writers.
- **Failure modes:** identifier/SKU-code CONFLICT refuses that item (not the whole
  envelope, until commit where any CONFLICT blocks the whole commit); stale plan at
  commit refused; expired/cancelled preview refused; workbook not matching the
  contract shape refused wholesale; unverified/unauthorized LINE sender falls
  through with no domain effect.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-081-001 | `apps/server/src/modules/inventory/domain/catalog-intake.js`, `application/catalog-intake-service.js`, `apps/server/src/app/api/inventory/catalog-intakes/preview/route.js`, `.../commit/route.js`, `.../route.js`, `.../[id]/route.js` |
| FR-081-002 | `apps/server/src/modules/inventory/import/catalog-workbook.js`, `apps/server/src/app/api/inventory/catalog-intakes/template/route.js`, `.../xlsx/route.js`, `apps/server/src/app/(pm)/inventory/catalog-intake/page.jsx` |
| FR-081-003 | `apps/server/src/modules/inventory/import/catalog-line-command.js`, `apps/server/src/modules/agent/line-catalog-command.js`, `apps/server/src/app/api/line-oa/worker/route.js` |
