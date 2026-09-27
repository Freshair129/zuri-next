---
id: FEAT-033
title: Audit Access Evidence
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: implemented
legacy: [FEAT-030, FR-198, FR-199]
relations:
  depends_on: []
  decided_by: [ADR-026]
---

# FEAT-033 — Audit Access Evidence

## Summary

Closes the read-side gap the Access Grant Lifecycle (FEAT-030) opened
but did not answer: audit events gain queryable scope and the change they
made, and a Business/Tenant owner can finally read their own access history
and current grant roster — not only the installation operator.

## Scope

**In:** seven nullable `AuditEvent` columns (`tenantId`, `businessId`,
`reason`, `beforeJson`, `afterJson`, `requestId`, `sessionId`);
`listAccessHistory` and `listBusinessAccess` read models and their routes.
**Out:** `AuditEvent` itself, which stays owned by `DOM-PRJ`; retrofitting
every other domain's `recordAudit` call site (named follow-up, not in
scope).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-033-001](requirements/FR-033-001-auditevent-carries-queryable-scope-and-the-change.md) | AuditEvent carries queryable scope and the change made | — |
| [FR-033-002](requirements/FR-033-002-an-owner-can-read-their-own-access.md) | An owner can read their own access history and current grant roster | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
