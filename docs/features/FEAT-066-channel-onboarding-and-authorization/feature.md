---
id: FEAT-066
title: Verified channel onboarding
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: implemented
legacy: [FR-097]
relations:
  depends_on: [FR-029-001, FR-029-002, FR-029-003]
  decided_by: [ADR-060]
---

# FEAT-066 — Verified channel onboarding

## Summary

Draws the line between "a LINE signature proves the transport is real" and
"this subject may see private data or hold staff capability": a new channel
subject stays `PENDING` — a row that exists but grants nothing — until
server-owned linking/onboarding activates it and an active Membership
authorizes anything beyond public reply. This feature is the agent domain's
own consumer side of that lifecycle (turn/webhook/ingest wiring); the
lifecycle's model and mutation are owned by `DOM-IAM` (Identity).

## Scope

**In:** how the agent turn/webhook/ingest seam reads and respects
`ChannelIdentity` status before granting private-memory access or staff
capability (FR-066-001).
**Out:** the `ChannelIdentity` Prisma model itself, the link-token
mint/redeem routes, and the Membership authorization ladder — all owned by
`DOM-IAM` (legacy FR-029-001/095/096) and referenced here only as dependencies.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-066-001](requirements/FR-066-001-verified-channel-onboarding-agent-side-consumption.md) | Verified channel onboarding (agent-side consumption) | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
