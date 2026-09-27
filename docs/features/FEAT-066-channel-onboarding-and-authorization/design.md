---
id: SDD-066
title: "Verified channel onboarding — design"
---

# SDD-066 — Verified channel onboarding design

- **Components:** `CMP-151` — `auth-context.js` (reads
  `channelIdentityIsVerified` into `identityVerified`); `CMP-182` —
  `turn.js` (calls the CRM ingest seam, which resolves the channel subject).
- **Data owned:** none — `ChannelIdentity` is `DOM-IAM`'s model
  (`apps/server/src/modules/identity/channel-identity.js`).
- **Contracts exposed:** none new (this feature consumes IAM's contracts).
- **Contracts consumed:** `DOM-IAM`'s `findChannelIdentity`/
  `channelIdentityIsVerified` (`identity/channel-identity.js`),
  `resolveLineIdentity` (`identity/resolve-line-identity.js`), the
  link-token mint/redeem routes (`/api/identity/link-tokens*`); `DOM-PRJ`'s
  audit recorder (`project-manager/application/audit.js`) for the denial
  audit trail described in FR-061-001.
- **Main sequence:** 1. A LINE event's signature is verified by the
  transport seam (FEAT-062/DOM-LOA). 2. `resolveLinePrincipal`/
  `resolveAgentAuthorization` looks up or creates the `ChannelIdentity` row.
  3. `channelIdentityIsVerified` gates `identityVerified`, which in turn
  gates `privateMemoryAllowed` (FR-067-001). 4. Staff-capability tool
  calls additionally require an active Membership role
  (`identity/agent-tool-authorizer.js`).
- **Failure modes:** an unverified identity denies private memory and staff
  tools but still allows a public/grounded answer (FR-063-001); a
  namespace conflict is a hard error, never a silent cross-tenant merge.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-066-001 | `apps/server/src/modules/agent/auth-context.js`, `apps/server/src/modules/agent/turn.js`, `apps/server/src/modules/agent/line-binding-resolver.js`, `apps/server/src/modules/agent/line-channel-binding.js`, `apps/server/src/modules/agent/msp-thread-memory-port.js`, `apps/server/src/modules/crm/line-ingest-service.js`, `apps/server/src/modules/identity/channel-identity.js`, `apps/server/src/modules/identity/link-line-identity.js`, `apps/server/src/modules/identity/resolve-line-identity.js` |
