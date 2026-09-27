---
id: FEAT-029
title: Production IAM Boundary
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-010, FR-094, FR-095, FR-096, FR-021, FR-022]
relations:
  depends_on: []
  decided_by: [ADR-022, ADR-028]
---

# FEAT-029 — Production IAM Boundary

## Summary

The canonical principal, the persisted session that carries live request
authority, and the one shared policy-enforcement point every trusted
request, agent turn, action gate and tool invocation must pass through
before touching protected data. This is the load-bearing feature every other
identity capability sits on top of.

## Scope

**In:** canonical `Person` resolution from any external binding; persisted,
revocable `Session` lifecycle including MFA (TOTP) and WebAuthn/passkey
step-up; the shared `resolveAuthorizationContext`/`authorizeScope` seam used
by web/API/agent/tool paths alike; the concrete LINE binding primitive
(`resolveLineIdentity`), account linking, staff/customer classification and
PDPA erase-revoke that instantiate the canonical contract for LINE.
**Out:** the viewer gate's Business-visibility answer (FEAT-023), the
per-Business domain-visibility rule (FEAT-024).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-029-001](requirements/FR-029-001-canonical-iam-principal-one-person-per-trusted.md) | Canonical IAM principal: one Person per trusted external binding | — |
| [FR-029-002](requirements/FR-029-002-persisted-session-lifecycle-with-mfa-passkey-step.md) | Persisted session lifecycle with MFA/passkey step-up | — |
| [FR-029-003](requirements/FR-029-003-shared-policy-enforcement-across-web-agent-and.md) | Shared policy enforcement across web, agent and tool paths | — |
| [FR-029-004](requirements/FR-029-004-line-identity-resolution-is-the-concrete-external.md) | LINE identity resolution is the concrete external-binding primitive | — |
| [FR-029-005](requirements/FR-029-005-line-as-an-identity-provider-end-to.md) | LINE as an identity provider end-to-end: linking, staff/customer split and PDPA erasure | — |
| [NFR-029-001](requirements/NFR-029-001-revocation-is-effective-on-the-next-request.md) | Revocation is effective on the next request | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
