---
id: FEAT-027
title: SoT Data-Plane Service Account
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: live
legacy: [FR-102]
relations:
  depends_on: []
  decided_by: []
---

# FEAT-027 — SoT Data-Plane Service Account

## Summary

A narrow, Tenant-bound bearer credential that lets the SoT (source-of-truth)
pipeline's external data plane authenticate to the submit/export endpoints
without a browser session and without installation-operator authority.

## Scope

**In:** `SotDataPlaneKey` mint/revoke/lookup and the `resolveSotDataPlaneViewer`
request-identity resolver.
**Out:** the FR-055-003, FR-055-004, FR-055-005 submit/export endpoints themselves (owned by another
domain); any Person-shaped viewer concept.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-027-001](requirements/FR-027-001-sotdataplanekey-authenticates-the-external-data-plane-scoped.md) | SotDataPlaneKey authenticates the external data plane, scoped to one Tenant | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
