---
id: FEAT-006
title: Project work views
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-009, FR-040, FR-063, FR-064, ADR-012]
relations:
  depends_on: [FEAT-003, FEAT-005]
  decided_by: [ADR-003, ADR-014]
---

# FEAT-006 — Project work views

## Summary

Read-mostly visualisations over the one neutral work model: seven execution-mode views
(global and project-scoped), a Structure Plan (WBS), a project-local Dependency Map, a
status Board and a month-grid Schedule. Each view is the same component under a different
filter; none stores layout, order or positions — status edits go through the work services.

## Scope

**In:** `/execution/{mode}` and `/projects/{id}/execution/{mode}`; `/projects/{id}/structure`;
`/projects/{id}/dependencies`; `/projects/{id}/board`; `/timeline` and `/projects/{id}/timeline`.
**Out:** All Work list and Milestones & Gates list (FEAT-003); Execution Roadmap view
(FEAT-010); editing on the canvas (FEAT-016, declared); cross-project register
(`/dependencies`, FEAT-003).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-006-001](requirements/FR-006-001-seven-execution-mode-views-over-the-neutral.md) | Seven execution-mode views over the neutral model | — |
| [FR-006-002](requirements/FR-006-002-structure-plan-wbs.md) | Structure Plan (WBS) | — |
| [FR-006-003](requirements/FR-006-003-project-local-dependency-map.md) | Project-local Dependency Map | — |
| [FR-006-004](requirements/FR-006-004-project-board.md) | Project Board | — |
| [FR-006-005](requirements/FR-006-005-schedule.md) | Schedule | — |
| [NFR-006-001](requirements/NFR-006-001-views-usable-at-desktop-and-narrow-widths.md) | Views usable at desktop and narrow widths | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
