---
id: FR-001-007
title: "Installation primitives require operator authority"
delivery: live
legacy: [FR-075 (split 1/2 — scope primitives)]
relations:
  specified_by: [API-076]
  depends_on: [FR-023-001]
---

# FR-001-007 — Installation primitives require operator authority

The system SHALL allow creating a Portfolio, a Tenant, a LegalEntity or a
PORTFOLIO-scoped Workspace only for a viewer whose `isOperator` capability is true (a
server-held platform grant on a trusted session); any other principal SHALL receive 403
naming the operator capability, regardless of how many Businesses or Tenants they own.
`isPlatform` SHALL never be read as authority.

## Acceptance criteria

- AC-001-007-01 — Given a Tenant OWNER without platform grant, when they create a Tenant, then 403 "installation-wide operation" is returned.
- AC-001-007-02 — Given an operator, when they create a Portfolio, then it is created and audited `PORTFOLIO/CREATED`.

## Verification

- TC-001-004 — Operator capability for installation primitives (see [verification.md](../verification.md))
