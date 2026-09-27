---
id: FR-001-003
title: "Workspace update and archive"
delivery: live
legacy: [FR-001 (split 3/3 — workspace update/archive)]
relations:
  specified_by: [API-083]
  decided_by: [ADR-002]
  derived_from: [BR-002]
---

# FR-001-003 — Workspace update and archive

The system SHALL let a caller rename a Workspace, change its status, or archive it
(`status = ARCHIVED`, soft) only when the caller owns the Workspace's governing Business;
a Workspace scoped above Business (PORTFOLIO/TENANT) SHALL be refused for every principal
with a reason naming the missing authority. Archived Workspaces SHALL be excluded from
scope listings. Every change increments `version` and records an AuditEvent.

## Acceptance criteria

- AC-001-003-01 — Given a BUSINESS Workspace of an unowned Business, when PATCH is sent, then the answer is the same 404 as for a nonexistent id.
- AC-001-003-02 — Given a TENANT-scoped Workspace, when any principal archives it, then it is refused with the missing-authority reason.
- AC-001-003-03 — Given an unknown id, when DELETE is sent, then 404 is returned (not a 500).

## Implementation

- apps/server/src/app/api/workspaces/[id]/route.js; scope-service.js (`updateWorkspace`, `archiveWorkspace`); application/project-authorization.js

## Verification

- TC-001-002 — Workspace mutation authorization (see [verification.md](../verification.md))
