---
id: SDD-037
title: "Programme Delivery Telemetry — design"
---

# SDD-037 — Programme Delivery Telemetry design

- **Components:** `CMP-060` (`program-delivery-metrics.js`,
  `ProgramRoadmapBoard.jsx`, `TiltCard.jsx`); `CMP-076`
  (`scripts/programme-usage-meter.mjs`, generated into
  `program-roadmap-telemetry.js`); `CMP-077`
  (`application/programme-usage-reports.js`, `application/task-usage-ledger.js`);
  `CMP-073` (`program-task-evidence.js`,
  `program-roadmap-containers.js`).
- **Data owned:** `ProgrammeUsageReport`.
- **Contracts exposed:** `API-101`, `API-099`.
- **Contracts consumed:** `DOM-PRJ` `getProductReadinessSnapshot()` (FR-022-001, FR-022-002, FR-022-003,
  for evidence-badge id statuses).
- **Main sequence:** 1. The operator runs the meter by hand against local
  logs; it writes the document's usage block. 2. An agent with no local
  logs posts to the report endpoint under the deployment bearer. 3.
  `/control/roadmap` merges both sources server-side, deduplicating by
  session key. 4. `programme-containers.mjs` regenerates the container
  module, checking every declared DOC/CODE/TEST link at generation time.
- **Failure modes:** two lanes claiming one branch → generator fails by
  name; a report replay with a different payload → `409`; a stale DOC/CODE/
  TEST link → red badge, never silently dropped.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-037-001 | `apps/server/src/app/(control)/control/roadmap/page.jsx`, `apps/server/src/modules/platform-control/{program-delivery-metrics.js,components/ProgramRoadmapBoard.jsx}` |
| FR-037-002 | `apps/server/src/modules/platform-control/program-roadmap-telemetry.js`, `apps/server/scripts/programme-usage-meter.mjs` |
| FR-037-003 | `apps/server/src/app/api/platform/{programme-usage-reports/route.js,task-usage-ledger/route.js}`, `apps/server/src/modules/platform-control/application/{programme-usage-reports.js,task-usage-ledger.js}` |
| FR-037-004 | `apps/server/src/modules/platform-control/program-task-evidence.js`, `apps/server/scripts/programme-containers.mjs` |
