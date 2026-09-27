---
id: FR-023-002
title: "Entry routing is a minimal pre-shell sequence gated by the viewer"
delivery: live
legacy: [FR-044]
relations:
  specified_by: [SDD-023]
  decided_by: [ADR-019]
---

# FR-023-002 — Entry routing is a minimal pre-shell sequence gated by the viewer

The system SHALL present a minimal Landing (`/`) with no BusinessShell chrome
and no viewer resolution, a credential Login (`/login`), a Business Routing
page (`/businesses`) that lists only Businesses the resolved viewer may see,
and a BusinessShell (mounted at `/overview` and below) reachable only after a
Business is selected.

## Acceptance criteria

- AC-023-002-01 — Given an unauthenticated visitor at `/`, when the page renders, then no viewer resolution occurs and the only route-bearing action is the link to `/login`.
- AC-023-002-02 — Given an authenticated viewer with two visible Businesses and three hidden ones, when `/businesses` renders, then exactly the two visible Businesses appear and the hidden three are never present in the response payload.
- AC-023-002-03 — Given a viewer with zero visible Businesses, when they reach `/businesses`, then the page renders an empty, non-erroring state rather than redirecting into BusinessShell.

## Implementation

- `apps/server/src/app/(entry)/businesses/page.jsx`, `apps/server/src/app/(pm)/layout.jsx`, `apps/server/src/app/layout.jsx`, `apps/server/src/app/login/page.jsx`, `apps/server/src/app/page.jsx`, `apps/server/src/lib/business-routing.js`, `apps/server/src/lib/business-shell-guard.js`, `apps/server/src/components/layouts/{Breadcrumb,BusinessRoutingShell,BusinessShellGuard,EntryShell,Topbar}.jsx`

## Verification

- TC-023-002 — Entry routing shows only viewer-visible Businesses (see [verification.md](../verification.md))
- TC-023-003 — API/UI entry contract stays in sync (see [verification.md](../verification.md))
