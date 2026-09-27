---
id: FEAT-054
title: Model provider credentials (API keys, Private Runtime Platform)
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-045, FR-242, FR-266, FR-267]
relations:
  depends_on: [FEAT-094, FR-094-004]
  decided_by: [ADR-047, ADR-046]
---

# FEAT-054 — Model provider credentials (API keys, Private Runtime Platform)

## Summary

Every server-executed LINE answer calls a real model under the Business's own
credential. A Business owner enters the model provider API key in the browser
(write-only); the server proves it live against the provider before storing it in the
credential vault as a `MODEL_PROVIDER_KEY`. The operator's Private Runtime Platform
(PRP) can be chosen instead so customer messages never reach an external provider.
The vault itself (FEAT-094) is generalised here to further credential kinds.

## Scope

**In:** vault credential kinds beyond `LINE_CHANNEL`; model-provider credential
provision/rotate/revoke/validate routes and status read; PRP provider option and its
validation; the worker-side resolver of a Business's model credential.
**Out:** the Studio key card and readiness gate (FEAT-050); the answer call itself
(DOM-AGT); the Phase-1 operator model credential path (FEAT-091).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-054-001](requirements/FR-054-001-the-vault-holds-typed-credential-kinds.md) | The vault holds typed credential kinds | — |
| [FR-054-002](requirements/FR-054-002-a-credential-never-resolves-as-another-kind.md) | A credential never resolves as another kind | — |
| [FR-054-003](requirements/FR-054-003-a-business-owner-provisions-a-model-key.md) | A Business owner provisions a model key write-only | — |
| [FR-054-004](requirements/FR-054-004-status-revoke-and-re-validate-follow-the.md) | Status, revoke and re-validate follow the vault lifecycle | — |
| [FR-054-005](requirements/FR-054-005-private-runtime-platform-as-a-provider.md) | Private Runtime Platform as a provider | — |
| [FR-054-006](requirements/FR-054-006-the-worker-resolves-the-businesss-own-model.md) | The worker resolves the Business's own model credential | — |
| [NFR-054-001](requirements/NFR-054-001-provider-probe-timeout.md) | Provider probe timeout | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
