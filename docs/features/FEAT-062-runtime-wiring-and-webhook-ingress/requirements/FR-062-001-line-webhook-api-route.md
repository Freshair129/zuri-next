---
id: FR-062-001
title: "LINE webhook API route"
delivery: building
legacy: [FR-028]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-062-001 — LINE webhook API route

The system SHALL normalize an inbound LINE message-event batch and call
`handleAgentTurn` for Gate E read/answer, refusing an event whose tenant
cannot be resolved rather than minting one under a default tenant. The
route SHALL be the one HTTP seam a forwarding transport (the legacy
`zuri.command-agent`/zuri-cli bot) posts to.

## Acceptance criteria

- AC-062-001-01 — Given a webhook batch naming an unresolvable tenant, when the route is invoked, then the request is refused and no `Conversation`/`Message` row is minted under a default tenant.
- AC-062-001-02 — Given a well-formed, signature-verified LINE message event, when the route runs, then it calls `handleAgentTurn` exactly once per event and returns the turn's `response`.

## Implementation

- *(removed — see §9)* historically `apps/server/src/app/api/agent/line-webhook/route.js`, `apps/server/src/platform/integrations/providers/line/line-oa-evidence.js`
