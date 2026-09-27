---
id: FEAT-032
title: Access Invite, SoD & Operator Lifecycle
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: implemented
legacy: [FEAT-029, FR-195, FR-196, FR-197, FR-200]
relations:
  depends_on: []
  decided_by: [ADR-025, ADR-027]
---

# FEAT-032 — Access Invite, SoD & Operator Lifecycle

## Summary

Three access-control gaps closed together: a real Business/Tenant-level
invitation that becomes a Membership grant on acceptance, segregation of
duties enforced at write time and at transaction time (not only documented),
and an operator/superadmin lifecycle that expires, renews and records its own
use.

## Scope

**In:** `AccessInvite` (generalised `WorkspaceInvite`) at PORTFOLIO/TENANT/
BUSINESS scope; `ROLE_CONFLICTS` and the self-verify/self-post transaction
refusals; time-boxed, renewable, auditable operator grants; explicit
Superadmin authority.
**Out:** the underlying Membership lifecycle itself (FEAT-030), audit
read models (FEAT-033).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-032-001](requirements/FR-032-001-accessinvite-grants-membership-on-acceptance-at-any.md) | AccessInvite grants Membership on acceptance, at any of three scopes | — |
| [FR-032-002](requirements/FR-032-002-segregation-of-duties-refuses-at-assignment-and.md) | Segregation of duties refuses at assignment and at transaction | — |
| [FR-032-003](requirements/FR-032-003-operator-access-is-time-boxed-renewable-and.md) | Operator access is time-boxed, renewable and its use is recorded | — |
| [FR-032-004](requirements/FR-032-004-explicit-superadmin-authority-resolved-fresh-every-request.md) | Explicit Superadmin authority, resolved fresh every request | — |
| [NFR-032-001](requirements/NFR-032-001-revocation-expiry-of-superadmin-operator-grants-is.md) | Revocation/expiry of Superadmin/operator grants is effective on the next request | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
