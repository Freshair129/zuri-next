---
id: FR-014-004
title: "Soft delete and cohort restore"
delivery: building
legacy: [FR-252 (split 4/7 — delete/restore)]
relations:
  specified_by: [API-054, API-057]
---

# FR-014-004 — Soft delete and cohort restore

The system SHALL soft-delete a Feature together with its child rows under one `deleteBatchId`,
and restore exactly that cohort, preserving identities and lifecycle; a restore that would push
any WorkItem's allocation above 10000 bps SHALL be refused (409 `ALLOCATION_RESTORE_CONFLICT`).
Deleted Features SHALL be visible only to owners (list `visibility=DELETED`).

## Acceptance criteria

- AC-014-004-01 — Given a deleted Feature, when restored, then its contributions, links and bindings of the same batch return with their original ids.

## Verification

- TC-014-001 — Feature mutations, CAS, idempotency, audit (see [verification.md](../verification.md))
