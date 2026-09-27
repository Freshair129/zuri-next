---
id: FR-081-002
title: "Excel converter, never a second source of truth"
delivery: implemented
legacy: [FR-209]
relations:
  specified_by: [SDD-081]
  decided_by: [ADR-074]
---

# FR-081-002 — Excel converter, never a second source of truth

The system SHALL serve `GET .../catalog-intakes/template` as a workbook whose
`Products` sheet header row is the contract (dropdowns from the enum registry, a
`Lookups` sheet of that Business's own categories/masters). `POST
.../catalog-intakes/xlsx` (multipart, ≤5 MiB, Inventory write authority checked
before the file is read) SHALL convert every non-blank row into an envelope item
without judging a cell (a malformed value reaches item validation and comes back as
an INVALID row with its path), refusing only a file that is not the contract shape,
and SHALL preview under correlation `xlsx:<sha256 of file>` so identical bytes
preview idempotently.

## Acceptance criteria

- AC-081-002-01 — Given a workbook with a malformed number in one cell, when converted, then that row comes back as an INVALID item with a path, while other valid rows still preview.
- AC-081-002-02 — Given a file missing the `Products` sheet entirely, when uploaded, then the whole file is refused before any row is converted.
- AC-081-002-03 — Given the identical workbook bytes uploaded twice, when previewed both times, then both previews resolve to the same correlation (`xlsx:<hash>`) idempotently.

## Implementation

- `apps/server/src/modules/inventory/import/catalog-workbook.js`, `apps/server/src/app/api/inventory/catalog-intakes/template/route.js`, `.../xlsx/route.js`, `apps/server/src/app/(pm)/inventory/catalog-intake/page.jsx`

## Verification

- TC-081-003 — Excel conversion, per-row INVALID, contract-shape refusal (see [verification.md](../verification.md))
- TC-081-005 — Console Import tab end-to-end (see [verification.md](../verification.md))
