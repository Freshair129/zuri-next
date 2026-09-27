---
id: SDD-006
title: "Project work views — design"
---

# SDD-006 — Project work views design

- **Components:** CMP-033 — `ExecutionModeView` + `MODE_BODIES`, `WbsCanvas`, `DependencyMap` (+ list twin), `KanbanBoard` + `WorkpackageModal`, `TimelineView`, `WorkViewTabs`; CMP-010 (`getProjectDependencyGraph`: project-contained edges only).
- **Data owned:** none (pure projections).
- **Contracts consumed:** API-085, API-082, API-081, API-068, API-052, API-069, API-051, API-050.
- **Main sequence:** page resolves Project/Business context from the shell → fetches the read API → renders; edits call the write API then reload.
- **Failure modes:** API 404/403 → error state (no fallback to another scope); empty data → explicit empty state.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-006-001 | apps/server/src/app/(pm)/execution/page.jsx; apps/server/src/app/(pm)/execution/[mode]/page.jsx; apps/server/src/app/(pm)/projects/[projectId]/execution/[mode]/page.jsx; apps/server/src/modules/project-manager/views/execution/ExecutionModeView.jsx; views/execution/mode-bodies.jsx |
| FR-006-002 | apps/server/src/app/(pm)/projects/[projectId]/structure/page.jsx; views/WbsCanvas.jsx |
| FR-006-003 | apps/server/src/app/(pm)/projects/[projectId]/dependencies/page.jsx; views/DependencyMap.jsx; application/project-dependency-map.js; apps/server/src/app/api/projects/[id]/dependencies/route.js |
| FR-006-004 | apps/server/src/app/(pm)/projects/[projectId]/board/page.jsx; views/KanbanBoard.jsx |
| FR-006-005 | apps/server/src/app/(pm)/timeline/page.jsx; apps/server/src/app/(pm)/projects/[projectId]/timeline/page.jsx; views/universal/TimelineView.jsx |
