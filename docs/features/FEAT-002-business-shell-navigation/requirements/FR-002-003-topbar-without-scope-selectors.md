---
id: FR-002-003
title: "Topbar without scope selectors"
delivery: live
legacy: [FR-033]
relations:
  decided_by: [ADR-001, ADR-002]
---

# FR-002-003 — Topbar without scope selectors

The system SHALL present a topbar containing the Zuri identity mark, the Base Context Bar,
the ERP/PM scope-view lens toggle (ERP default), a command palette (Ctrl+K), notifications,
the profile link and sign-out, plus an operator-only programme-roadmap link; it SHALL
contain no scope dropdown or selector and no Project-creation action (Project creation
lives on the Projects dashboard, FEAT-015).

## Acceptance criteria

- AC-002-003-01 — Given any shell page, then no `<select>`/dropdown for Portfolio, Business, Workspace or Project exists in the topbar.
- AC-002-003-02 — Given a non-operator viewer, then the programme-roadmap link is absent.
- AC-002-003-03 — Given the lens toggle set to PM, then shell labels use the PM vocabulary (e.g. "ทุกธุรกิจ") and the choice does not change any authorization.

## Implementation

- apps/server/src/components/layouts/Topbar.jsx; apps/server/src/components/layouts/CommandPalette.jsx

## Verification

- TC-002-002 — Context bar, topbar and breadcrumb contracts (see [verification.md](../verification.md))
