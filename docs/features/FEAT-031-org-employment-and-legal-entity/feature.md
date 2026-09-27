---
id: FEAT-031
title: Org Employment & Legal Entity
type: domain-feature
owner: DOM-IAM
runtime: SRV-001
status: approved
delivery: implemented
legacy: [FEAT-028, FR-193, FR-194, FR-042]
relations:
  depends_on: []
  decided_by: [ADR-024, ADR-004]
---

# FEAT-031 — Org Employment & Legal Entity

## Summary

Separates "who works here" from "who may log in here" (a new `Employment`
HR record, absorbed into this domain from the legacy `people` module because
`people` carried no charter of its own), and moves `LegalEntity` under
`Tenant` so a Business can only reference a legal entity inside its own
isolation boundary, splitting VAT branch registration out of `Branch`.

## Scope

**In:** `Employment` create/on-leave/reinstate/end lifecycle and its
`hasSystemAccess` derivation from `Membership`; `LegalEntity.tenantId`
ancestry; `TaxRegistrationBranch` and `Branch.kind`; the People Directory's
placement as a peer ERP domain over Person/Membership/Employment.
**Out:** the Membership access grant itself (FEAT-030); billing's
consumption of the tax branch (owned by `DOM-COM`, referenced only);
attendance, leave, payroll and performance tracking (never in scope).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-IAM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-031-001](requirements/FR-031-001-employment-is-an-hr-record-separate-from.md) | Employment is an HR record, separate from Membership, that grants nothing | — |
| [FR-031-002](requirements/FR-031-002-legalentity-lives-inside-a-tenant-tax-branch.md) | LegalEntity lives inside a Tenant; tax branch registration is split from Branch | — |
| [FR-031-003](requirements/FR-031-003-people-directory-is-a-peer-erp-domain.md) | People Directory is a peer ERP domain over Person/Membership, not a Projects sub-screen | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
