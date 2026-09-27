---
id: SDD-030
title: "Access Grant Lifecycle — design"
---

# SDD-030 — Access Grant Lifecycle design

- **Components:** `CMP-043`
  (`membership-lifecycle-service.js`, `membership-grant-service.js`).
- **Data owned:** `Membership` (provenance + lifecycle columns),
  `RoleBinding` (`scopeType`, `cascadeOfMembershipId`).
- **Contracts exposed:** consumed through `API-091`'
  lifecycle sub-route.
- **Contracts consumed:** `DOM-PRJ` `Business`/`Workspace`/`Project` ancestry
  (RESTRICT delete dependency).
- **Main sequence:** 1. Owner selects a Membership row and an action
  (suspend/reinstate/revoke) with a reason. 2. The service checks
  `LAST_OWNER`, cascades to dependent RoleBindings, writes the
  provenance/end columns, and records an audit event. 3. `resolveViewer`
  reads `status`/`expiresAt` fresh on the next request.
- **Failure modes:** action would strand a Business/Tenant with no live
  owner → 409 `LAST_OWNER`; reason omitted → refused at the API boundary;
  a write attempted from outside `src/modules/identity/` → preflight
  failure, not a runtime error.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-030-001 | `apps/server/src/app/api/platform/users/memberships/[id]/lifecycle/route.js`, `apps/server/src/app/api/platform/users/offboard/route.js`, `apps/server/src/modules/identity/{membership-lifecycle-service.js,membership-grant-service.js,erase-principal.js}` |
| FR-030-002 | `apps/server/src/lib/validation/enums.js`, `apps/server/src/modules/identity/{resolve-viewer.js,viewer-authority.js}` |
