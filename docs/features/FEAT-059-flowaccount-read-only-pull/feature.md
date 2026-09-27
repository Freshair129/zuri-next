---
id: FEAT-059
title: FlowAccount read-only pull pipeline
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: declared
legacy: [FR-125]
relations:
  depends_on: [FEAT-053, FEAT-054, FR-094-004]
  decided_by: [ADR-056]
---

# FEAT-059 — FlowAccount read-only pull pipeline

## Summary

An owner-authorized Business connects one FlowAccount (Thai accounting SaaS) account
through a provider-specific wizard under `/platform/integrations`, entering Client ID
and Client Secret write-only. A server-owned adapter pulls an approved set of read-only
resources into the raw ingestion substrate as evidence. Design only: no FlowAccount
code, route, schema or provisioner exists; implementation needs a phased plan and a
re-check of provider facts first.

## Scope

**In:** connection onboarding, company verification, read-only resource pull through
FEAT-053, cursor/reconciliation, rate limiting, failure evidence, computed health.
**Out:** provider writes, OpenID/refresh tokens, webhooks, attachments/PDF, bank channels,
schedulers, and any publication into Accounting/CRM/Sales/Inventory truth.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-059-001](requirements/FR-059-001-write-only-onboarding-with-company-verification.md) | Write-only onboarding with company verification | — |
| [FR-059-002](requirements/FR-059-002-read-only-pull-through-the-one-raw.md) | Read-only pull through the one raw ingestion path | — |
| [FR-059-003](requirements/FR-059-003-rate-limits-health-and-honest-claims.md) | Rate limits, health and honest claims | — |
| [NFR-059-001](requirements/NFR-059-001-provider-rate-headroom.md) | Provider rate headroom | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
