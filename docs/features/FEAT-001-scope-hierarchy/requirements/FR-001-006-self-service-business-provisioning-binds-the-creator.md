---
id: FR-001-006
title: "Self-service Business provisioning binds the creator as owner"
delivery: live
legacy: [FR-074 (split 3/3 — tier c)]
relations:
  specified_by: [SDD-001, API-076]
  depends_on: [FR-030-001]
---

# FR-001-006 — Self-service Business provisioning binds the creator as owner

The system SHALL let any authenticated principal create a new Tenant + Business + starter
BUSINESS Workspace in one transaction (`entity: businessInGroup`), placing it in the
requested or first Portfolio (bootstrapping one on an empty installation), and SHALL in
the same transaction grant the creator a tenant-wide OWNER Membership (via the identity
grant contract, provenance `SELF_PROVISION`) and record an AuditEvent naming the owner.

## Acceptance criteria

- AC-001-006-01 — Given an authenticated principal with no Membership, when they add a Business, then Tenant, Business, Workspace and an OWNER Membership exist and the new Business id is in their `ownedBusinessIds`.
- AC-001-006-02 — Given the Membership write fails, then none of the scope rows persist.

## Verification

- TC-001-003 — Three-tier creation authority and self-service binding (see [verification.md](../verification.md))
