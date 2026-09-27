---
id: FR-067-001
title: "Authorized agent context and vault resolution"
delivery: implemented
legacy: [FR-057]
relations:
  specified_by: [none]
  decided_by: [ADR-061]
---

# FR-067-001 — Authorized agent context and vault resolution

The system SHALL, for every LINE turn, resolve `ExternalIdentity`, `Person`,
Membership and thread/session assurance and a server-owned
agent/workspace/project scope (never populated from a model, client, or
LINE message body) before calling GoVibe/MSP API-010
(`msp_vault_resolve`), and SHALL call API-010 before any API-009 retrieval.
`createMspVaultResolver` SHALL reject calling `msp_vault_resolve` unless the
supplied authorization already carries `policy.decision === 'ALLOW'` and
`policy.privateMemoryAllowed === true` with exactly one authorized private
scope, and SHALL validate the returned vault set's shape
(`workspacePrivateVaultId` a non-blank string; `globalPrivateVaultIds`/
`sharedVaultIds` string arrays; `permissions.{read,writePrivate,writeShared}`
booleans; `permissions.policyVersion` a non-blank string) before trusting it.

## Acceptance criteria

- AC-067-001-01 — Given an authorization whose `authContext.policy.decision` is not `ALLOW`, when `createMspVaultResolver().resolve` is called, then it throws `API-010 vault resolution requires an ALLOW AuthContext` before any transport call.
- AC-067-001-02 — Given `authorizedVaults` with zero or more than one entry, when `.resolve` runs, then it throws `API-010 vault resolution requires exactly one authorized private scope`.
- AC-067-001-03 — Given an API-010 response missing `permissions.policyVersion`, when `validateVaultSet` runs, then it throws `API-010 response requires permissions.policyVersion` and the resolver never returns the malformed set to a caller.
- AC-067-001-04 — Given `operation: 'read'` and a returned `permissions.read !== true`, when `.resolve` completes validation, then it throws `API-010 denied read permission` — the resolver enforces the permission it was asked about, not merely whatever the transport returned.

## Implementation

- `apps/server/src/modules/agent/auth-context.js`, `apps/server/src/modules/agent/context.js`, `apps/server/src/modules/agent/memory-port.js`, `apps/server/src/modules/agent/msp-memory-port.js`, `apps/server/src/modules/agent/msp-stdio-transport.js`, `apps/server/src/modules/agent/msp-thread-memory-port.js`, `apps/server/src/modules/agent/msp-vault-resolver.js`, `apps/server/src/modules/agent/scoped-memory.js`
