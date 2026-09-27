---
id: FEAT-069
title: Device and handoff operations (retired Edge Device surfaces)
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: retired
legacy: [FR-140, FR-141]
relations:
  depends_on: [legacy:FR-144]
  decided_by: [ADR-060]
---

# FEAT-069 — Device and handoff operations (retired Edge Device surfaces)

## Summary

The agent domain's two Edge-Device-facing surfaces — a trusted LINE asset
handoff from the zuri-cli/Edge transport, and a cloud-side heartbeat
registry giving the console a liveness view of a paired device — both
retired from active product scope by ADR-095 (2026-09-24, "owner directed
that a device is no longer used to connect a worker to LINE OA"; a Business
now uses the browser-provisioned PRP LocalWorker client-key flow instead).
Converted here for traceability, not as live behavior: both identifiers
stay permanently assigned per ADR-095 D5, and their historical
implementation is recorded rather than restated as current capability.

## Scope

**In:** the historical asset-handoff and heartbeat contracts, as they were
implemented before removal, and the exact commit/decision that retired
each.
**Out:** the browser-provisioned PRP LocalWorker client-key flow that
replaces the device connection model (ADR-047, owned elsewhere); any new
device-pairing surface — none is declared.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-069-001](requirements/FR-069-001-trusted-line-asset-handoff-implementation-removed-gap.md) | Trusted LINE asset handoff (implementation removed, gap) | — |
| [FR-069-002](requirements/FR-069-002-edge-device-heartbeat-registry-retired.md) | Edge Device heartbeat registry (retired) | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
