---
id: FR-003-001
title: "Project create, update and archive"
delivery: live
legacy: [FR-003 (split 1/2 — CRUD and archive)]
relations:
  specified_by: [SDD-003, API-069, API-051]
  derived_from: [BR-047, BR-048]
---

# FR-003-001 — Project create, update and archive

The system SHALL create a Project in a Workspace with a unique human code (`PRJ…`
generated when absent), `type` (default GENERAL), `status` from `PROJECT_STATUSES`
(PLANNED, ACTIVE, ON_HOLD, DONE, ARCHIVED; default PLANNED) and optional description,
start/target dates, priority and PIC; SHALL update any of those fields with `version`
incremented; and SHALL archive a Project softly (`status = ARCHIVED`, `deletedAt` set).
Archived Projects SHALL be treated as not found by every read and write. Execution mode
belongs to Workstreams, so one Project may mix modes (BR-048).

## Acceptance criteria

- AC-003-001-01 — Given an owned BUSINESS Workspace, when a Project is created without code, then it gets a `PRJ…` code, status PLANNED and an AuditEvent `PROJECT/CREATED`.
- AC-003-001-02 — Given an archived Project, when it is patched or read by id, then 404 is returned.
- AC-003-001-03 — Given two Workstreams with modes SOFTWARE_SPRINT and B2B_SALES under one Project, then both persist.

## Implementation

- apps/server/src/modules/project-manager/application/project-service.js; apps/server/src/app/api/projects/route.js; apps/server/src/app/api/projects/[id]/route.js; apps/server/src/app/(pm)/projects/page.jsx

## Verification

- TC-003-001 — Core model CRUD and invariants (see [verification.md](../verification.md))
- TC-003-006 — Governing-Business write authorization (see [verification.md](../verification.md))
