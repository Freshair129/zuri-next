---
id: FR-061-004
title: "Agent/tool/MSP authorization"
delivery: implemented
legacy: [FR-098]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-061-004 — Agent/tool/MSP authorization

The system SHALL require every Gate E tool handler and every Gate F write
action to resolve authorization from the immutable AuthContext the turn
already produced (`requireToolAuthorization` in `tools.js`; `authorizeScope`
/ `resolveAuthorizationContext` in `action-gate.js` and
`identity/agent-tool-authorizer.js`), never from a raw `tenantId`/`businessId`
argument the caller supplies, and SHALL deny before any side effect,
auditing the denial without secrets or customer content.

## Acceptance criteria

- AC-061-004-01 — Given a tool handler called with a `customerId` belonging to a Business different from the resolved AuthContext scope, when `requireToolAuthorization` runs, then `authorizeScope` denies and the handler throws `TOOL_AUTHORIZATION_DENIED: ...` before any Prisma read.
- AC-061-004-02 — Given `toolArgs.tenantId` different from `viewer.tenantId`, when `authorizeAgentToolExecution` runs, then it returns `{allowed:false, reason:'CROSS_TENANT_ARGUMENT_FORBIDDEN'}` without resolving an authorization context.
- AC-061-004-03 — Given `viewer.identityVerified === false` or a non-`ACTIVE` `channelIdentity`, when any tool call is authorized, then it returns `{allowed:false, reason:'IDENTITY_PENDING'}` regardless of role.

## Implementation

- `apps/server/src/modules/agent/tools.js`, `apps/server/src/modules/agent/action-gate.js`, `apps/server/src/modules/identity/agent-tool-authorizer.js`, `apps/server/src/modules/identity/authorization-context.js`
