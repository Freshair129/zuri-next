---
id: FR-024-004
title: "Users & Permissions read scope matches administration authority"
delivery: live
legacy: [FR-062]
relations:
  specified_by: [SDD-024]
---

# FR-024-004 — Users & Permissions read scope matches administration authority

`GET /api/platform/users` SHALL return only Memberships the caller may
actually administer — those whose Business is in `viewer.ownedBusinessIds`.
Tenant-wide Memberships (`businessId: null`) SHALL be returned only for
tenants where the caller owns a Business, never unconditionally, and each row
SHALL carry a server-decided `manageable` flag; the client SHALL render a
non-manageable row read-only rather than inferring editability itself. The
response SHALL NOT carry `Person.email`.

## Acceptance criteria

- AC-024-004-01 — Given a caller who owns Business A but not Business B, when they call `GET /api/platform/users`, then rows scoped to Business B are absent.
- AC-024-004-02 — Given a returned row for a Business the caller does not own, when the client renders it, then it renders read-only, driven by the server's `manageable: false`.

## Implementation

- `apps/server/src/app/(pm)/platform/users/page.jsx`, `apps/server/src/modules/identity/profile-permission-service.js`

## Verification

- TC-024-001 — Users & Permissions authority and read scope (see [verification.md](../verification.md))
