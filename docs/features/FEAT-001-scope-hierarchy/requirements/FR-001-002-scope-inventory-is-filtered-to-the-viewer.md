---
id: FR-001-002
title: "Scope inventory is filtered to the viewer"
delivery: live
legacy: [FR-001 (split 2/3 — visible listing)]
relations:
  specified_by: [API-077]
  derived_from: [SEC-001, SEC-007]
---

# FR-001-002 — Scope inventory is filtered to the viewer

The system SHALL answer the scope inventory (`GET /api/scope`) only after resolving a
trusted viewer, returning for a non-operator only the Businesses the viewer sees, their
Tenants and Portfolios, the Workspaces scoped to those Businesses/Tenants/Portfolios
(non-archived), and the Projects owned by a visible Business or placed in a visible
null-owner Workspace. An installation operator SHALL receive the unfiltered inventory.

## Acceptance criteria

- AC-001-002-01 — Given a viewer who sees Business A only, when the scope is listed, then Business B, its Tenant and its Workspaces are absent.
- AC-001-002-02 — Given no session, when the scope is listed, then the request fails closed (401) before any data is read.

## Implementation

- apps/server/src/app/api/scope/route.js (`visibleScope`)

## Verification

- TC-001-001 — Scope CRUD, codes and isolation (see [verification.md](../verification.md))
