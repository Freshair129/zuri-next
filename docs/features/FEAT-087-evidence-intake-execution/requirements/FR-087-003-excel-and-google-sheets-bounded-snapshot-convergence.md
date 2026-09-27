---
id: FR-087-003
title: "Excel and Google Sheets bounded snapshot convergence"
delivery: live
legacy: [FR-139, FR-134]
relations:
  specified_by: [SDD-087]
  decided_by: [ADR-079]

---

# FR-087-003 — Excel and Google Sheets bounded snapshot convergence

The system SHALL let a data steward import a generated Asset workbook or a bounded
Google Sheets row snapshot through the same canonical row adapter and deterministic
envelope validator used by every other surface, returning sheet/row/column issues and
performing no hidden apply; export SHALL produce a bounded, Google-Sheets-importable
`.xlsx` snapshot that is never treated as the Asset register or an authority source.

## Acceptance criteria

- AC-087-003-01 — Given a workbook with one row missing a required column, when imported, then that row is reported with a specific sheet/row/column issue and nothing from that row is applied, while valid rows in the same import may still preview.
- AC-087-003-02 — Given a Google Sheets snapshot (spreadsheet id, revision, range, bounded row array), when converted, then it is hashed server-side and produces the identical preview shape a workbook import would for the same logical rows.
- AC-087-003-03 — Given an export, when opened, then it round-trips through the same import validator without becoming the source Asset Management reads from on its own.

## Implementation

- `apps/server/src/app/api/assets/import/xlsx/route.js`, `.../sheets/route.js`, `.../template/route.js`, `apps/server/src/app/api/assets/intakes/export/route.js`

## Verification

- TC-087-004 — Workbook/Sheet snapshot convergence (see [verification.md](../verification.md))
