---
id: FR-052-005
title: "Health is read-only and rides the existing worker tick, never a second process"
delivery: live
legacy: [FR-190 (worker integration, not a separate legacy split — same row as FR-052-003/004)]
relations:
  specified_by: [API-137, EVT-002]
  decided_by: [ADR-048]
---

# FR-052-005 — Health is read-only and rides the existing worker tick, never a second process

The system SHALL expose `GET /api/line-oa/accounts/{id}/transport-health` as a
pure read (states, timestamps and durations only, never channel credentials or
the other endpoint's contents), SHALL perform no write and change no provider
configuration, and SHALL carry its hourly sweep on the existing conversation
worker tick using a durable, compare-and-set checkpoint rather than a second
scheduled process.

## Acceptance criteria

- AC-052-005-01 — Given the transport-health sweep fails on one tick, when the worker tick runs, then the conversation-answering work of that same tick still completes (the sweep failure is logged, never fatal to the tick).
- AC-052-005-02 — Given a paused account, when the sweep runs, then that account is excluded from classification.

## Implementation

- `apps/server/src/app/api/line-oa/accounts/[id]/transport-health/route.js`, `application/line-transport-health-schedule.js`, `apps/server/src/app/api/line-oa/worker/route.js`

## Verification

- TC-052-005 — Non-fatal sweep on the shared worker tick (see [verification.md](../verification.md))
