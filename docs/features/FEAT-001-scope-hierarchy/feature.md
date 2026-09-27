---
id: FEAT-001
title: Scope hierarchy & scope administration
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-001, FR-074, FR-075, FR-169]
relations:
  depends_on: [FR-023-001, FR-024-003, FR-030-001]
  decided_by: [ADR-002]
---

# FEAT-001 — Scope hierarchy & scope administration

## Summary

Maintains the scope chain every other record hangs from — Portfolio → Tenant → Business
(+ Branch, LegalEntity) → Workspace — each row with an internal UUID and a unique human
`code`. Owners provision and administer scope from the web console (Settings, "เพิ่มธุรกิจ"),
and each creator is authorized at exactly the scope it writes. A Business also declares
which feature capabilities apply to it (first: `physicalStock`).

## Scope

**In:** create/list of scope entities; Workspace rename/status/archive; per-tier creation
authority (Business owner, Tenant owner, self-service, installation operator); visible-scope
listing; Business capability flags.
**Out:** Membership/grant writing (IAM, FR-030-001); LegalEntity/TaxRegistrationBranch
field semantics (FR-031-002); shell rendering of scope (FEAT-002); Project ownership
(FEAT-003).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-001-001](requirements/FR-001-001-scope-entities-carry-uuid-unique-human-code.md) | Scope entities carry UUID + unique human code | — |
| [FR-001-002](requirements/FR-001-002-scope-inventory-is-filtered-to-the-viewer.md) | Scope inventory is filtered to the viewer | — |
| [FR-001-003](requirements/FR-001-003-workspace-update-and-archive.md) | Workspace update and archive | — |
| [FR-001-004](requirements/FR-001-004-business-tier-creators-require-business-ownership.md) | Business-tier creators require Business ownership | — |
| [FR-001-005](requirements/FR-001-005-tenant-tier-creators-require-tenant-ownership.md) | Tenant-tier creators require Tenant ownership | — |
| [FR-001-006](requirements/FR-001-006-self-service-business-provisioning-binds-the-creator.md) | Self-service Business provisioning binds the creator as owner | — |
| [FR-001-007](requirements/FR-001-007-installation-primitives-require-operator-authority.md) | Installation primitives require operator authority | — |
| [FR-001-008](requirements/FR-001-008-business-capabilities.md) | Business capabilities | — |
| [NFR-001-001](requirements/NFR-001-001-authority-is-evaluated-before-input-is-parsed.md) | Authority is evaluated before input is parsed | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
