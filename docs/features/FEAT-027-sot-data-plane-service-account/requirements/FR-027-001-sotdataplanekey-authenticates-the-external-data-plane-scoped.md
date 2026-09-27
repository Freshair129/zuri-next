---
id: FR-027-001
title: "SotDataPlaneKey authenticates the external data plane, scoped to one Tenant"
delivery: live
legacy: [FR-102]
relations:
  specified_by: [SDD-027]
---

# FR-027-001 — SotDataPlaneKey authenticates the external data plane, scoped to one Tenant

A `SotDataPlaneKey` bound to exactly one Tenant SHALL let the SoT pipeline's
external data plane authenticate (`Authorization: Bearer sdpk_...`) to the
submit/export endpoints without a browser session and without
installation-operator authority. Revocation SHALL take effect on the next
request; the raw secret SHALL never be persisted, only its SHA-256 hash.

## Acceptance criteria

- AC-027-001-01 — Given a valid, unrevoked key for Tenant T, when it is presented to a submit/export endpoint, then the request resolves to a data-plane identity scoped to Tenant T only.
- AC-027-001-02 — Given a revoked key, when it is presented on the next request, then it is refused — no grace window.
- AC-027-001-03 — Given a valid key, when it is checked against `isOperator` or any Person-shaped authority predicate, then it never satisfies either.

## Implementation

- `apps/server/src/modules/identity/sot-data-plane-auth.js`

## Verification

- TC-027-001 — SoT data-plane key authenticates and revokes correctly (see [verification.md](../verification.md))
