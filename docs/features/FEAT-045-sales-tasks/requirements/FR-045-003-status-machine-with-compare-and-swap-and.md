---
id: FR-045-003
title: "Status machine with compare-and-swap and no deletion"
delivery: implemented
legacy: [FR-161 (split 3/4)]
relations:
  specified_by: [SDD-045, API-119]
---

# FR-045-003 — Status machine with compare-and-swap and no deletion

The system SHALL apply actions `UPDATE`, `ASSIGN`, `START` (OPEN→IN_PROGRESS),
`COMPLETE` (OPEN|IN_PROGRESS→DONE, optional outcome), `CANCEL` (OPEN|IN_PROGRESS→
CANCELLED, optional reason) and `REOPEN` (DONE|CANCELLED→OPEN); UPDATE and ASSIGN are
refused on a closed task; every action carries the task `version` and is a
compare-and-swap (409 `SALES_TASK_VERSION_CONFLICT`), an invalid transition is 409
`SALES_TASK_STATUS_INVALID`, and each accepted action writes one audit row. Tasks are
never deleted.

## Acceptance criteria

- AC-045-003-01 — Given a DONE task, when UPDATE is requested, then 409 `SALES_TASK_STATUS_INVALID`.
- AC-045-003-02 — Given a stale version, when any action is requested, then 409 `SALES_TASK_VERSION_CONFLICT` and the row is unchanged.
- AC-045-003-03 — Given a CANCELLED task, when REOPEN is requested, then status becomes OPEN and version increments.

## Verification

- TC-045-001 — Pure rules: schedule, transitions, code, due state (see [verification.md](../verification.md))
- TC-045-002 — Service authorization, links and CAS (see [verification.md](../verification.md))
- TC-045-003 — Console flow (see [verification.md](../verification.md))
