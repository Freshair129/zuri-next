---
id: FEAT-067
title: Authorized agent context and vault resolution
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: implemented
legacy: [FR-057]
relations:
  depends_on: []
  decided_by: [ADR-061]
---

# FEAT-067 — Authorized agent context and vault resolution

## Summary

The one seam every LINE turn's private-memory access passes through before
any retrieval happens: resolve `ExternalIdentity`/`Person`/Membership and
thread/session assurance, derive server-owned agent/workspace/project scope,
and — only for that resolved, immutable scope — call GoVibe/MSP API-010
(`msp_vault_resolve`) before ever calling API-009 (memory list/upsert). No
value the model, the client payload, or a stale session supplies can widen
the vault set this seam already decided.

## Scope

**In:** `resolveAgentAuthorization`'s scope/policy derivation
(FR-067-001, ported into FEAT-061's context assembly); the
deterministic compatibility scope key (`scopedMemoryKey`); the canonical
MSP API-010 vault resolver and its shape validation
(`createMspVaultResolver`, `validateVaultSet`).
**Out:** the MSP transport itself (external, GoVibe-owned); the actual
memory read/write calls (API-009, `msp-memory-port.js` — consumed by, not
part of, this contract).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-067-001](requirements/FR-067-001-authorized-agent-context-and-vault-resolution.md) | Authorized agent context and vault resolution | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
