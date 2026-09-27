---
id: FEAT-023
title: Entry & Viewer Gate
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-031, FR-044]
relations:
  depends_on: []
  decided_by: [ADR-019]
---

# FEAT-023 — Entry & Viewer Gate

## Summary

The one server-side answer to "who is this, and which Businesses may they
enter" and the minimal pre-shell routing that acts on it. Every other
authorization decision in the product starts from the viewer this feature
resolves. Used by every surface: web console, LINE, API/MCP, agent turns.

## Scope

**In:** resolving a trusted request into a viewer (`role`, `visibleBusinessIds`,
`ownedBusinessIds`, `visibleDomains`, `isPlatform`); the pre-shell route
sequence (Landing → Login → Business Routing → BusinessShell) that consumes
it.
**Out:** per-Business domain visibility (FEAT-024), Profile-first
onboarding state machine (FEAT-025), session issuance/revocation
mechanics (FEAT-029).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-023-001](requirements/FR-023-001-viewer-gate-resolves-one-authoritative-principal-snapshot.md) | Viewer gate resolves one authoritative principal snapshot | — |
| [FR-023-002](requirements/FR-023-002-entry-routing-is-a-minimal-pre-shell.md) | Entry routing is a minimal pre-shell sequence gated by the viewer | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
