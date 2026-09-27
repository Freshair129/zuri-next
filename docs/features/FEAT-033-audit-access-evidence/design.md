---
id: SDD-033
title: "Audit Access Evidence — design"
---

# SDD-033 — Audit Access Evidence design

- **Components:** `CMP-034` (`access-history-service.js`).
- **Data owned:** none directly — reads `DOM-PRJ`'s `AuditEvent` (a
  sanctioned cross-domain read, `ADR-026` D5) and this domain's own
  `Membership`/`RoleBinding`.
- **Contracts exposed:** `API-086`.
- **Contracts consumed:** `DOM-PRJ` `AuditEvent`.
- **Main sequence:** 1. An owner opens the platform users page's read-only
  access-history panel. 2. `listAccessHistory` resolves authority for the
  requested scope, then filters `AuditEvent` by the new columns (Business/
  Tenant scope) or by a relational join through Membership/RoleBinding ids
  (Person scope — `AuditEvent` has no `personId` column by design). 3.
  `listBusinessAccess` reads current `Membership` rows for the Business
  directly, joining granter/revoker.
- **Failure modes:** a scope the caller does not own → 404, identical to a
  nonexistent scope; a Person-scope query → answered by relational join, not
  by a column that does not exist.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-033-001 | `apps/server/src/modules/identity/{access-invite-service.js,membership-grant-service.js,membership-lifecycle-service.js}`, `apps/server/src/modules/project-manager/application/audit.js` |
| FR-033-002 | `apps/server/src/app/api/platform/{access-history/route.js,businesses/[businessId]/grants/route.js}`, `apps/server/src/modules/identity/access-history-service.js`, `apps/server/src/app/(pm)/platform/users/page.jsx` |
