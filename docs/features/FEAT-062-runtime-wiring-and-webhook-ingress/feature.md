---
id: FEAT-062
title: Runtime wiring and webhook ingress
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: building
legacy: [FR-028, FR-029]
relations:
  depends_on: []
  decided_by: [ADR-060]
---

# FEAT-062 — Runtime wiring and webhook ingress

## Summary

The legacy HTTP seam that turned an inbound LINE webhook batch into an
end-to-end agent turn (`POST /api/agent/line-webhook` → `handleAgentTurn`),
and the port-composition function (`createAgentPorts`) that was meant to
bind that turn to real MSP memory and GenesisBlockDB knowledge instead of
in-memory/Prisma defaults. Both exist as tested library code; neither has a
live production caller today (§9).

## Scope

**In:** the webhook route's historical contract (normalize LINE events, call
`handleAgentTurn`, tenant-scope refusal); `createAgentPorts`'s MSP/GKS
port-binding shape and its graceful degrade-to-default behaviour.
**Out:** the native SERVER LINE admission/answer path that has since
replaced this seam in production (FEAT-063/008, owned jointly with
`line-oa-studio`'s `LineConversationJob` admission — not restated here);
the LINE OA Studio account model and its own webhook route
(`POST /api/line-oa/accounts/[id]/webhook`, DOM-LOA).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-062-001](requirements/FR-062-001-line-webhook-api-route.md) | LINE webhook API route | — |
| [FR-062-002](requirements/FR-062-002-agent-runtime-ports.md) | Agent runtime ports | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
