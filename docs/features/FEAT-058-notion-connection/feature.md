---
id: FEAT-058
title: Notion connection
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: building
legacy: [FEAT-046, FR-273, FR-274]
relations:
  depends_on: [FEAT-094, FEAT-054, FR-094-004]
  decided_by: [ADR-057]
---

# FEAT-058 — Notion connection

## Summary

A Business owner installs a Notion public connection from the web console through
server-side OAuth: tokens are exchanged and kept only in the credential vault, never
returned to the browser. Notion's signed webhooks are verified and recorded as minimal,
idempotent receipts; webhook content is never persisted or copied into any business
domain. An installation operator handles the one-time verification token.

## Scope

**In:** OAuth start and callback, token custody as `NOTION_OAUTH_TOKEN`, the webhook
endpoint (challenge, signature, receipts), one-time reveal and reset of the
verification token.
**Out:** reading or syncing Notion content; token refresh use; per-Business webhook
routing (receipts are installation-wide).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-058-001](requirements/FR-058-001-oauth-start-binds-a-single-use-state.md) | OAuth start binds a single-use state to Tenant, Business and actor | — |
| [FR-058-002](requirements/FR-058-002-the-callback-exchanges-the-code-server-side.md) | The callback exchanges the code server-side and vaults the tokens | — |
| [FR-058-003](requirements/FR-058-003-initial-verification-token-is-captured-once-and.md) | Initial verification token is captured once and pinned | — |
| [FR-058-004](requirements/FR-058-004-signed-events-become-receipts-only.md) | Signed events become receipts only | — |
| [FR-058-005](requirements/FR-058-005-operator-only-one-time-reveal-and-reset.md) | Operator-only one-time reveal and reset | — |
| [NFR-058-001](requirements/NFR-058-001-oauth-state-lifetime.md) | OAuth state lifetime | — |
| [NFR-058-002](requirements/NFR-058-002-webhook-body-bound.md) | Webhook body bound | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
