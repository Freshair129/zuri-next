---
id: FEAT-004
title: Project repositories & project team
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-008, FR-073, FR-036]
relations:
  depends_on: [FEAT-003, FR-030-001]
  decided_by: [ADR-005]
---

# FEAT-004 — Project repositories & project team

## Summary

Two resource registers a Project needs: source-code Repository records (local metadata,
each owned by one Business) linked many-to-many to Projects, and the Project Team tab,
which shows who in the Project's Business may work on it and how much active work each
person carries. Used from the web console (Development → Repositories, Project →
Resource Coordination → Team / Repositories).

## Scope

**In:** Repository create/update/list; Project ↔ Repository link/unlink with role, path
scope and branch; Project Team list, add and remove of Business-scoped members; assignee
load per member; backfill rule for ownerless legacy Repositories.
**Out:** Membership authority semantics and role changes (DOM-IAM, FR-030-001);
organisational Teams (FEAT-015); remote Git provider sync (none exists); governance
snapshots of a checkout (FEAT-014).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-004-001](requirements/FR-004-001-repository-records.md) | Repository records | — |
| [FR-004-002](requirements/FR-004-002-a-repository-is-owned-by-exactly-one.md) | A Repository is owned by exactly one Business | — |
| [FR-004-003](requirements/FR-004-003-project-team-view-over-business-memberships.md) | Project Team view over Business memberships | — |
| [FR-004-004](requirements/FR-004-004-project-team-add-remove-through-the-grant.md) | Project Team add/remove through the grant contract | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
