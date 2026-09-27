---
id: FR-095-005
title: "A nightly sweep tombstones CRM content past its window"
part: FEAT-095-P03
owner: DOM-CRM
delivery: building
legacy: [FR-230 (split 2/3)]
relations:
  specified_by: [SDD-095, EVT-001]
  decided_by: [ADR-041, ADR-042]
---

# FR-095-005 — A nightly sweep tombstones CRM content past its window

The system SHALL run at most one completed sweep per UTC day (bearer-authenticated
`POST /api/crm/retention-sweep`, triggered nightly by the worker script) that, per Tenant
and effective window, archives then tombstones `MESSAGE_BODY_AND_ATTACHMENTS` content past
its window (FEAT-047), keeps envelope columns, skips rows a non-terminal LINE job
still references, refreshes the conversations' preview columns, and writes one
`RETENTION_SWEEP_COMPLETED` audit event per run with counts per class.

## Acceptance criteria

- AC-095-005-01 — Given a message past its window referenced by a QUEUED job, when the sweep runs, then it is not tombstoned and is counted as skipped.
- AC-095-005-02 — Given a second sweep request the same UTC day, when called, then it returns the first run's counts with `alreadyRanToday: true`.

## Verification

- TC-095-002 — Retention overrides and sweep (see [verification.md](../verification.md))
