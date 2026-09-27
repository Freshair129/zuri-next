---
id: SDD-076
title: "Data pipeline map — design"
---

# SDD-076 — Data pipeline map design

- **Components:** CMP-213 (`pipeline-map-read-model.js`,
  `getDataPipelineMap`, `resolvePipelineMapDecision`) · CMP-214
  (`DataPipelineMapView.jsx`, `DataPipelineMap3D.jsx`) · CMP-211
  (`pipeline-map-access.js` — the viewer/Business admission check) ·
  CMP-212 (`pipeline-map-layout.js`) · CMP-205
  (`KnowledgeDashboard.jsx`) · CMP-210
  (`pipeline-health-service.js`, `getLivePipelineHealth`, `aggregateJobRecords`;
  `use-pipeline-health.js` client hook).
- **Data owned:** none as a database table. `docs/DATA-PIPELINE-MAP.md` (hand-
  maintained registry), `docs/.data-pipeline-map.json` (generated, not committed),
  `runtime/data-pipeline-map.json` (generated, committed — the server imports it and
  the Docker build context cannot regenerate it).
- **Contracts exposed:** API-187 (see `contracts.md`); the map/
  dashboard pages themselves have no API beyond this one live-overlay route.
- **Contracts consumed:** the requirements/FEAT snapshot (`FR-022-001, FR-022-002, FR-022-003`); four
  owning-domain read ports (FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 ledger; LINE conversation jobs; rich-menu publish
  jobs; asset-extraction jobs) for the live overlay; `FR-018-002, FR-018-003`/`FR-024-003`
  for Business-scoped domain-grant resolution.
- **Main sequence:** 1. `scripts/data-pipeline-map.mjs` runs on `govern`, reading the
  hand-maintained registry and the requirements snapshot 2. it derives every surface
  level and build status, fails by name on any contradiction, and writes the committed
  projection 3. the server resolves the viewer and, only if `knowledge` is visible,
  serves the static projection to the Dashboard/Map pages 4. the live overlay,
  separately, issues four bounded reads scoped to the active Business and merges
  counts onto the static map's edges.
- **Failure modes:** an unknown id/surface/production claim in the registry → the
  `govern` chain fails by name, blocking merge; a stale committed projection →
  `docs:check` fails; a live read failure → that one edge shows unavailable, the rest
  of the page unaffected; an unauthorized viewer → zero projection data reaches the
  client, not merely a hidden UI element.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-076-001 | scripts/data-pipeline-map.mjs; apps/server/src/modules/knowledge/pipeline-map/pipeline-map-read-model.js; docs/DATA-PIPELINE-MAP.md |
| FR-076-002 | apps/server/src/app/(pm)/knowledge/data-pipeline/page.jsx; apps/server/src/modules/knowledge/pipeline-map/DataPipelineMapView.jsx; apps/server/src/modules/knowledge/pipeline-map/DataPipelineMap3D.jsx; apps/server/src/modules/knowledge/pipeline-map/pipeline-map-layout.js; apps/server/src/modules/knowledge/pipeline-map/pipeline-map-access.js |
| FR-076-003 | apps/server/src/config/domains.js; apps/server/src/app/(pm)/knowledge/page.jsx; apps/server/src/modules/knowledge/pipeline-map/KnowledgeDashboard.jsx |
| FR-076-004 | apps/server/src/app/api/pipelines/health/route.js; apps/server/src/modules/knowledge/pipeline-map/pipeline-health-service.js; apps/server/src/modules/knowledge/pipeline-map/use-pipeline-health.js |
