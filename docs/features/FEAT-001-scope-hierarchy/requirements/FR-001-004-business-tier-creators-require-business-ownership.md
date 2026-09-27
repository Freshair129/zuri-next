---
id: FR-001-004
title: "Business-tier creators require Business ownership"
delivery: live
legacy: [FR-074 (split 1/3 — tier a)]
relations:
  specified_by: [API-076]
  derived_from: [BR-002]
---

# FR-001-004 — Business-tier creators require Business ownership

The system SHALL allow creating a Branch or a BUSINESS-scoped Workspace only when
`ownsBusiness(viewer, businessId)`; an unowned Business SHALL be refused as not found.

## Acceptance criteria

- AC-001-004-01 — Given a viewer who sees but does not own Business A, when they create a Branch in A, then 404 "Branch requires an existing business" is returned and nothing is written.

## Implementation

- apps/server/src/modules/project-manager/application/scope-service.js; apps/server/src/modules/identity/viewer-authority.js (consumed)

## Verification

- TC-001-003 — Three-tier creation authority and self-service binding (see [verification.md](../verification.md))
