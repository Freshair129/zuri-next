---
id: FR-066-001
title: "Verified channel onboarding (agent-side consumption)"
delivery: implemented
legacy: [FR-097]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-066-001 — Verified channel onboarding (agent-side consumption)

The system SHALL treat a valid LINE signature as proof of transport origin
only — never of Person identity or staff capability — and SHALL keep a new
channel subject's private-data and staff-tool access denied
(`channelIdentityIsVerified` requires `status === 'ACTIVE'` and both
`verifiedAt` and `linkedAt` set, with no `revokedAt`) until server-owned
linking/onboarding activates the row and an active Membership authorizes
the specific capability requested. `resolveAgentAuthorization`
(FR-067-001) SHALL read this verification state on every turn rather
than caching or assuming it.

## Acceptance criteria

- AC-066-001-01 — Given a first-ever message from a LINE user with no existing `ChannelIdentity` row, when the turn resolves identity, then a `PENDING` row is created (or found) but `privateMemoryAllowed` remains `false` for that turn.
- AC-066-001-02 — Given a `ChannelIdentity` row with `status: 'ACTIVE'` but a `revokedAt` timestamp set, when `channelIdentityIsVerified` is evaluated, then it returns `false` — revocation always wins regardless of a stale ACTIVE status.
- AC-066-001-03 — Given a channel identity resolved under a different `channelAccountId`/`tenantId` namespace than the row's own, when `findChannelIdentity` runs, then it throws `CHANNEL_IDENTITY_NAMESPACE_CONFLICT` rather than silently returning a cross-namespace row.

## Implementation

- `apps/server/src/modules/agent/auth-context.js`, `apps/server/src/modules/agent/turn.js`, `apps/server/src/modules/agent/line-binding-resolver.js`, `apps/server/src/modules/agent/line-channel-binding.js`, `apps/server/src/modules/agent/msp-thread-memory-port.js`, `apps/server/src/modules/crm/line-ingest-service.js`, `apps/server/src/modules/identity/channel-identity.js`, `apps/server/src/modules/identity/link-line-identity.js`, `apps/server/src/modules/identity/resolve-line-identity.js`
