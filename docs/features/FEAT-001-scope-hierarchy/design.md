---
id: SDD-001
title: "Scope hierarchy & scope administration — design"
---

# SDD-001 — Scope hierarchy & scope administration design

- **Components:** CMP-030 — creators (`createPortfolio/Tenant/LegalEntity/TaxRegistrationBranch/Business/BusinessInGroup/Branch/Workspace`), `updateWorkspace`, `archiveWorkspace`, `listScope`, `assertWorkspaceInScope`, `listWorkspacesForScope`; CMP-024 — `requireViewer`, `assertWorkspaceWritable`; CMP-005 — capability registry + writer; CMP-002.
- **Data owned:** Portfolio, Tenant, LegalEntity, Business (incl. `capabilitiesJson`, `version`), Branch, Workspace (`scopeType` PORTFOLIO|TENANT|BUSINESS, `status`, `version`).
- **Contracts exposed:** API-077, API-076 (dispatch on `entity` ∈ portfolio|tenant|business|businessInGroup|workspace|legalEntity|taxRegistrationBranch|branch), API-083, API-006. `scope-service` is also the in-process contract other domains use to build scope (never direct inserts).
- **Contracts consumed:** IAM viewer contract (`resolveRequestViewer`, `ownsBusiness`, `ownsTenant`, `seesBusiness`, `isInstallationOperator` — FR-023-001/FR-061), IAM grant writer `grantBusinessMembership` (FR-030-001).
- **Main sequence (create):** 1. route resolves viewer (fail closed) 2. read body, pick creator by `entity` (unknown → 400) 3. creator validates input (Zod), checks its own tier predicate 4. unique codes resolved before the transaction 5. insert + audit (self-service: tenant, business, workspace, OWNER grant, audit in one transaction).
- **Failure modes:** unowned target → 404-shaped; operator tier → 403 naming the capability; unknown workspace scope type → 403 "no declared creation authority"; code collision → regenerated; stale capability version → 409.

## Interfaces

Interface lock for implementation (STD-005 R2). One line per exported signature under the FR it
serves; `pure` lines are micro-tasks a local model may implement, with visible `acceptance:` and
`holdout:` cases (holdout never reaches a worker). Everything else is a packet at the Architect's tier.
Types are JSDoc-style; the runtime is plain ESM JavaScript (SRV-001).

### Serving FR-001-001
- CMP-030 · `createTenant(input: { name: string, code?: string, portfolioId: string }, viewer: Viewer) → Promise<{ tenantId: string, code: string }>` — application service; audits `TENANT/CREATED`; code from `generateScopeCode` when absent, regenerated on collision
- CMP-030 · `createBusiness(input: { name: string, code?: string, tenantId: string }, viewer: Viewer) → Promise<{ businessId: string, code: string }>` — application service; audits `BUSINESS/CREATED`
- CMP-030 · `createBranch(input: { name: string, businessId: string, tenantId: string }, viewer: Viewer) → Promise<{ branchId: string }>` — application service; refuses `tenant != branch` (404-shaped) when the Business belongs to another Tenant
- CMP-030 · `createWorkspace(input: { name: string, scopeType: 'PORTFOLIO'|'TENANT'|'BUSINESS', portfolioId?: string, tenantId?: string, businessId?: string }, viewer: Viewer) → Promise<{ workspaceId: string, code: string }>` — application service; parent id required per `scopeType` (`resolveScopeParent`)
- CMP-030 · `generateScopeCode(prefix: string, name: string, isTaken: (code: string) => boolean) → string` — pure · type: generator
  - path: apps/server/src/modules/project-manager/domain/scope-code.js
  - rule: base = prefix, a hyphen, then the name uppercased with every run of non-alphanumeric characters replaced by one hyphen and leading/trailing hyphens removed; only A-Z and 0-9 survive
  - rule: an empty base name (nothing survives) uses SCOPE as the name part
  - rule: if isTaken(base) is true, try base-2, base-3, … until isTaken returns false
  - rule: prefix is used exactly as given; do not validate it
  - acceptance: `generateScopeCode('TNT', 'Acme', () => false)` → `'TNT-ACME'`
  - acceptance: `generateScopeCode('TNT', 'Acme', (c) => c === 'TNT-ACME')` → `'TNT-ACME-2'`
  - acceptance: `generateScopeCode('BUS', 'ร้านค้า', () => false)` → `'BUS-SCOPE'`
  - holdout: `generateScopeCode('WS', '  Sales  Team! ', () => false)` → `'WS-SALES-TEAM'`
  - holdout: `generateScopeCode('TNT', 'Acme', (c) => c !== 'TNT-ACME-3')` → `'TNT-ACME-3'`
- CMP-030 · `resolveScopeParent(scopeType: 'PORTFOLIO'|'TENANT'|'BUSINESS', ids: { portfolioId?: string, tenantId?: string, businessId?: string }) → { ok: true, parentKey: string, parentId: string } | { ok: false, error: string }` — pure · type: validation
  - path: apps/server/src/modules/project-manager/domain/scope-parent.js
  - rule: PORTFOLIO needs portfolioId, TENANT needs tenantId, BUSINESS needs businessId; parentKey is that field name
  - rule: a missing or empty id returns { ok: false, error: '<parentKey> required for <scopeType>' }
  - rule: an unknown scopeType returns { ok: false, error: 'unknown scopeType' }
  - acceptance: `resolveScopeParent('BUSINESS', { businessId: 'b1' })` → `{ ok: true, parentKey: 'businessId', parentId: 'b1' }`
  - acceptance: `resolveScopeParent('BUSINESS', {})` → `{ ok: false, error: 'businessId required for BUSINESS' }`
  - acceptance: `resolveScopeParent('X', { tenantId: 't' })` → `{ ok: false, error: 'unknown scopeType' }`
  - holdout: `resolveScopeParent('TENANT', { tenantId: '', businessId: 'b' })` → `{ ok: false, error: 'tenantId required for TENANT' }`
  - holdout: `resolveScopeParent('PORTFOLIO', { portfolioId: 'p9' })` → `{ ok: true, parentKey: 'portfolioId', parentId: 'p9' }`

### Serving FR-001-002
- CMP-030 · `listScope(viewer: Viewer) → Promise<{ portfolios: [], tenants: [], businesses: [], workspaces: [] }>` — read; every row filtered by the viewer's visibility (`seesBusiness`, `ownsTenant`)

### Serving FR-001-003
- CMP-030 · `updateWorkspace(workspaceId: string, patch: { name?: string, version: number }, viewer: Viewer) → Promise<Workspace>` — `assertWorkspaceWritable` first; stale `version` → 409
- CMP-030 · `archiveWorkspace(workspaceId: string, version: number, viewer: Viewer) → Promise<Workspace>` — same guard; audited

### Serving FR-001-004
- CMP-030 · `assertBusinessTierAuthority(viewer: Viewer, businessId: string) → void` — throws the 404-shaped refusal unless `ownsBusiness`

### Serving FR-001-005
- CMP-030 · `assertTenantTierAuthority(viewer: Viewer, tenantId: string) → void` — throws the 404-shaped refusal unless `ownsTenant`

### Serving FR-001-006
- CMP-030 · `provisionBusinessSelfService(input: { tenantName: string, businessName: string }, viewer: Viewer) → Promise<{ tenantId: string, businessId: string, workspaceId: string }>` — one transaction: tenant, business, workspace, OWNER grant (`grantBusinessMembership`), audit; nothing persists when any step fails

### Serving FR-001-007
- CMP-030 · `assertInstallationOperator(viewer: Viewer, capability: string) → void` — 403 naming the capability unless `isInstallationOperator`

### Serving FR-001-008
- CMP-005 · `updateBusinessCapability(businessId: string, patch: { key: string, enabled: boolean, version: number }, viewer: Viewer) → Promise<{ capabilitiesJson: object, version: number }>` — writer; 400 on an unknown key (strict schema); 409 on a stale version; navigation hides disabled domain slots
- CMP-005 · `normalizeCapabilities(input: unknown, registry: string[]) → { ok: true, capabilities: Record<string, boolean> } | { ok: false, error: string }` — pure · type: validation
  - path: apps/server/src/modules/business/domain/capabilities.js
  - rule: input must be a plain object whose keys are all in registry and whose values are all booleans
  - rule: every registry key missing from input is added as false
  - rule: a non-object input returns { ok: false, error: 'capabilities must be an object' }; an unknown key returns { ok: false, error: 'unknown capability: <key>' } naming the first unknown key in input order; a non-boolean value returns { ok: false, error: 'capability <key> must be boolean' }
  - acceptance: `normalizeCapabilities({ crm: true }, ['crm', 'scm'])` → `{ ok: true, capabilities: { crm: true, scm: false } }`
  - acceptance: `normalizeCapabilities({ hr: true }, ['crm'])` → `{ ok: false, error: 'unknown capability: hr' }`
  - acceptance: `normalizeCapabilities(null, ['crm'])` → `{ ok: false, error: 'capabilities must be an object' }`
  - holdout: `normalizeCapabilities({ crm: 'yes' }, ['crm'])` → `{ ok: false, error: 'capability crm must be boolean' }`
  - holdout: `normalizeCapabilities({}, ['crm', 'scm'])` → `{ ok: true, capabilities: { crm: false, scm: false } }`

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-001-001 | apps/server/src/modules/project-manager/application/scope-service.js; apps/server/src/lib/validation/entities.js |
| FR-001-002 | apps/server/src/app/api/scope/route.js (`visibleScope`) |
| FR-001-003 | apps/server/src/app/api/workspaces/[id]/route.js; scope-service.js (`updateWorkspace`, `archiveWorkspace`); application/project-authorization.js |
| FR-001-004..007 | apps/server/src/modules/project-manager/application/scope-service.js; apps/server/src/modules/identity/viewer-authority.js (consumed) |
| FR-001-008 | apps/server/src/lib/business-capabilities.js; apps/server/src/modules/business/application/business-capability-service.js; apps/server/src/app/api/businesses/[id]/capabilities/route.js; apps/server/src/app/(pm)/settings/page.jsx |
