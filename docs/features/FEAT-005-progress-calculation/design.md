---
id: SDD-005
title: "Progress calculation & explain — design"
---

# SDD-005 — Progress calculation & explain design

- **Components:** CMP-022 (`strategies.js`: seven strategies, `calculateWorkstreamProgress`, `clampPercent`, `formatProgressPercent`, `reportsAsComplete`; `rollup.js`: `rollupProject`, `rollupBusiness`), CMP-023 (`computeWorkstreamProgress`, `computeProjectProgress`, `computePortfolioProgress` — load bundle, call calculators, refresh cache), UI `ProgressExplain`.
- **Data owned:** `Workstream.progressCache` (advisory), inputs from WorkItem/Milestone/Gate/Workstream.viewConfig.
- **Contracts exposed:** API-050, API-049, API-048; calculators are an in-process contract for dashboards (FEAT-012/015/018).
- **Main sequence:** 1. authorize read 2. load Workstream(s) with live items, milestones, gates 3. calculator per strategy 4. roll up 5. write cache if changed 6. return result.
- **Failure modes:** unknown strategy → 0 + warning; bad metric values coerced to 0.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-005-001/002 | apps/server/src/modules/project-manager/progress/strategies.js |
| FR-005-003 | apps/server/src/modules/project-manager/progress/rollup.js; apps/server/src/modules/project-manager/application/progress-service.js; apps/server/src/app/api/progress/project/[id]/route.js; apps/server/src/app/api/progress/portfolio/route.js |
| FR-005-004 | apps/server/src/app/api/progress/workstream/[id]/route.js; apps/server/src/modules/project-manager/components/ProgressExplain.jsx |
