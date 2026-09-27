---
id: SDD-039
title: "Observability: Errors & Usage Events — design"
---

# SDD-039 — Observability: Errors & Usage Events design

- **Components:** `CMP-063` (`src/lib/observability/logger.js`
  — not this domain's own code, kept database-free by convention —
  `application/error-events.js`, `ErrorEventsView.jsx`); `CMP-075`
  (`application/usage-events.js`, `UsagePageViewTracker.jsx`,
  `UsageBreakdownView.jsx`).
- **Data owned:** `ErrorEvent`, `UsageEvent`, `UsageEventRollup`.
- **Contracts exposed:** `API-097`, `API-100`.
- **Contracts consumed:** none.
- **Main sequence:** 1. A route handler catches an error and calls
  `logger.exception()`, then `recordErrorEvent()`. 2. The client's
  `UsagePageViewTracker` posts a `PAGE_VIEW` event on every route change,
  and any handler calls `recordAction()` for an instrumented action. 3. A
  daily job posts to `/api/platform/usage-events/rollup` under its
  deployment bearer, moving rows older than 90 days into
  `UsageEventRollup`. 4. An operator reads both surfaces under `/control`.
- **Failure modes:** a stack frame that is not `file:line` shaped → dropped,
  never stored as free text; a rollup call with no bearer → refused.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-039-001 | `apps/server/src/app/(control)/control/errors/page.jsx`, `apps/server/src/app/api/platform/error-events/**`, `apps/server/src/lib/observability/logger.js`, `apps/server/src/modules/platform-control/{application/error-events.js,components/ErrorEventsView.jsx}` |
| FR-039-002 | `apps/server/src/app/api/platform/usage-events/route.js`, `apps/server/src/modules/platform-control/{application/usage-events.js,components/UsagePageViewTracker.jsx}` |
| FR-039-003 | `apps/server/src/app/api/platform/usage-events/rollup/route.js`, `apps/server/src/modules/platform-control/{application/usage-events.js,components/{UsagePageViewTracker,UsageBreakdownView}.jsx}` |
