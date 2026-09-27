---
id: FEAT-015
title: Projects dashboard, priority, PIC & teams
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-008, FR-086, FR-087, FR-088, FR-089, ADR-036, ADR-037]
relations:
  depends_on: [FEAT-003, FEAT-005, FR-024-003]
  decided_by: [ADR-011, ADR-012]
---

# FEAT-015 — Projects dashboard, priority, PIC & teams

## Summary

The Development domain's Dashboard (`/projects`): a KPI band that always reconciles with the
list beneath it, an enriched Project list, and a "Top 5 Priority Projects" panel — plus the
three facts it needed to be honest: a first-class Project priority, one accountable person
(PIC), and organisational Teams attached to Projects. Teams group people and grant nothing.

## Scope

**In:** dashboard read model and page; `Project.priority`; `Project.picPersonId`; Team,
TeamMembership, ProjectTeam CRUD; "New project" as the page's primary action.
**Out:** Business Home (`/overview`, FEAT-018); access grants (DOM-IAM); Project Team tab
over Memberships (FEAT-004; reconciliation deferred).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-015-001](requirements/FR-015-001-projects-dashboard-read-model.md) | Projects Dashboard read model | — |
| [FR-015-002](requirements/FR-015-002-top-5-priority-projects.md) | Top 5 Priority Projects | — |
| [FR-015-003](requirements/FR-015-003-project-priority.md) | Project priority | — |
| [FR-015-004](requirements/FR-015-004-project-accountable-owner-pic.md) | Project accountable owner (PIC) | — |
| [FR-015-005](requirements/FR-015-005-teams-group-people-and-grant-nothing.md) | Teams group people and grant nothing | — |
| [NFR-015-001](requirements/NFR-015-001-dashboard-does-not-stall.md) | Dashboard does not stall | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
