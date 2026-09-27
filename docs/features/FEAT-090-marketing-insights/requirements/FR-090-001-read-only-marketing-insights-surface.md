---
id: FR-090-001
title: "Read-only Marketing Insights surface"
delivery: building
legacy: [FR-275]
relations:
  specified_by: [SDD-090]
  decided_by: [none]
---

# FR-090-001 — Read-only Marketing Insights surface

The system SHALL let a signed-in member of the Business list the brands they may
open (`GET /api/insights/brands`), then read a brand's metric summary
(`GET /api/insights/summary`), one metric's daily series
(`GET /api/insights/metric/[metricKey]`), that series as CSV
(`GET /api/insights/metric/[metricKey]/export`) and content performance
(`GET /api/insights/content`) on the `/growth/insights` page. The Business SHALL
come from the server-owned asset binding, never from a client-supplied value; every
returned value SHALL carry its data quality, and an unknown value SHALL never be
rendered as 0; a read, render or export SHALL never call a live provider and SHALL
read exactly one snapshot so a chart and its CSV export always agree.

## Acceptance criteria

- AC-090-001-01 — Given no persistent Marketing Insights repository is configured, when any of the five GET routes is called, then it answers `503 INSIGHTS_NOT_CONFIGURED` rather than fabricated or zeroed data.
- AC-090-001-02 — Given a metric value the source marks unknown/missing, when rendered on the page or exported as CSV, then it is shown as explicitly unknown, never as `0`.
- AC-090-001-03 — Given a chart render and a CSV export of the same metric in the same request window, when compared, then their values match exactly (same snapshot, not two independent reads).
- AC-090-001-04 — Given a viewer who is not a member of the Business the requested brand belongs to, when any insights route is called, then it is refused rather than resolved from a client-supplied Business id.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-insights-service.js`, `apps/server/src/app/api/insights/brands/route.js`, `.../summary/route.js`, `.../metric/[metricKey]/route.js`, `.../metric/[metricKey]/export/route.js`, `.../content/route.js`, `apps/server/src/app/api/insights/_insights-http.js`, `apps/server/src/app/(pm)/growth/insights/page.jsx`, `load-insights-json.js`

## Verification

- TC-090-001 — Insights query service and quality-carrying values (see [verification.md](../verification.md))
- TC-090-002 — Insights routes, 503 unconfigured behavior, scope refusal (see [verification.md](../verification.md))
- TC-090-003 — Insights ports and page rendering (fixture-backed) (see [verification.md](../verification.md))
