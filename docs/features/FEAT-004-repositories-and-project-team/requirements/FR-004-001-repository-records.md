---
id: FR-004-001
title: "Repository records"
delivery: live
legacy: [FR-008]
relations:
  specified_by: [API-071, API-074, API-073]
---

# FR-004-001 — Repository records

The system SHALL store Repository records as local metadata (provider, external repo id,
owner/repo/full name, URL, default branch, status) with a unique human code (`REP…`) and
link them to Projects many-to-many through ProjectRepository rows carrying `role`
(default PRIMARY), optional `pathScope` and `branch`; links SHALL be removable.

## Acceptance criteria

- AC-004-001-01 — Given an owned Project and an owned Repository, when linked with role PRIMARY and branch `main`, then a ProjectRepository row exists and an AuditEvent `PROJECT_REPOSITORY/LINKED` is recorded.
- AC-004-001-02 — Given a link id, when deleted, then the row is removed and `UNLINKED` is audited.

## Implementation

- apps/server/src/modules/project-manager/application/repository-service.js; apps/server/src/app/api/repositories/**; apps/server/src/app/(pm)/repositories/page.jsx; apps/server/src/app/(pm)/projects/[projectId]/repositories/page.jsx

## Verification

- TC-004-001 — Repository records and links (see [verification.md](../verification.md))
