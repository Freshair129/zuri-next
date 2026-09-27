---
id: FR-021-003
title: "Snapshot export"
delivery: live
legacy: [FR-013 (split 1/2 — export)]
relations:
  specified_by: [API-002]
---

# FR-021-003 — Snapshot export

The system SHALL export, for an installation operator only (use recorded), a snapshot with schema
version `1.0`, export time, rows of every model in the snapshot model list (ordered for foreign-key
safe restore), per-domain recovery manifests, and binary file content only when explicitly requested;
every schema model SHALL be either in the snapshot list or in the excluded list with a stated reason
(e.g. sessions, plugin credentials, rate-limit buckets, device credentials).

## Acceptance criteria

- AC-021-003-01 — Given a new schema model in neither list, then the backup contract test fails.
- AC-021-003-02 — Given `includeBinaryContent` absent, then no file bytes are in the snapshot.

## Implementation

- apps/server/src/modules/project-manager/application/backup-service.js; apps/server/src/app/api/backup/export/route.js; apps/server/src/app/api/backup/import/route.js; apps/server/src/app/(pm)/backup/page.jsx

## Verification

- TC-021-002 — Snapshot export/import (see [verification.md](../verification.md))
