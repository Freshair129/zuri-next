---
id: SDD-019
title: "Business strategy, goals & key results — design"
---

# SDD-019 — Business strategy, goals & key results design

- **Components:** CMP-009 — read `getBusinessStrategy` (business module, writes nothing) and writers `createRoadmap`, `updateRoadmap`, `createGoal`, `updateGoal`, `linkProjectToGoal`, `unlinkProjectFromGoal`, `createKeyResult`, `updateKeyResult`, `recordKeyResultCheckIn`; CMP-022 (`key-result-progress`, `goal-rollup`, `smart-checks`, `week`); UI `StrategyEditModals`.
- **Data owned:** BusinessRoadmap, BusinessRoadmapHorizon (unique key/position per roadmap), BusinessGoal (`perspective?`, `isWig`, `progress` as write-through cache), ProjectGoal, BusinessKeyResult, BusinessKeyResultCheckIn (unique KR+week).
- **Contracts exposed:** API-017, API-016, API-015, API-012, API-008, API-011, API-010, API-009, API-013, API-014; services reused by FEAT-009.
- **Failure modes:** not owned → refused like an unknown Business; declared code taken → 409; cardinality → 400.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-019-001 | apps/server/src/modules/business/application/business-strategy-service.js; apps/server/src/app/api/business/strategy/route.js |
| FR-019-002..006 | apps/server/src/modules/project-manager/application/business-strategy-mutation-service.js; apps/server/src/app/api/business/roadmaps/**; api/business/goals/**; api/business/key-results/** |
| FR-019-006 | apps/server/src/modules/project-manager/progress/key-result-progress.js; progress/goal-rollup.js; progress/week.js |
| FR-019-007 | apps/server/src/modules/project-manager/progress/smart-checks.js; components/StrategyEditModals.jsx |
