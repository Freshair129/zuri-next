---
id: FR-039-003
title: "Action-level usage is an adoptable primitive, not complete coverage"
delivery: building
legacy: [FR-249]
relations:
  specified_by: [SDD-039]
  decided_by: [ADR-037]
---

# FR-039-003 — Action-level usage is an adoptable primitive, not complete coverage

`recordAction(name)` SHALL let any handler record one `UsageEvent` row
(`kind: 'ACTION'`) for a static `actionName` chosen by the calling code,
never built from request data. This SHALL ship as an adoptable primitive
with a first set of instrumented call sites, not a claim of complete
coverage; an operator SHALL read action-level counts the same way as
page-view counts. Raw, person-attributed rows SHALL retain 90 days; past
that, a daily rollup (`UsageEventRollup`, no `personId`) SHALL be the only
surviving record.

## Acceptance criteria

- AC-039-003-01 — Given an action not yet instrumented, when the usage dashboard is read, then it states the action may be "not instrumented yet" rather than implying "nobody does this".
- AC-039-003-02 — Given a `UsageEvent` row older than 90 days, when the rollup job runs, then the raw row is replaced by an aggregate with no `personId`.

## Implementation

- `apps/server/src/app/api/platform/usage-events/rollup/route.js`, `apps/server/src/modules/platform-control/{application/usage-events.js,components/{UsagePageViewTracker,UsageBreakdownView}.jsx}`

## Verification

- TC-039-003 — Action-level primitive, partial-coverage messaging, 90-day rollup (see [verification.md](../verification.md))
