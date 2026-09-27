---
id: FR-061-002
title: "Agent write/action gate (Gate F)"
delivery: implemented
legacy: [FR-026]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-061-002 — Agent write/action gate (Gate F)

The system SHALL keep write-capable tools in a registry (`write-tools.js`)
kept separate from the Gate E registry, refusing at registration any
descriptor whose `effect` is not `WRITE`, that has no `execute` function, or
whose `sensitivity` is not exactly `LOW` or `HIGH`. The system SHALL
authorize each write in `executeAgentAction` by resolving the LINE
principal, computing a policy decision (`authorizeScope` plus RBAC role
match against `allowRoles`, or resource ownership via `ownerCheck`), and —
for `sensitivity: HIGH` — consuming a single-use step-up token
(`consumeStepUp`) inside the SAME database transaction as the write itself,
so a failed action rolls the token consumption back with the write. The
system SHALL write exactly one append-only `AGENT_ACTION` audit event per
attempt, recording `DENIED` or `EXECUTED`.

## Acceptance criteria

- AC-061-002-01 — Given a HIGH-sensitivity action with no `stepUpToken`, when `executeAgentAction` runs, then `consumeStepUp` throws `STEP_UP_REQUIRED: this action needs a step-up token` and the whole transaction (including the action's `execute()` write) rolls back.
- AC-061-002-02 — Given `deactivate_customer` targeting a customer outside the caller's Membership scope with no ownership match, when authorized, then `authorizeAgentAction` returns `{allowed:false, reason: 'principal lacks a permitting role and does not own the target'}` and an `AGENT_ACTION` `DENIED` audit event is recorded with no state change.
- AC-061-002-03 — Given `update_own_display_name` where the LINE principal's own `customerId` equals the target's, when authorized with no staff role present, then `ownerCheck` allows it (LOW sensitivity, no step-up token required).

## Implementation

- `apps/server/src/modules/agent/action-gate.js`, `apps/server/src/modules/agent/write-tools.js`, `apps/server/src/modules/agent/step-up.js`, `apps/server/src/modules/agent/line-project-work-tools.js`
