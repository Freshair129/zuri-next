---
id: FR-044-004
title: "Batch write is server-owned, transactional and rollbackable"
delivery: live
legacy: [FR-078 (split 4/5)]
relations:
  specified_by: [SDD-044]
---

# FR-044-004 — Batch write is server-owned, transactional and rollbackable

The system SHALL write an approved batch only after the schema, privacy/owner,
backup and dry-run gates pass, in one server-side transaction that publishes no partial
batch, recording a `CustomerImportBatch` with counts and a receipt; a batch rollback
SHALL reverse new Customers, restore updated rows from the verified backup and never
hard-delete or re-home a shared Person.

## Acceptance criteria

- AC-044-004-01 — Given an applied batch, when its rollback runs, then only rows of that batch change and a rollback receipt lists them.

## Verification

- TC-044-002 — Target schema and batch migration (see [verification.md](../verification.md))
