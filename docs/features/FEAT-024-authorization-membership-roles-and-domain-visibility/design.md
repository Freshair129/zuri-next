---
id: SDD-024
title: "Authorization — Membership, Roles & Domain Visibility — design"
---

# SDD-024 — Authorization — Membership, Roles & Domain Visibility design

- **Components:** `CMP-051`
  (`profile-permission-service.js`, `platform-users-view.js`) — the
  administration seam; `CMP-038` (`viewer-domains.js`,
  `resolve-viewer.js`) — the pure per-Business visibility rule, no I/O;
  `CMP-050` (`product-owner-authority.js`,
  `product-owner-service.js`, `rbac.js`, `rbac-service.js`) — the RoleBinding
  registry and resolution.
- **Data owned:** `Membership` (role, `domainKeysJson`), `RoleBinding`
  (`roleKey=PRODUCT_OWNER`).
- **Contracts exposed:** `API-091`, `API-093`.
- **Contracts consumed:** none.
- **Main sequence:** 1. Owner opens `/platform/users`. 2.
  `listUserPermissions` returns only manageable rows. 3. Owner edits a row's
  role/domain allow-list via `updateUserPermissions`, or attaches a new
  Person via `addBusinessMembership`. 4. Every subsequent request from that
  Person re-resolves `domainsForBusiness` fresh — no cached grant.
- **Failure modes:** non-owner/non-operator caller → refused before any data
  loads; grant to `OWNER` via the attach path → refused; a Business-scoped
  read with no matching domain grant → 404, indistinguishable from an
  unknown Business.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-024-001 | `apps/server/src/app/(pm)/profile/page.jsx`, `apps/server/src/app/api/profile/route.js` |
| FR-024-002 | `apps/server/src/app/(pm)/platform/users/page.jsx`, `apps/server/src/app/api/platform/users/{route.js,memberships/route.js}`, `apps/server/src/modules/identity/{platform-users-view.js,profile-permission-service.js}` |
| FR-024-003 | `apps/server/src/modules/identity/{resolve-viewer.js,viewer-domains.js}`, `apps/server/src/modules/crm/{conversation-read-model.js,customer-consent-service.js}`, `apps/server/src/modules/people/application/{employment-service.js,people-service.js}`, `apps/server/src/modules/market-intelligence/application/market-observation-service.js` |
| FR-024-004 | `apps/server/src/app/(pm)/platform/users/page.jsx`, `apps/server/src/modules/identity/profile-permission-service.js` |
| FR-024-005 | `apps/server/src/modules/identity/{product-owner-authority.js,product-owner-service.js,rbac.js,rbac-service.js}` |
