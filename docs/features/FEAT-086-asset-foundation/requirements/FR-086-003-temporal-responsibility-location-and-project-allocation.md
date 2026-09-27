---
id: FR-086-003
title: "Temporal responsibility, location and Project allocation"
delivery: building
legacy: [FR-135]
relations:
  specified_by: [SDD-086]
  decided_by: [ADR-078]
---

# FR-086-003 — Temporal responsibility, location and Project allocation

The system SHALL model accountable person, custodian, actual user(s), owning/operating
org-unit references and physical location as effective intervals whose history is
appended, never overwritten — closing the current interval and opening the next in
one transaction. The system SHALL own `AssetProjectAllocation` (Project Manager owns
the request that triggers it) and SHALL fail closed on a cross-Business Person/Project
reference or an overlapping exclusive allocation.

## Acceptance criteria

- AC-086-003-01 — Given an asset with an active `ACCOUNTABLE` interval, when a new accountable person is assigned, then the previous interval is closed with an end timestamp and a new interval opens, both readable in history.
- AC-086-003-02 — Given an asset already exclusively allocated to Project A for an overlapping window, when an exclusive allocation to Project B is attempted for an overlapping window, then it is refused.
- AC-086-003-03 — Given a Project belonging to a different Business than the asset, when allocation is attempted, then it is refused (fails closed).

## Implementation

- `apps/server/src/modules/asset-management/application/asset-lifecycle-service.js`, `apps/server/src/app/api/assets/register/[id]/relocate/route.js`, `.../allocate/route.js`, `.../responsibility/route.js`, `.../return/route.js`

## Verification

- TC-086-004 — Responsibility/location/allocation effective-interval history (see [verification.md](../verification.md))
