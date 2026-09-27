---
id: SDD-067
title: "Authorized agent context and vault resolution — design"
---

# SDD-067 — Authorized agent context and vault resolution design

- **Components:**
  - `CMP-151` — `auth-context.js` (`resolveAgentAuthorization`).
  - `CMP-183` — `msp-vault-resolver.js`
    (`createMspVaultResolver`, `validateVaultSet`).
  - `CMP-176` — `scoped-memory.js` (`scopedMemoryKey`,
    the deterministic Zuri-compatibility scope key, distinct from API-010's
    opaque vault ids).
  - `CMP-173` — `msp-stdio-transport.js`,
    `msp-thread-memory-port.js`, `msp-memory-port.js` (consumers of the
    resolved vault set, not the resolution contract itself).
- **Data owned:** none — MSP owns the vault and its opaque ids; this domain
  only assembles and passes the AuthContext.
- **Contracts exposed:** none as HTTP (in-process resolver only).
- **Contracts consumed:** GoVibe/MSP API-010 (`msp_vault_resolve`) and,
  downstream, API-009 (`msp_memory_upsert`/`msp_memory_list`) — both
  external, injected transports.
- **Main sequence:** 1. `resolveAgentAuthorization` resolves identity,
  Membership and server-owned scope into an immutable `authContext` +
  `policy` + exactly one `authorizedVaults` entry (or zero, if denied). 2.
  `assembleAgentContext` (FEAT-061) passes that authorization into
  `createMspVaultResolver().resolve`. 3. The resolver asserts `ALLOW` +
  exactly-one-scope, calls `msp_vault_resolve`, and validates the response
  shape before returning it.
- **Failure modes:** a non-`ALLOW` policy, a wrong vault count, or a
  malformed API-010 response are all hard failures before any memory
  read/write is attempted — there is no silent degrade path here (contrast
  FEAT-062's ports, which do degrade gracefully when unconfigured).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-067-001 | `apps/server/src/modules/agent/auth-context.js`, `apps/server/src/modules/agent/context.js`, `apps/server/src/modules/agent/memory-port.js`, `apps/server/src/modules/agent/msp-memory-port.js`, `apps/server/src/modules/agent/msp-stdio-transport.js`, `apps/server/src/modules/agent/msp-thread-memory-port.js`, `apps/server/src/modules/agent/msp-vault-resolver.js`, `apps/server/src/modules/agent/scoped-memory.js` |
