---
id: FR-024-005
title: "Product Owner is a Business-scoped RoleBinding, not a global role"
delivery: live
legacy: [FR-076]
relations:
  specified_by: [SDD-024]
  decided_by: [ADR-021]
---

# FR-024-005 — Product Owner is a Business-scoped RoleBinding, not a global role

A Person SHALL be able to hold one active generic `RoleBinding` with
`roleKey=PRODUCT_OWNER` per assigned Business inside a customer Tenant; the
registry SHALL expand it only to Product permissions for that Business, and
SHALL NEVER expand it to Business/Tenant/Workspace ownership, Resource/
Operations, Marketing, Platform, Integration, secret or LINE/import
authority. Bindings SHALL be Business-scoped, revocable and audited, and
SHALL fail closed.

## Acceptance criteria

- AC-024-005-01 — Given a Person holding `PRODUCT_OWNER` on Business A only, when they attempt a Resource/Operations write on Business A, then it is refused.
- AC-024-005-02 — Given a Person holding `PRODUCT_OWNER` on two Businesses, when one binding is revoked, then the other binding's authority is unaffected.

## Implementation

- `apps/server/src/modules/identity/{product-owner-authority.js,product-owner-service.js,rbac.js,rbac-service.js}`

## Verification

- TC-024-003 — Product Owner Business-scoped binding (see [verification.md](../verification.md))
