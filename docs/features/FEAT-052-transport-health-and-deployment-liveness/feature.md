---
id: FEAT-052
title: Transport health and deployment liveness
type: domain-feature
owner: DOM-LOA
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-142, FR-190]
relations:
  depends_on: []
  decided_by: [ADR-048]
---

# FEAT-052 — Transport health and deployment liveness

## Summary

Two independent read-only health surfaces: a deployment liveness probe with
no session (gates container health and ngrok startup) and a per-account LINE
transport reachability report (is the channel silent, is LINE's configured
webhook endpoint still this deployment's own route). Neither writes anything
or changes provider configuration; both exist so a silent failure is visible
on a screen instead of requiring a database query.

## Scope

**In:** `GET /api/health`; the deployment's public-origin resolution
(`PUBLIC_BASE_URL`); inbound-silence classification (OK/QUIET/SILENT);
webhook-endpoint-match classification (MATCHED/MISMATCHED/DISABLED/UNKNOWN);
the durable, stateless-safe worker checkpoint that schedules the hourly probe.
**Out:** any write to LINE's webhook configuration (out of scope by design —
read-only); the worker tick's conversation-answering behavior (`FEAT-050`).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-052-001](requirements/FR-052-001-deployment-liveness-probe.md) | Deployment liveness probe | — |
| [FR-052-002](requirements/FR-052-002-public-origin-resolves-from-one-runtime-variable.md) | Public origin resolves from one runtime variable, never assumed | — |
| [FR-052-003](requirements/FR-052-003-inbound-silence-is-classified-against-configurable-thresholds.md) | Inbound silence is classified against configurable thresholds | — |
| [FR-052-004](requirements/FR-052-004-webhook-endpoint-match-is-probed-at-most.md) | Webhook endpoint match is probed at most hourly | — |
| [FR-052-005](requirements/FR-052-005-health-is-read-only-and-rides-the.md) | Health is read-only and rides the existing worker tick, never a second process | — |
| [NFR-052-001](requirements/NFR-052-001-the-health-probe-never-leaks-internal-detail.md) | The health probe never leaks internal detail | — |
| [NFR-052-002](requirements/NFR-052-002-the-transport-health-sweep-is-advisory-and.md) | The transport-health sweep is advisory and restart-safe | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
