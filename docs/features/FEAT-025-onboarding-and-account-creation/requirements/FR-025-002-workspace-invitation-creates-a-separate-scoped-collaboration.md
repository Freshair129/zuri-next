---
id: FR-025-002
title: "Workspace invitation creates a separate, scoped collaboration grant"
delivery: live
legacy: [FR-067]
relations:
  specified_by: [SDD-025]
  decided_by: [ADR-020]
---

# FR-025-002 — Workspace invitation creates a separate, scoped collaboration grant

An authorized Workspace/Tenant owner SHALL be able to issue a scoped,
expiring, single-use invite that creates a separate `WorkspaceMembership`.
Workspace membership SHALL grant only Workspace collaboration visibility;
Tenant, Business, Space and Project access SHALL require a separate,
server-authorized assignment. Replaying a consumed token or accepting an
expired one SHALL fail closed and be audited.

## Acceptance criteria

- AC-025-002-01 — Given an accepted Workspace invite, when the new WorkspaceMembership is checked against `resolveViewer`, then it contributes no `visibleBusinessIds`, `ownedBusinessIds` or domain grant. entity holds separate authority.
- AC-025-002-02 — Given a consumed invite token replayed a second time, when it is presented, then acceptance is refused with the same generic `INVALID_OR_EXPIRED_INVITE` error an expired token would produce.

## Implementation

- `apps/server/src/app/api/workspace-invites/**`, `apps/server/src/app/api/workspace-memberships/route.js`, `apps/server/src/modules/identity/{workspace-membership-service.js,workspace-collaboration-view.js}`

## Verification

- TC-025-002 — Workspace invite acceptance and replay refusal (see [verification.md](../verification.md))
