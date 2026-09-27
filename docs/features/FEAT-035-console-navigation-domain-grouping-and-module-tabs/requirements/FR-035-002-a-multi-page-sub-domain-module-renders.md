---
id: FR-035-002
title: "A multi-page sub-domain module renders its pages as in-canvas tabs"
delivery: live
legacy: [FR-170]
relations:
  specified_by: [SDD-035]
---

# FR-035-002 — A multi-page sub-domain module renders its pages as in-canvas tabs

A sub-domain module with more than one page SHALL render them as tabs inside
its own canvas (`<ModuleTabs>`), with the active tab derived from
`usePathname()` — a normal client-navigated route, never query-param or
component state. No existing route SHALL move.

## Acceptance criteria

- AC-035-002-01 — Given the Procurement module's Dashboard and Purchase Orders pages, when a user clicks the Purchase Orders tab, then the URL changes to that page's own existing route and the active tab is derived from the resulting `usePathname()`, not client state.

## Implementation

- `apps/server/src/components/ui/index.jsx`, `apps/server/src/lib/module-tabs.js`

## Verification

- TC-035-002 — Module tabs derive active state from the route, not state (see [verification.md](../verification.md))
