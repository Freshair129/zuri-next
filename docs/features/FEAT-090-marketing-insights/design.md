---
id: SDD-090
title: "Marketing Insights — design"
---

# SDD-090 — Marketing Insights design

- **Components:**
  - `CMP-284` — `application/marketing-insights-service.js`: brand
    list, summary, metric series, content performance reads; enforces the
    server-owned Business binding and quality-carrying value shape.
  - `CMP-283` — `src/app/api/insights/_insights-http.js`: shared
    503 `INSIGHTS_NOT_CONFIGURED` response helper used by every route until a
    persistent repository exists.
- **Data owned:** none persisted yet in this checkout; the eventual snapshot/
  sync-run models are declared by FR-090-002 but not yet implemented (fixture-only
  repository used in tests: `tests/fixtures/marketing-insights/fixture-insights-repository.js`).
- **Contracts exposed:** `API-250`, `API-256`,
  `API-252`, `API-253`,
  `API-251`; `API-254`,
  `API-255` (declared, unimplemented).
- **Contracts consumed:** none yet — the eventual sync-orchestrator port (`SyncOrchestratorPort`)
  and its underlying workflow engine adapter are deferred past this slice.
- **Main sequence:** `GET /api/insights/brands` → pick a brand → `GET .../summary` /
  `.../metric/[key]` / `.../metric/[key]/export` / `.../content`, each independently
  answering `503 INSIGHTS_NOT_CONFIGURED` today because no persistent repository is
  wired in production.
- **Failure modes:** unconfigured repository → 503 (by design, not an outage);
  unknown metric value → rendered/exported as unknown, never 0; a future refresh
  race → coalesced or refused per FR-090-002 (not yet exercised in production
  since the route does not exist).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-090-001 | `apps/server/src/modules/marketing/application/marketing-insights-service.js`, `apps/server/src/app/api/insights/brands/route.js`, `.../summary/route.js`, `.../metric/[metricKey]/route.js`, `.../metric/[metricKey]/export/route.js`, `.../content/route.js`, `apps/server/src/app/api/insights/_insights-http.js`, `apps/server/src/app/(pm)/growth/insights/page.jsx`, `load-insights-json.js` |
| FR-090-002 | Not implemented in this checkout — no `refresh` route exists under `apps/server/src/app/api/insights/` as of this reading |
