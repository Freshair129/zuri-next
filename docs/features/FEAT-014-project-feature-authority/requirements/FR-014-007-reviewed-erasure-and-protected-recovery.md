---
id: FR-014-007
title: "Reviewed erasure and protected recovery"
delivery: building
legacy: [FR-252 (split 7/7 — erasure and recovery)]
relations:
  depends_on: [FR-029-005]
  derived_from: [SEC-029]
---

# FR-014-007 — Reviewed erasure and protected recovery

The system SHALL erase Project Feature text only for targets carried in a server-reviewed
erasure manifest (canonical digest excluding advisory fields) inside Identity's existing erasure
transaction, never inferring a subject from authorship, receipts, names or text search; and SHALL
include the six Feature tables in backup snapshots, restoring them only into a validated clean
target.

## Acceptance criteria

- AC-014-007-01 — Given a manifest whose digest does not match, then nothing is erased.

## Implementation

- application/project-feature-erasure.js; application/phase-b-backup.js; application/backup-service.js

## Verification

- TC-014-004 — Erasure and recovery (see [verification.md](../verification.md))
