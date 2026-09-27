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

## Interfaces

Interface lock for implementation (STD-005 R2). One line per exported signature under the FR it
serves; `pure` lines carry visible `acceptance:` and `holdout:` cases (holdout never reaches a
worker). Every unit here is authorization territory: STD-005 E6 sends it to the Architect's tier
and R10 makes L2 review mandatory. `Viewer`, `MembershipRow` and `RoleBinding` are the types
defined once in SDD-023. Types are JSDoc-style; the runtime is plain ESM JavaScript (SRV-001).

### Serving FR-024-001
- CMP-051 · `getOwnProfile(session: Session) → Promise<{ personId: string, code: string, displayName: string, language: string, lineLinked: boolean, session: { createdAt: string, expiresAt: string } }>` — read, self only (API-093): the Person comes from the Session, never from the request; no other Person is reachable through this path

### Serving FR-024-002
- CMP-051 · `assertUsersAdminAuthority(viewer: Viewer) → void` — throws the refusal before any data loads unless `viewer.ownedBusinessIds` is non-empty or the caller is the installation operator (FR-001-007)
- CMP-051 · `updateUserPermissions(membershipId: string, patch: { role?: 'OWNER' | 'MEMBER', domainKeys?: string[], version: number }, viewer: Viewer) → Promise<Membership>` — writer (API-091 PATCH): only for a Membership whose Business is in `viewer.ownedBusinessIds`; stale version → 409; audited
- CMP-051 · `addBusinessMembership(input: unknown, viewer: Viewer) → Promise<{ membershipId: string }>` — writer (API-091 POST memberships): `validateMembershipAttach`, then attaches an existing Person (exact code or email) to an owned Business as MEMBER; refuses when the Person does not exist (never creates one) or the Business is not owned; audited
- CMP-051 · `validateMembershipAttach(input: unknown, registry: string[]) → { ok: true, value: { businessId: string, personRef: { code: string } | { email: string }, domainKeys: string[] } } | { ok: false, error: string }` — pure · type: validation
  - path: apps/server/src/modules/identity/domain/membership-attach.js
  - rule: input must be an object with a non-empty string businessId, else { ok: false, error: 'businessId required' }
  - rule: input.person must carry exactly one of code or email as a non-empty string, else { ok: false, error: 'person code or email required' }; personRef keeps only that one key
  - rule: input.role, when present, must be 'MEMBER', else { ok: false, error: 'role must be MEMBER' }
  - rule: domainKeys defaults to []; it must be an array of strings all in registry, else { ok: false, error: 'unknown domain: <key>' } naming the first unknown key in input order; the output keeps registry order with duplicates removed
  - rule: checks run in the order of these rules; the first failure is the answer
  - acceptance: `validateMembershipAttach({ businessId: 'A', person: { email: 'x@y.z' }, domainKeys: ['scm', 'crm', 'crm'] }, ['crm', 'scm'])` → `{ ok: true, value: { businessId: 'A', personRef: { email: 'x@y.z' }, domainKeys: ['crm', 'scm'] } }`
  - acceptance: `validateMembershipAttach({ businessId: 'A', person: { code: 'P1' }, role: 'OWNER' }, ['crm'])` → `{ ok: false, error: 'role must be MEMBER' }`
  - acceptance: `validateMembershipAttach({ businessId: 'A', person: { code: 'P1' }, domainKeys: ['hr'] }, ['crm'])` → `{ ok: false, error: 'unknown domain: hr' }`
  - holdout: `validateMembershipAttach({ businessId: 'A', person: { code: 'P1', email: 'x@y.z' } }, ['crm'])` → `{ ok: false, error: 'person code or email required' }`
  - holdout: `validateMembershipAttach({ businessId: '', person: { code: 'P1' } }, ['crm'])` → `{ ok: false, error: 'businessId required' }`
  - holdout: `validateMembershipAttach({ businessId: 'A', person: { code: 'P1' } }, ['crm'])` → `{ ok: true, value: { businessId: 'A', personRef: { code: 'P1' }, domainKeys: [] } }`

### Serving FR-024-003
- CMP-038 · `domainsForBusiness(viewer: Viewer, businessId: string) → string[]` — pure · type: predicate
  - path: apps/server/src/modules/identity/domain/viewer-domains.js
  - rule: returns a copy of viewer.domainsByBusinessId[businessId], or [] when the key is absent
  - rule: viewer.visibleDomains is never consulted; this function is the only way a Business-scoped consumer asks the question
  - acceptance: `domainsForBusiness({ domainsByBusinessId: { A: ['crm'] }, visibleDomains: ['crm', 'scm'] }, 'A')` → `['crm']`
  - acceptance: `domainsForBusiness({ domainsByBusinessId: { A: ['crm'] }, visibleDomains: ['crm'] }, 'B')` → `[]`
  - acceptance: `domainsForBusiness({ domainsByBusinessId: {}, visibleDomains: ['crm'] }, 'A')` → `[]`
  - holdout: `domainsForBusiness({ domainsByBusinessId: { A: [] }, visibleDomains: ['crm'] }, 'A')` → `[]`
  - holdout: `domainsForBusiness({ domainsByBusinessId: { A: ['crm', 'scm'], B: ['scm'] }, visibleDomains: ['crm', 'scm'] }, 'B')` → `['scm']`
- CMP-038 · `isDomainVisible(viewer: Viewer, businessId: string, domainKey: string) → boolean` — pure · type: predicate
  - path: apps/server/src/modules/identity/domain/viewer-domains.js
  - rule: true only when domainsForBusiness(viewer, businessId) contains domainKey exactly (case-sensitive)
  - acceptance: `isDomainVisible({ domainsByBusinessId: { A: ['crm'] }, visibleDomains: ['crm'] }, 'A', 'crm')` → `true`
  - acceptance: `isDomainVisible({ domainsByBusinessId: { A: ['crm'] }, visibleDomains: ['crm'] }, 'B', 'crm')` → `false`
  - holdout: `isDomainVisible({ domainsByBusinessId: { A: ['crm'] }, visibleDomains: ['crm'] }, 'A', 'CRM')` → `false`
- CMP-038 · `assertDomainVisible(viewer: Viewer, businessId: string, domainKey: string) → void` — throws the 404-shaped refusal of an unknown Business (SEC-001) unless `isDomainVisible`; enforced server-side by the crm, market and people read models before any row loads

### Serving FR-024-004
- CMP-051 · `listUserPermissions(viewer: Viewer) → Promise<UserPermissionRow[]>` — read (API-091 GET): loads Memberships for the caller's owned Businesses and their tenants, projects them with `projectPermissionRows`; the response never carries `Person.email`
- CMP-051 · `projectPermissionRows(memberships: { membershipId: string, personCode: string, displayName: string, tenantId: string, businessId: string | null, role: string, domainKeys: string[], status: string }[], scope: { ownedBusinessIds: string[], visibleTenantIds: string[], ownedTenantIds: string[] }) → { membershipId: string, personCode: string, displayName: string, tenantId: string, businessId: string | null, role: string, domainKeys: string[], status: string, manageable: boolean }[]` — pure · type: formatter
  - path: apps/server/src/modules/identity/domain/permission-rows.js
  - rule: a Business row (businessId not null) is kept only when businessId is in scope.ownedBusinessIds; it is manageable
  - rule: a tenant-wide row (businessId null) is kept only when tenantId is in scope.visibleTenantIds (tenants where the caller owns a Business); it is manageable only when tenantId is in scope.ownedTenantIds
  - rule: an output row is exactly the eight listed input fields plus manageable; any other input field (email above all) is never copied; input order is preserved
  - acceptance: `projectPermissionRows([{ membershipId: 'm1', personCode: 'P1', displayName: 'Pat', tenantId: 't1', businessId: 'A', role: 'MEMBER', domainKeys: ['crm'], status: 'ACTIVE', email: 'x@y.z' }, { membershipId: 'm2', personCode: 'Q1', displayName: 'Quinn', tenantId: 't1', businessId: 'B', role: 'OWNER', domainKeys: [], status: 'ACTIVE' }], { ownedBusinessIds: ['A'], visibleTenantIds: ['t1'], ownedTenantIds: [] })` → `[{ membershipId: 'm1', personCode: 'P1', displayName: 'Pat', tenantId: 't1', businessId: 'A', role: 'MEMBER', domainKeys: ['crm'], status: 'ACTIVE', manageable: true }]`
  - acceptance: `projectPermissionRows([{ membershipId: 'm3', personCode: 'R1', displayName: 'Rae', tenantId: 't1', businessId: null, role: 'OWNER', domainKeys: [], status: 'ACTIVE' }], { ownedBusinessIds: ['A'], visibleTenantIds: ['t1'], ownedTenantIds: [] })` → `[{ membershipId: 'm3', personCode: 'R1', displayName: 'Rae', tenantId: 't1', businessId: null, role: 'OWNER', domainKeys: [], status: 'ACTIVE', manageable: false }]`
  - acceptance: `projectPermissionRows([{ membershipId: 'm3', personCode: 'R1', displayName: 'Rae', tenantId: 't2', businessId: null, role: 'OWNER', domainKeys: [], status: 'ACTIVE' }], { ownedBusinessIds: ['A'], visibleTenantIds: ['t1'], ownedTenantIds: [] })` → `[]`
  - holdout: `projectPermissionRows([{ membershipId: 'm3', personCode: 'R1', displayName: 'Rae', tenantId: 't1', businessId: null, role: 'MEMBER', domainKeys: ['scm'], status: 'SUSPENDED' }], { ownedBusinessIds: [], visibleTenantIds: ['t1'], ownedTenantIds: ['t1'] })` → `[{ membershipId: 'm3', personCode: 'R1', displayName: 'Rae', tenantId: 't1', businessId: null, role: 'MEMBER', domainKeys: ['scm'], status: 'SUSPENDED', manageable: true }]`

### Serving FR-024-005
- CMP-050 · `hasRolePermission(bindings: RoleBinding[], businessId: string, permission: string) → boolean` — pure · type: predicate
  - path: apps/server/src/modules/identity/domain/role-registry.js
  - rule: a binding counts only when its status is 'ACTIVE' and its businessId equals businessId
  - rule: roleKey 'PRODUCT_OWNER' grants exactly the permissions whose key starts with 'product:'; nothing else, ever
  - rule: any other roleKey grants nothing (fail closed)
  - acceptance: `hasRolePermission([{ roleKey: 'PRODUCT_OWNER', businessId: 'A', status: 'ACTIVE' }], 'A', 'product:write')` → `true`
  - acceptance: `hasRolePermission([{ roleKey: 'PRODUCT_OWNER', businessId: 'A', status: 'ACTIVE' }], 'A', 'operations:write')` → `false`
  - acceptance: `hasRolePermission([{ roleKey: 'PRODUCT_OWNER', businessId: 'A', status: 'ACTIVE' }], 'B', 'product:read')` → `false`
  - holdout: `hasRolePermission([{ roleKey: 'PRODUCT_OWNER', businessId: 'A', status: 'REVOKED' }, { roleKey: 'PRODUCT_OWNER', businessId: 'B', status: 'ACTIVE' }], 'B', 'product:read')` → `true`
  - holdout: `hasRolePermission([{ roleKey: 'SUPER', businessId: 'A', status: 'ACTIVE' }], 'A', 'product:read')` → `false`
- CMP-050 · `grantProductOwner(personId: string, businessId: string, viewer: Viewer) → Promise<RoleBinding>` — writer: requires `ownsBusiness`; one ACTIVE binding per Person per Business (a second grant → 409); audited
- CMP-050 · `revokeProductOwner(bindingId: string, viewer: Viewer) → Promise<RoleBinding>` — writer: sets status 'REVOKED'; audited; every other binding of the Person is unaffected
- CMP-050 · `assertProductAuthority(viewer: Viewer, businessId: string, permission: string) → void` — passes when `ownsBusiness` or `hasRolePermission(viewer.roleBindings, businessId, permission)`; otherwise the 404-shaped refusal (SEC-001)

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-024-001 | `apps/server/src/app/(pm)/profile/page.jsx`, `apps/server/src/app/api/profile/route.js` |
| FR-024-002 | `apps/server/src/app/(pm)/platform/users/page.jsx`, `apps/server/src/app/api/platform/users/{route.js,memberships/route.js}`, `apps/server/src/modules/identity/{platform-users-view.js,profile-permission-service.js}` |
| FR-024-003 | `apps/server/src/modules/identity/{resolve-viewer.js,viewer-domains.js}`, `apps/server/src/modules/crm/{conversation-read-model.js,customer-consent-service.js}`, `apps/server/src/modules/people/application/{employment-service.js,people-service.js}`, `apps/server/src/modules/market-intelligence/application/market-observation-service.js` |
| FR-024-004 | `apps/server/src/app/(pm)/platform/users/page.jsx`, `apps/server/src/modules/identity/profile-permission-service.js` |
| FR-024-005 | `apps/server/src/modules/identity/{product-owner-authority.js,product-owner-service.js,rbac.js,rbac-service.js}` |
