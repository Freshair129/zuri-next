---
id: FR-001-005
title: "Tenant-tier creators require Tenant ownership"
delivery: live
legacy: [FR-074 (split 2/3 — tier b)]
relations:
  specified_by: [API-076]
  derived_from: [BR-061]
---

# FR-001-005 — Tenant-tier creators require Tenant ownership

The system SHALL allow creating a Business inside an existing Tenant, a TENANT-scoped
Workspace, or a TaxRegistrationBranch of the Tenant's LegalEntity only when
`ownsTenant(viewer, tenantId)` holds, i.e. the viewer holds a tenant-wide OWNER Membership
(surfaced as `ownedTenantIds`). Owning every Business of a Tenant SHALL NOT satisfy it.
A Business that references a LegalEntity SHALL reference one in its own Tenant.

## Acceptance criteria

- AC-001-005-01 — Given a viewer owning both Businesses of Tenant T via per-Business OWNER grants only, when they create a third Business in T, then it is refused as "Tenant not found".
- AC-001-005-02 — Given a LegalEntity of another Tenant, when a Business is created referencing it, then 422 `LEGAL_ENTITY_TENANT_MISMATCH` is returned.

## Verification

- TC-001-003 — Three-tier creation authority and self-service binding (see [verification.md](../verification.md))
