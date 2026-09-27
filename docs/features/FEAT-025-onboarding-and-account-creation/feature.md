---
id: FEAT-025
title: Onboarding & Account Creation
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-066, FR-067, FR-120, FR-121, FR-122]
relations:
  depends_on: []
  decided_by: [ADR-020]
---

# FEAT-025 — Onboarding & Account Creation

## Summary

How a new person enters the product: self-serve signup (the only door in),
Google as an alternative proof of the same account, the Profile-first setup
step, the fields a Profile actually requires, and Workspace collaboration for
someone invited into an existing team. Every path ends the same place —
Profile-only members rest in the Waiting Room until an owner assigns them
further scope.

## Scope

**In:** `/signup` account creation; the profile-first onboarding state
machine and Waiting Room; the Profile's required identity fields; Workspace
(Portfolio) invitation and membership.
**Out:** per-Business/Tenant access invites (FEAT-032), password reset
(FEAT-026), the viewer gate itself (FEAT-023).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-025-001](requirements/FR-025-001-profile-first-onboarding-waiting-room-before-operating.md) | Profile-first onboarding: Waiting Room before operating scope | — |
| [FR-025-002](requirements/FR-025-002-workspace-invitation-creates-a-separate-scoped-collaboration.md) | Workspace invitation creates a separate, scoped collaboration grant | — |
| [FR-025-003](requirements/FR-025-003-self-serve-signup-is-the-one-door.md) | Self-serve signup is the one door into the product | — |
| [FR-025-004](requirements/FR-025-004-google-is-a-second-way-to-prove.md) | Google is a second way to prove the same account | — |
| [FR-025-005](requirements/FR-025-005-profile-requires-given-name-family-name-and.md) | Profile requires given name, family name and telephone number | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
