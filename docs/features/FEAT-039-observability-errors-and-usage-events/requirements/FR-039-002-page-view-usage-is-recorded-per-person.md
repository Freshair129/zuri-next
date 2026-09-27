---
id: FR-039-002
title: "Page-view usage is recorded per person on every route change"
delivery: building
legacy: [FR-248]
relations:
  specified_by: [SDD-039]
  decided_by: [ADR-037]
---

# FR-039-002 — Page-view usage is recorded per person on every route change

A hook mounted once in each authenticated shell SHALL record one
`UsageEvent` row (`kind: 'PAGE_VIEW'`) with `route`, `personId` and
`sessionId` on every route change. An operator SHALL read route-level counts,
broken down by route and by person, under `/control/usage`.

## Acceptance criteria

- AC-039-002-01 — Given a person navigating through three routes in one session, when usage is recorded, then three `PAGE_VIEW` rows exist, each with that person's id.

## Implementation

- `apps/server/src/app/api/platform/usage-events/route.js`, `apps/server/src/modules/platform-control/{application/usage-events.js,components/UsagePageViewTracker.jsx}`

## Verification

- TC-039-002 — Page-view usage per person on route change (see [verification.md](../verification.md))
