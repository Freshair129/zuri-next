---
id: SDD-052
title: "Transport health and deployment liveness — design"
---

# SDD-052 — Transport health and deployment liveness design

- **Components:** `CMP-118` (`line-transport-health.js` — the
  read plus hourly-cached probe and sweep) · `CMP-119`
  (`transport-health.js`, pure classifiers) ·
  `CMP-120` (`transport-health-presentation.js`,
  console chip copy) · `CMP-121`
  (`line-transport-health-schedule.js`, the checkpoint-driven due-check).
- **Data owned:** `LineOaWorkerCheckpoint` (kind = transport-health sweep);
  reads only from `LineConversationJob` and Integration evidence — no new
  column on `LineOaAccount`.
- **Contracts exposed:** `API-125`, `API-137`; rides
  `EVT-002`.
- **Contracts consumed:** none external (pure classifiers plus existing rows).
- **Main sequence:** 1. worker tick calls `runDueLineTransportHealth`. 2. the
  checkpoint's `nextDueAt` gates whether an hourly endpoint probe runs this
  tick. 3. silence is classified from existing rows on every read regardless
  of the probe cadence. 4. the settings-page chip renders the worse of the two
  states.
- **Failure modes:** sweep failure → logged, checkpoint left for the next due
  tick, worker tick still answers conversations; probe failure → `UNKNOWN`,
  never a guessed match state.

## Implementation map

| Requirement | Current code |
|---|---|
| FR-052-001 | `apps/server/src/app/api/health/route.js` |
| FR-052-002 | `apps/server/src/lib/public-base-url.js`, `apps/server/src/app/layout.jsx` |
| FR-052-003 | `apps/server/src/modules/line-oa-studio/domain/transport-health.js` |
| FR-052-004 | `apps/server/src/modules/line-oa-studio/domain/transport-health.js`, `application/line-transport-health.js` |
| FR-052-005 | `apps/server/src/app/api/line-oa/accounts/[id]/transport-health/route.js`, `application/line-transport-health-schedule.js`, `apps/server/src/app/api/line-oa/worker/route.js` |
