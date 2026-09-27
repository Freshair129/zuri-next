---
id: SDD-045
title: "Sales tasks (งานขาย) — design"
---

# SDD-045 — Sales tasks (งานขาย) design

- **Components:** CMP-095 — `sales-task-domain.js` (pure schemas, transitions, code, due state, summary) and `sales-task-service.js` (authorization, persistence, audit).
- **Data owned:** SalesTask.
- **Contracts exposed:** API-120, API-119.
- **Contracts consumed:** viewer authority (`ownsBusiness`, `seesBusiness`, `assertDomainVisible`, `hasPermission(SALES_TASK_WRITE_PERMISSION)`) and Membership reads (DOM-IAM); audit recorder.
- **Main sequence (action):** parse → load task → domain gate → write gate → transaction(version check → next status → `updateMany where version` → audit).
- **Failure modes:** code sequence exhaustion → 409 `SALES_TASK_CODE_EXHAUSTED`; concurrent actions → one wins, the other 409.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-045-001..004 | apps/server/src/modules/crm/sales-task-domain.js; apps/server/src/modules/crm/sales-task-service.js; apps/server/src/app/api/crm/sales-tasks/route.js; apps/server/src/app/api/crm/sales-tasks/[id]/route.js; apps/server/src/app/(pm)/customer/sales-tasks/page.jsx |
