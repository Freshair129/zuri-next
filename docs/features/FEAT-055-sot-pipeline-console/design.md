---
id: SDD-055
title: "SoT pipeline console — design"
---

# SDD-055 — SoT pipeline console design

- **Components:** CMP-146 — `sot-plan.js` (parse, topological order, derivation), `sot-plan-service.js`, `sot-pipeline-graph.js`; CMP-145 — `sot-decision-service.js`.
- **Data owned:** SotDecision; the plan file.
- **Contracts exposed:** API-165, API-163, API-162, API-164.
- **Contracts consumed:** newest run per pipeline definition (API-159, FR-060-003); data-plane viewer resolution (DOM-IAM `sot-data-plane-auth.js`, FR-027-001).
- **Main sequence:** data plane submits → human decides → data plane exports and applies to its own stores → next run evidence changes derived status.
- **Failure modes:** invalid plan file → board fails loudly; unauthorized data-plane key → 403.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-055-001, FR-055-002 | apps/server/src/modules/integration/application/sot-plan.js; sot-plan-service.js; apps/server/contracts/sot-pipeline-plan.v1.json; apps/server/src/app/api/platform/sot/plan/route.js; apps/server/src/app/(pm)/platform/sot-pipeline/page.jsx |
| FR-055-003..005 | apps/server/src/modules/integration/application/sot-decision-service.js; apps/server/src/app/api/platform/sot/decisions/**; apps/server/src/app/(pm)/platform/sot-pipeline/inbox/page.jsx |
| FR-055-006 | apps/server/src/modules/integration/application/sot-pipeline-graph.js; apps/server/src/app/(pm)/platform/sot-pipeline/graph/page.jsx |
