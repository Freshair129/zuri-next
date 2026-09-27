---
id: FEAT-026
title: Credential & Operator Bootstrap
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-104, FR-107]
relations:
  depends_on: []
  decided_by: []
---

# FEAT-026 — Credential & Operator Bootstrap

## Summary

How a locked-out person regains access without a mail transport, and how this
installation gets — and keeps — an installation operator. Two different
audiences (an ordinary Person; the installation itself) sharing one shape:
mint a single-use, hash-bound secret out of band, reveal it exactly once, and
never let its use go unaudited.

## Scope

**In:** owner-assisted password reset (no public forgot-password route);
`PlatformGrant`-backed operator bootstrap, and issuing/revoking/listing
further operator grants.
**Out:** access invites and Membership lifecycle (FEAT-032),
Superadmin (FEAT-032, FR-032-004).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-026-001](requirements/FR-026-001-owner-assisted-password-reset-no-public-forgot.md) | Owner-assisted password reset, no public forgot-password route | — |
| [FR-026-002](requirements/FR-026-002-operator-grant-store-bootstrap-issuance-listing-and.md) | Operator grant store, bootstrap, issuance, listing and revocation | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
