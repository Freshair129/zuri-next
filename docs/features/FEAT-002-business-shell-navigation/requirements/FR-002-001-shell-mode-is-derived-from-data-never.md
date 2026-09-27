---
id: FR-002-001
title: "Shell mode is derived from data, never configured"
delivery: live
legacy: [FR-020]
relations:
  specified_by: [SDD-002, API-077]
  decided_by: [ADR-001]
---

# FR-002-001 — Shell mode is derived from data, never configured

The system SHALL derive the shell from the visible scope with one pure function: with one
visible Business the shell is SINGLE_BUSINESS (that Business is active, no Business
switcher); with two or more it is MULTI_BUSINESS (switcher shown; landing state
`BUSINESS_REQUIRED` until a Business is selected). A Workspace selector SHALL appear only
when more than one Workspace is visible for the active Business (Business-owned plus
PORTFOLIO-scoped), and a Group selector only when two or more Portfolios are visible.
Tenant SHALL never appear as a selectable level. Adding a second Business SHALL expand the
shell without any migration or setting.

## Acceptance criteria

- AC-002-001-01 — Given exactly one visible Business, when the shell derives, then `mode = SINGLE_BUSINESS`, `activeBusinessId` is that Business and `showBusinessSwitcher = false`.
- AC-002-001-02 — Given two visible Businesses and no selection, then `landing = BUSINESS_REQUIRED`.
- AC-002-001-03 — Given a single-Business owner adds a Business in Settings, when scope reloads, then the switcher appears and existing Projects are unchanged.

## Implementation

- apps/server/src/lib/shell-mode.js; apps/server/src/context/ScopeContext.jsx; apps/server/src/app/(pm)/settings/page.jsx

## Verification

- TC-002-001 — Shell-mode derivation (see [verification.md](../verification.md))
- TC-002-005 — Hierarchical navigation (see [verification.md](../verification.md))
