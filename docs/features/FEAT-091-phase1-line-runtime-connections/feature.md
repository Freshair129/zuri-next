---
id: FEAT-091
title: Phase 1 LINE runtime connections
type: cross-domain-feature
owner: DOM-INT
runtime: SRV-001
participants:
  - domain: DOM-AGT
    part: FEAT-091-P01
    role: "Model provider port and allow-lists"
  - domain: DOM-INT
    part: FEAT-091-P02
    role: "Phase-1 connection registry and secret-manager resolution"
  - domain: DOM-AGT
    part: FEAT-091-P03
    role: "Runtime model selection order"
  - domain: DOM-INT
    part: FEAT-091-P04
    role: "Platform Integrations management and computed health"
status: draft
delivery: building
legacy: [FEAT-004, FR-048, FR-079, FR-080]
relations:
  depends_on: [API-140, API-161, FEAT-054]
  decided_by: [ADR-052, ADR-053, ADR-050]
---

# FEAT-091 — Phase 1 LINE runtime connections

## Summary

The LINE answer runtime needs a model provider credential chosen for the trusted
Business, resolved from a secret manager and never guessed. This feature provides the
provider-neutral model port with a fixed public-LINE allow-list, the Business-scoped
connection registry and secret-manager resolution that feeds it, the runtime's
fail-closed selection order, and the owner-facing Platform Integrations page that shows
every connection's computed health without exposing secret material.

## Scope

**In:** model provider port and allow-lists; Phase-1 connection selection
(`PHASE1_LINE_LLM`, ACTIVE, PRIMARY, exactly one); secret-manager adapters; runtime
source rules; Platform Integrations list/create with computed health.
**Out:** Business-entered model keys (FEAT-054 — consumed here first); LINE
transport (FEAT-093); promotion/rotation/revocation UI for Phase-1 connections (not built).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-091-P01 | Model provider port and allow-lists | DOM-AGT | SRV-001 | FR-091-001, FR-091-002 |
| FEAT-091-P02 | Phase-1 connection registry and secret-manager resolution | DOM-INT | SRV-001 | FR-091-003, FR-091-004 |
| FEAT-091-P03 | Runtime model selection order | DOM-AGT | SRV-001 | FR-091-005 |
| FEAT-091-P04 | Platform Integrations management and computed health | DOM-INT | SRV-001 | FR-091-006, FR-091-007 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-091-001](requirements/FR-091-001-one-provider-neutral-model-port-with-fixed.md) | One provider-neutral model port with fixed allow-lists | FEAT-091-P01 |
| [FR-091-002](requirements/FR-091-002-calls-are-bounded-traced-and-never-fall.md) | Calls are bounded, traced and never fall back | FEAT-091-P01 |
| [FR-091-003](requirements/FR-091-003-exactly-one-binding-scoped-phase-1-connection.md) | Exactly one binding-scoped Phase-1 connection is selected | FEAT-091-P02 |
| [FR-091-004](requirements/FR-091-004-secrets-resolve-through-an-environment-selected-secret.md) | Secrets resolve through an environment-selected secret manager | FEAT-091-P02 |
| [FR-091-005](requirements/FR-091-005-the-runtime-prefers-the-businesss-own-key.md) | The runtime prefers the Business's own key and fails closed | FEAT-091-P03 |
| [FR-091-006](requirements/FR-091-006-owners-inspect-and-create-connection-metadata-only.md) | Owners inspect and create connection metadata only | FEAT-091-P04 |
| [FR-091-007](requirements/FR-091-007-connection-health-is-computed-not-stored.md) | Connection health is computed, not stored | FEAT-091-P04 |
| [NFR-091-001](requirements/NFR-091-001-model-call-timeout-bounds.md) | Model call timeout bounds | — |
| [NFR-091-002](requirements/NFR-091-002-channel-staleness-window.md) | Channel staleness window | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
