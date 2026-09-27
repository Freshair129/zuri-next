---
id: FR-007-004
title: "Import target authorization"
delivery: live
legacy: [FR-065]
relations:
  specified_by: [API-039, API-038, API-041]
  derived_from: [BR-002, SEC-001, SEC-007]
---

# FR-007-004 — Import target authorization

The system SHALL resolve the viewer and the target Workspace (explicit `workspaceId`, else the
named Project's Space) before parsing the plan, on dry run, commit and workbook upload alike.
A BUSINESS Workspace SHALL require `ownsBusiness(viewer, workspace.businessId)`; a
visible-but-unowned or nonexistent target SHALL receive the same refusal; a PORTFOLIO/TENANT
Workspace SHALL be refused for every principal with a reason stating that no authority above
Business is declared. Nothing about the plan's contents SHALL be disclosed on refusal.

## Acceptance criteria

- AC-007-004-01 — Given a viewer who sees but does not own Business B, when they dry-run into B's Space, then the answer equals the answer for a random Workspace id and no preview is returned.
- AC-007-004-02 — Given a TENANT Workspace, then refusal text names the missing above-Business authority.

## Implementation

- apps/server/src/modules/project-manager/import/import-authorization.js; plan-import-service.js (`resolveAuthorizedTarget`)

## Verification

- TC-007-003 — Import target authorization (see [verification.md](../verification.md))
