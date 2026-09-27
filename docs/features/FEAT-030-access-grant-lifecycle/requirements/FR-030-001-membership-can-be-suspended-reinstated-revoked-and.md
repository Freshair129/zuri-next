---
id: FR-030-001
title: "Membership can be suspended, reinstated, revoked and offboarded"
delivery: implemented
legacy: [FR-191]
relations:
  specified_by: [SDD-030]
  decided_by: [ADR-023]
---

# FR-030-001 — Membership can be suspended, reinstated, revoked and offboarded

`suspendMembership`, `reinstateMembership`, `revokeMembership` and
`offboardPerson` SHALL each require a mandatory reason, SHALL cascade to
dependent `RoleBinding` rows, and SHALL refuse 409 `LAST_OWNER` rather than
leaving a Business with no live OWNER. A revoked grant SHALL NEVER be
deleted; a partial unique index (`status <> 'REVOKED'`) SHALL let the same
scope be granted again as a new row. `resolveViewer` SHALL additionally deny
a grant past its `expiresAt`. `Membership` SHALL be written only from
`src/modules/identity/`, enforced by a preflight ratchet.

## Acceptance criteria

- AC-030-001-01 — Given the only live OWNER of a Business, when `revokeMembership` is called on that grant, then it refuses 409 `LAST_OWNER`.
- AC-030-001-02 — Given a suspended Membership, when it is later reinstated, then exactly the RoleBinding rows the suspension cascaded to are restored, and any RoleBinding suspended independently stays suspended.
- AC-030-001-03 — Given a Membership past its `expiresAt`, when `resolveViewer` runs, then it is treated as denied even though `status` still reads ACTIVE.

## Implementation

- `apps/server/src/app/api/platform/users/memberships/[id]/lifecycle/route.js`, `apps/server/src/app/api/platform/users/offboard/route.js`, `apps/server/src/modules/identity/{membership-lifecycle-service.js,membership-grant-service.js,erase-principal.js}`

## Verification

- TC-030-001 — Suspend/reinstate/revoke/offboard, last-owner refusal (see [verification.md](../verification.md))
