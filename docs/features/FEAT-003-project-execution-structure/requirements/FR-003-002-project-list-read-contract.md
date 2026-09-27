---
id: FR-003-002
title: "Project list read contract"
delivery: live
legacy: [FR-003 (split 2/2 — list contract)]
relations:
  specified_by: [API-069]
  derived_from: [SEC-001]
---

# FR-003-002 — Project list read contract

The system SHALL answer `GET /api/projects` (default `view=list`) with
`{ items, limit, truncated }`, where each item carries `id, code, name, description, type,
status, businessId, workspaceId, workspace{code,name,scopeType}`, ISO `startAt/targetAt`
and `workstreamCount` (non-deleted), and no Prisma relation graph. Filters `workspaceId`,
`businessId`, `tenantId`, `status`, `q` (trimmed substring over name/code) compose with AND;
`businessId` filters the direct owner (shared null-owner Projects are never attributed);
archived Projects are never returned; order is `updatedAt DESC, id DESC`; the hard limit is
500 and `truncated` is set by reading one extra row. `view ∈ {overview, timeline, workspace}`
SHALL return the relation-rich compatibility arrays for their existing consumers only.
A non-operator SHALL receive only Projects of Businesses (or Workspaces) they see; naming an
invisible Business or Workspace SHALL yield 404.

## Acceptance criteria

- AC-003-002-01 — Given `status=ARCHIVED`, then `items` is empty.
- AC-003-002-02 — Given 501 matching Projects, then 500 items and `truncated: true`.
- AC-003-002-03 — Given `businessId` of an invisible Business, then 404 "Business not found".

## Implementation

- apps/server/src/modules/project-manager/application/project-list-read-model.js; project-service.js (`listProjects*`); apps/server/src/app/api/projects/route.js

## Verification

- TC-003-002 — Project list contract (see [verification.md](../verification.md))
