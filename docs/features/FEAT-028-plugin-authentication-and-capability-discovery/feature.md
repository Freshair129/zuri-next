---
id: FEAT-028
title: Plugin Authentication & Capability Discovery
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: building
legacy: [FR-123]
relations:
  depends_on: []
  decided_by: [ADR-031]
---

# FEAT-028 — Plugin Authentication & Capability Discovery

## Summary

A public-client, OAuth-style authorization-code exchange that lets a
first-party harness (Codex, Claude Code) obtain a short-lived delegated
identity from one signed-in Person's own consent — never a copy of their
browser session, never a widened platform grant.

## Scope

**In:** authorize (render + consent-form mint), token exchange, capability
discovery, revoke; consent-screen semantics; replay-revokes-session
behavior.
**Out:** the agent harness pairing/usage-report credential (retired,
`legacy:FR-220`); the Enterprise API key (FEAT owned elsewhere, `FR-008-002`).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-028-001](requirements/FR-028-001-plugin-authorization-code-exchange-with-explicit-consent.md) | Plugin authorization-code exchange with explicit consent | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
