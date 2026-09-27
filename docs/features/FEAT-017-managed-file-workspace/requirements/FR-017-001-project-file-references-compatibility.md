---
id: FR-017-001
title: "Project file references (compatibility)"
delivery: live
legacy: [FR-037]
relations:
  specified_by: [API-063, API-062]
  derived_from: [BR-002, SEC-003]
---

# FR-017-001 — Project file references (compatibility)

The system SHALL keep Project file references (`ProjectFile`: UUID + human code, name, mime, size,
version, optional WorkItem, uploader) that require a non-empty `url` or `blobRef`, create and delete
them only for the Project's governing-Business owner, audit each create/delete, and serve them at
`/projects/{id}/files` through a compatibility boundary until migrated to managed assets.

## Acceptance criteria

- AC-017-001-01 — Given neither `url` nor `blobRef`, then the create is refused.
- AC-017-001-02 — Given a visible-but-unowned Project, then create answers as not found.

## Implementation

- apps/server/src/modules/project-manager/application/project-file-service.js; apps/server/src/app/api/projects/[id]/files/**; apps/server/src/app/(pm)/projects/[projectId]/files/page.jsx

## Verification

- TC-017-001 — Project file references (see [verification.md](../verification.md))
- TC-017-004 — Reconcile, cache and reveal (see [verification.md](../verification.md))
