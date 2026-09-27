---
id: FR-030-002
title: "Scope is a declared value; referential invariants are database-enforced"
delivery: implemented
legacy: [FR-192]
relations:
  specified_by: [SDD-030]
  decided_by: [ADR-023]
---

# FR-030-002 — Scope is a declared value; referential invariants are database-enforced

`Membership.scopeType` SHALL be `TENANT` or `BUSINESS`, held by a CHECK
against `businessId`; `RoleBinding` SHALL take the same grammar (`TENANT`,
`BUSINESS`, `BRANCH`). `ON DELETE RESTRICT` SHALL replace `ON DELETE SET
NULL` on `Membership.businessId`, `Workspace.businessId` and
`Project.businessId`. Tenant ancestry SHALL be a database invariant via
`Business UNIQUE (id, tenantId)` and composite foreign keys. One live grant
per person per scope SHALL be enforced by two partial unique indexes.
`Membership.role` SHALL default to `MEMBER`, never `OWNER`.

## Acceptance criteria

- AC-030-002-01 — Given a request to delete a Business with live Memberships, when the delete runs, then it is refused (RESTRICT), not silently promoted to a Tenant-wide grant.
- AC-030-002-02 — Given an INSERT into `Membership` that omits `role`, when the row is created, then it defaults to `MEMBER`, never `OWNER`.

## Implementation

- `apps/server/src/lib/validation/enums.js`, `apps/server/src/modules/identity/{resolve-viewer.js,viewer-authority.js}`

## Verification

- TC-030-002 — Scope grammar and referential RESTRICT invariants (see [verification.md](../verification.md))
