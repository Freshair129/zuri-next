---
id: FR-029-003
title: "Shared policy enforcement across web, agent and tool paths"
delivery: building
legacy: [FR-096]
relations:
  specified_by: [SDD-029]
  decided_by: [ADR-022]
---

# FR-029-003 — Shared policy enforcement across web, agent and tool paths

Web/API requests, agent turns, actions and tools SHALL resolve trusted
principal, scope, membership and permission before any protected work.
Payload, prompt, model output and tool arguments SHALL NOT be able to widen
server-owned authority.

## Acceptance criteria

- AC-029-003-01 — Given an agent tool call whose arguments name a wider Business scope than the resolved viewer holds, when the call executes, then the resolved (narrower) scope governs, never the argument.
- AC-029-003-02 — Given a denied authorization check, when it is evaluated, then the deny happens before the protected operation runs, not after.

## Implementation

- `apps/server/src/modules/identity/{authorization-context.js,agent-tool-authorizer.js,session-port.js}`

## Verification

- TC-029-003 — Shared policy enforcement over web/agent/tool paths (see [verification.md](../verification.md))
