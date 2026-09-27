---
id: FR-061-003
title: "End-to-end agent turn"
delivery: implemented
legacy: [FR-027]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-061-003 — End-to-end agent turn

The system SHALL compose one LINE turn end-to-end (`handleAgentTurn`):
ingest the inbound message through the CRM ingest seam, assemble the Gate E
context (FR-061-001), optionally run one Gate F action (FR-061-002),
and produce exactly one `response`. A denied action or an unmet step-up
requirement (`AGENT_ACTION_DENIED` / `STEP_UP_REQUIRED`) SHALL degrade to a
graceful `{ kind: 'ACTION_DENIED' | 'STEP_UP_REQUIRED', action, reason }`
response rather than throwing; any other action-gate error SHALL propagate
as a real fault, never be swallowed as a graceful outcome.

## Acceptance criteria

- AC-061-003-01 — Given an `action` whose gate throws `AGENT_ACTION_DENIED: ...`, when `handleAgentTurn` catches it, then the turn returns `{ response: { kind: 'ACTION_DENIED', action, reason } }` without throwing.
- AC-061-003-02 — Given an `action` naming a name absent from the registry (`unknown write action: X`), when the gate throws, then `handleAgentTurn` re-throws it rather than matching it against the graceful-degradation pattern.
- AC-061-003-03 — Given no `action`, a configured `businessKnowledge` and `model`, and a duplicate inbound event (`inbound.created.message === false`), when the turn runs, then the response is `{ kind: 'DUPLICATE', skipReply: true }` and no model call is made.

## Implementation

- `apps/server/src/modules/agent/turn.js`, `apps/server/src/modules/agent/index.js`
