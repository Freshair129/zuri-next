---
id: FR-004-003
title: "Project Team view over Business memberships"
delivery: live
legacy: [FR-036 (split 1/2 — list and load)]
relations:
  specified_by: [API-066]
---

# FR-004-003 — Project Team view over Business memberships

The system SHALL list, for a Project, the Memberships in its Business scope plus
tenant-wide Memberships, each with the member's count of active (non-deleted, not
DONE/CANCELLED) WorkItems in the Project whose `assigneeRef` is that Person; the list SHALL
require the viewer to see the Project's Business.

## Acceptance criteria

- AC-004-003-01 — Given member P assigned to 3 open items and 1 DONE item, then P's load is 3.

## Implementation

- apps/server/src/modules/project-manager/application/project-team-service.js; apps/server/src/app/api/projects/[id]/team/route.js; apps/server/src/app/(pm)/projects/[projectId]/team/page.jsx

## Verification

- TC-004-003 — Project Team service and authorization (see [verification.md](../verification.md))
