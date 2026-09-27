---
id: FR-017-007
title: "ProjectFile migration to managed assets"
delivery: live
legacy: [FR-045 (split 6/7 — migration)]
relations:
  specified_by: [API-032]
  depends_on: [FEAT-001]
---

# FR-017-007 — ProjectFile migration to managed assets

The system SHALL migrate legacy ProjectFile rows into FileAssets through a dry-run then confirm call
restricted to an installation operator, reporting every row as migrated, rejected or conflicting —
never silently dropped.

## Acceptance criteria

- AC-017-007-01 — Given a non-operator, then the migration answers 404.
- AC-017-007-02 — Given a ProjectFile without url or blobRef, then it appears in the rejected report.

## Verification

- TC-017-002 — Managed assets, ingest and migration (see [verification.md](../verification.md))
