---
id: FR-001-001
title: "Scope entities carry UUID + unique human code"
delivery: live
legacy: [FR-001 (split 1/3 — entities and codes)]
relations:
  specified_by: [SDD-001, API-076]
  derived_from: [BR-046, BR-047]
---

# FR-001-001 — Scope entities carry UUID + unique human code

The system SHALL persist Portfolio, Tenant, Business, Branch, LegalEntity and Workspace
rows with an internal UUID primary key and a unique human `code`; when no code is
supplied it SHALL generate one from a type prefix (`TNT`, `BUS`, `WS`, …) and the name,
retrying until unique. A Branch SHALL belong to a Business of the same Tenant and SHALL
never be modelled as a Tenant.

## Acceptance criteria

- AC-001-001-01 — Given a create request without `code`, when a Tenant named "Acme" is created, then it receives a unique `TNT…` code and an AuditEvent `TENANT/CREATED`.
- AC-001-001-02 — Given a Branch whose Business belongs to Tenant A, when the request names Tenant B, then the write is refused ("tenant != branch").
- AC-001-001-03 — Given a Workspace create with `scopeType` BUSINESS and no `businessId`, then validation refuses it (each scope type requires its parent id).

## Implementation

- apps/server/src/modules/project-manager/application/scope-service.js; apps/server/src/lib/validation/entities.js

## Verification

- TC-001-001 — Scope CRUD, codes and isolation (see [verification.md](../verification.md))
