---
id: FR-045-001
title: "A sales task is a Business-scoped record with a human code"
delivery: implemented
legacy: [FR-161 (split 1/4)]
relations:
  specified_by: [SDD-045, API-120]
---

# FR-045-001 — A sales task is a Business-scoped record with a human code

The system SHALL create a SalesTask for a Business with an internal UUID and a
generated code `TSK-YYYYMMDD-NNN` (Asia/Bangkok day, per-day sequence, unique per
Tenant), a title (≤ 200), optional description (≤ 2000), `type` (FOLLOW_UP, CALL,
LINE_MESSAGE, EMAIL, MEETING, DEMO, QUOTE; default FOLLOW_UP), `priority` (URGENT,
HIGH, NORMAL, LOW; default NORMAL), and a schedule: `SINGLE` (one `dueDate`, optional
`timeStart`/`timeEnd` HH:MM with end after start) or `RANGE` (`startDate` ≤ `dueDate`,
no time window). Creation is audited (`SALES_TASK_CREATED`).

## Acceptance criteria

- AC-045-001-01 — Given a RANGE task without `startDate`, when created, then it is refused with a validation error.
- AC-045-001-02 — Given the third task created on 2026-09-06 (Bangkok), when created, then its code is `TSK-20260906-003`.

## Implementation

- apps/server/src/modules/crm/sales-task-domain.js; apps/server/src/modules/crm/sales-task-service.js; apps/server/src/app/api/crm/sales-tasks/route.js; apps/server/src/app/api/crm/sales-tasks/[id]/route.js; apps/server/src/app/(pm)/customer/sales-tasks/page.jsx

## Verification

- TC-045-001 — Pure rules: schedule, transitions, code, due state (see [verification.md](../verification.md))
