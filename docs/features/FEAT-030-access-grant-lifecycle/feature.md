---
id: FEAT-030
title: Access Grant Lifecycle
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: implemented
legacy: [FEAT-027, FR-191, FR-192]
relations:
  depends_on: []
  decided_by: [ADR-023]
---

# FEAT-030 — Access Grant Lifecycle

## Summary

`Membership` as a withdrawable grant rather than a permanent fact: who has
access, who gave it and why, until when, and when and why it ended — with a
declared scope grammar shared with `RoleBinding` and referential invariants
enforced by the database rather than application convention.

## Scope

**In:** grant provenance (`grantedByPersonId`, `grantReason`, `grantSource`,
`expiresAt`); suspend/reinstate/revoke/offboard lifecycle with mandatory
reasons and last-owner guards; `scopeType` (`TENANT`/`BUSINESS`) grammar on
`Membership` and `RoleBinding`; `Membership`'s single writer.
**Out:** access invitation (FEAT-032), segregation of duties
(FEAT-032), audit read models (FEAT-033).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-030-001](requirements/FR-030-001-membership-can-be-suspended-reinstated-revoked-and.md) | Membership can be suspended, reinstated, revoked and offboarded | — |
| [FR-030-002](requirements/FR-030-002-scope-is-a-declared-value-referential-invariants.md) | Scope is a declared value; referential invariants are database-enforced | — |
| [NFR-030-001](requirements/NFR-030-001-a-declared-status-value-nothing-writes-fails.md) | A declared status value nothing writes fails the build | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
