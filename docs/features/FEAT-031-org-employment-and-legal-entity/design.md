---
id: SDD-031
title: "Org Employment & Legal Entity — design"
---

# SDD-031 — Org Employment & Legal Entity design

- **Components:** `CMP-039` (`apps/server/src/modules/people/application/employment-service.js`,
  `people-service.js`) — HR lifecycle and roster derivation, absorbed from
  the legacy `people` module (no charter of its own); `CMP-042`
  (schema-level; consumed by `DOM-COM`'s `billing-invoice-service.js`).
- **Data owned:** `Employment`, `LegalEntity`, `TaxRegistrationBranch`,
  `Branch.kind`/`Branch.taxRegistrationBranchId`.
- **Contracts exposed:** none (read by `people-service.js` and by
  `DOM-COM`'s billing service through the shared schema, not through an
  identity-owned API contract).
- **Contracts consumed:** `DOM-PRJ` `Business`/`Tenant` ancestry.
- **Main sequence:** 1. HR creates an Employment row for a Person at a
  Business. 2. `people-service.js` reads Employment for the roster and joins
  `hasSystemAccess` from Membership. 3. A billing document requests a tax
  invoice; `billing-invoice-service.js` reads the Branch's linked
  `TaxRegistrationBranch` and refuses if none is configured or it belongs to
  a different LegalEntity.
- **Failure modes:** ending an Employment never touches Membership and vice
  versa (two acts, two authors); a tax-invoice request against an
  unconfigured or mismatched tax branch → `422`.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-031-001 | `apps/server/src/app/api/people/employment/**`, `apps/server/src/modules/people/application/{employment-service.js,people-service.js}`, `apps/server/src/modules/people/components/PeopleDirectory.jsx` |
| FR-031-002 | `apps/server/prisma/seed.js`, `apps/server/src/lib/validation/{entities.js,enums.js}`, `apps/server/src/modules/commerce/{application/billing-invoice-service.js,domain/billing.js,application/pos-cashier-service.js}`, `apps/server/src/modules/project-manager/application/scope-service.js` |
| FR-031-003 | `apps/server/src/modules/people/components/PeopleDirectory.jsx`, `apps/server/src/config/domains.js`, `apps/server/src/modules/project-manager/project-domain-catalog.js` (route key `people` registered as a peer domain) |
