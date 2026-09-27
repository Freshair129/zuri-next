---
id: FEAT-057
title: Connector catalog and GitHub repository projection
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: building
legacy: [FR-130]
relations:
  depends_on: [FEAT-091, FR-004-001, FR-004-002]
  decided_by: [ADR-053]
---

# FEAT-057 — Connector catalog and GitHub repository projection

## Summary

The Platform Integrations page (`/platform/integrations`) lists the connectors this
product knows and shows, for the Business in view, a state derived from evidence —
never a hard-coded "CONNECTED". The requirement's main goal, a read-only projection of
a Business-owned GitHub repository's tree and files in the console, is specified but
blocked: nothing can yet establish that a bound repository holds no personal data.

## Scope

**In:** the connector catalog and its derived per-Business state (built); the GitHub
read-through projection (declared, blocked).
**Out:** GitHub writes, mirrors or sync state; repository metadata itself (FR-004-001,
FR-004-002, DOM-PRJ).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-057-001](requirements/FR-057-001-connector-state-is-derived-from-connection-evidence.md) | Connector state is derived from connection evidence | — |
| [FR-057-002](requirements/FR-057-002-read-only-github-projection-of-a-business.md) | Read-only GitHub projection of a Business-owned repository (declared, blocked) | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
