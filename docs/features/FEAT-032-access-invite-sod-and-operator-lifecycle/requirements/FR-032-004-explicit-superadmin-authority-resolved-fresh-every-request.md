---
id: FR-032-004
title: "Explicit Superadmin authority, resolved fresh every request"
delivery: implemented
legacy: [FR-200]
relations:
  specified_by: [SDD-032]
  decided_by: [ADR-027]
---

# FR-032-004 — Explicit Superadmin authority, resolved fresh every request

An existing Person SHALL be able to hold a distinct, ACTIVE, unexpired
`SUPERADMIN` `PlatformGrant`, granting administration of all pages and
current/future Tenant, Business and Portfolio scopes. Browser sessions SHALL
resolve it each request into enumerated owner/domain/operator authority via
the trusted session port only; ordinary OPERATOR and Membership resolution
SHALL be unchanged; plugin/API/device identities SHALL NEVER inherit it.
Issuance/revocation SHALL use a local CLI requiring exact identity, mandatory
reason and a maximum 90-day expiry, audited atomically. **Amendment
(2026-09-13):** a live OPERATOR SHALL additionally be able to revoke one
explicitly selected Membership grant or end one Employment record with a
reason (HR Remove), without gaining any other owner-only authority.

## Acceptance criteria

- AC-032-004-01 — Given an ACTIVE Superadmin grant, when a new Tenant is created after the grant was issued, then the Superadmin's enumerated scope includes it automatically on the next request.
- AC-032-004-02 — Given a plugin session for a Person holding an ACTIVE Superadmin grant, when `getPluginCapabilities` resolves, then the Superadmin authority is absent from the plugin's capability list.
- AC-032-004-03 — Given a live OPERATOR with no Superadmin grant, when they revoke one explicitly selected Membership with a reason (HR Remove), then that single revocation succeeds while no other owner-only screen becomes reachable to them.

## Implementation

- `apps/server/src/modules/identity/{superadmin-grant.js,resolve-viewer.js,session-port.js}`

## Verification

- TC-032-004 — Superadmin resolution, plugin exclusion, HR Remove amendment (see [verification.md](../verification.md))
