---
id: FR-002-004
title: "Breadcrumb mirrors the context"
delivery: live
legacy: [FR-034]
relations:
  decided_by: [ADR-002]
---

# FR-002-004 — Breadcrumb mirrors the context

The system SHALL render a breadcrumb of Home › Group (or the lens's "all" label) ›
Organization › Business › Project (only when a Project route is open), where the Group
crumb links to the shell root and the Project crumb shows the opened Project's code; the
breadcrumb SHALL never act as a scope selector and SHALL never show Space.

## Acceptance criteria

- AC-002-004-01 — Given `/projects/{id}/board` for a Project of Business B, then the crumbs end with B's name and the Project code.
- AC-002-004-02 — Given no selected Portfolio, then the first crumb uses the active lens's all-label.

## Implementation

- apps/server/src/components/layouts/Breadcrumb.jsx

## Verification

- TC-002-002 — Context bar, topbar and breadcrumb contracts (see [verification.md](../verification.md))
