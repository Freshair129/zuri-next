---
id: FEAT-024
title: Authorization — Membership, Roles & Domain Visibility
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-038, FR-061, FR-062, FR-076]
relations:
  depends_on: []
  decided_by: [ADR-021]
---

# FEAT-024 — Authorization — Membership, Roles & Domain Visibility

## Summary

The administration and read surfaces over a principal's authority: a
self-service Profile view, an OWNER-only Users & Permissions screen, the
per-Business domain-visibility answer every domain's read model enforces
against, the read-scope for that same admin screen, and a Business-scoped
Product Owner role binding distinct from full Business ownership. Used by
the web console (`/profile`, `/platform/users`) and by every domain's read
model (crm, market, people, project-manager) that gates a read on a viewer's
domain visibility.

## Scope

**In:** My Profile display; Users & Permissions administration
(`addBusinessMembership`, role edits, per-domain grants); per-Business domain
visibility (`domainsByBusinessId`, `domainsForBusiness`, server-side
enforcement); the read-scope restriction on who the admin screen shows; the
`PRODUCT_OWNER` RoleBinding.
**Out:** grant lifecycle (suspend/reinstate/revoke — FEAT-030), access
invites (FEAT-032), audit/history read models (FEAT-033).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-024-001](requirements/FR-024-001-my-profile-shows-the-resolved-local-account.md) | My Profile shows the resolved local account | — |
| [FR-024-002](requirements/FR-024-002-users-permissions-administers-membership-role-and-domain.md) | Users & Permissions administers Membership role and domain grants | — |
| [FR-024-003](requirements/FR-024-003-per-business-domain-visibility-is-resolved-and.md) | Per-Business domain visibility is resolved and enforced per Business | — |
| [FR-024-004](requirements/FR-024-004-users-permissions-read-scope-matches-administration-authority.md) | Users & Permissions read scope matches administration authority | — |
| [FR-024-005](requirements/FR-024-005-product-owner-is-a-business-scoped-rolebinding.md) | Product Owner is a Business-scoped RoleBinding, not a global role | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
