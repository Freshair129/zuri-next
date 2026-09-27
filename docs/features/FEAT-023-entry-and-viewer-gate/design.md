---
id: SDD-023
title: "Entry & Viewer Gate — design"
---

# SDD-023 — Entry & Viewer Gate design

- **Components:** `CMP-057` (`resolve-viewer.js`,
  `request-viewer.js`, `session-port.js`) — resolves the trusted session into
  a viewer; `CMP-040` (`business-routing.js`,
  `business-shell-guard.js`, `EntryShell.jsx`, `BusinessRoutingShell.jsx`) —
  the pre-shell page sequence.
- **Data owned:** none directly (reads `Session`, `Membership`,
  `PlatformGrant` — all identity-owned).
- **Contracts exposed:** `API-088`.
- **Contracts consumed:** none.
- **Main sequence:** 1. Request arrives with `zuri_session` cookie. 2.
  `SessionPort` verifies the signature and loads the live `Session` row (or
  returns `UNAUTHENTICATED`/`503`). 3. `resolveViewer({ principalId,
  platformGrant })` loads ACTIVE Membership/RoleBinding/PlatformGrant rows and
  returns the viewer snapshot. 4. `GET /api/entry` returns only the viewer
  plus the visible Businesses' minimum ancestry. 5. `/businesses` renders
  exactly that list; selecting one mounts BusinessShell for that Business.
- **Failure modes:** missing/invalid/expired session → `401`
  `UNAUTHENTICATED`, no Business data disclosed; session-store unreachable →
  `503`, never a fallback to a broad or demo scope; a viewer with zero visible
  Businesses → empty list, not an error.

## Interfaces

Interface lock for implementation (STD-005 R2). One line per exported signature under the FR it
serves; `pure` lines carry visible `acceptance:` and `holdout:` cases (holdout never reaches a
worker). Every unit in this feature is authorization territory: STD-005 E6 sends it to the
Architect's tier and R10 makes L2 review mandatory. Types are JSDoc-style; the runtime is plain
ESM JavaScript (SRV-001).

Shared types (the single definition; SDD-024 and every Business-scoped consumer use these names):
`Viewer = { principalId: string, role: 'OWNER'|'MEMBER'|'DEV', isPlatform: boolean, visibleBusinessIds: string[], ownedBusinessIds: string[], visibleDomains: string[], domainsByBusinessId: Record<string, string[]>, roleBindings: RoleBinding[] }`;
`MembershipRow = { businessId: string, tenantId: string, role: 'OWNER'|'MEMBER', status: string, domainKeys: string[] }` (tenant-wide Memberships are expanded to one row per Business before they reach a pure function);
`RoleBinding = { roleKey: string, businessId: string, status: string }`.

### Serving FR-023-001
- CMP-057 · `verifySession(cookieValue: string | undefined, now: Date) → Promise<{ ok: true, session: Session } | { ok: false, status: 401 | 503, code: 'UNAUTHENTICATED' | 'SESSION_STORE_UNAVAILABLE' }>` — SessionPort: verifies the cookie signature, loads the live `Session` row; never falls back to a broad or demo scope
- CMP-057 · `resolveViewer(session: Session) → Promise<Viewer>` — application service, the only producer of a `Viewer`: loads ACTIVE `Membership`, `RoleBinding` and `PlatformGrant` rows for `session.principalId`, expands tenant-wide Memberships to the tenant's Businesses, calls `buildViewerSnapshot`, attaches the ACTIVE `roleBindings`
- CMP-057 · `resolveRequestViewer(request: Request) → Promise<Viewer>` — route helper used by every protected route (SDD-001 consumes it): `verifySession` then `resolveViewer`; throws the 401/503 refusal of API-088
- CMP-057 · `buildViewerSnapshot(principalId: string, memberships: MembershipRow[], platformGrantActive: boolean, allDomains: string[]) → Viewer` — pure · type: validation
  - path: apps/server/src/modules/identity/domain/viewer-snapshot.js
  - rule: only rows whose status is 'ACTIVE' count; every other row is ignored
  - rule: role is 'DEV' when platformGrantActive, else 'OWNER' when any counted row has role 'OWNER', else 'MEMBER'
  - rule: ownedBusinessIds = businessIds of counted OWNER rows; visibleBusinessIds = businessIds of all counted rows, each once, in first-seen order
  - rule: domainsByBusinessId[businessId] = allDomains for an OWNER row, the row's domainKeys that are in allDomains for a MEMBER row, the union when a Business has several rows; order as in allDomains; a Business without a row has no key
  - rule: visibleDomains = the union of every domainsByBusinessId value, each once, ordered as in allDomains
  - rule: isPlatform = platformGrantActive; 'DEV' changes only role and isPlatform, never Business visibility; roleBindings is always []
  - acceptance: `buildViewerSnapshot('p1', [{ businessId: 'A', tenantId: 't', role: 'OWNER', status: 'ACTIVE', domainKeys: [] }], false, ['crm', 'scm'])` → `{ principalId: 'p1', role: 'OWNER', isPlatform: false, visibleBusinessIds: ['A'], ownedBusinessIds: ['A'], visibleDomains: ['crm', 'scm'], domainsByBusinessId: { A: ['crm', 'scm'] }, roleBindings: [] }`
  - acceptance: `buildViewerSnapshot('p1', [{ businessId: 'A', tenantId: 't', role: 'MEMBER', status: 'ACTIVE', domainKeys: ['scm', 'hr'] }], false, ['crm', 'scm'])` → `{ principalId: 'p1', role: 'MEMBER', isPlatform: false, visibleBusinessIds: ['A'], ownedBusinessIds: [], visibleDomains: ['scm'], domainsByBusinessId: { A: ['scm'] }, roleBindings: [] }`
  - acceptance: `buildViewerSnapshot('p1', [], false, ['crm'])` → `{ principalId: 'p1', role: 'MEMBER', isPlatform: false, visibleBusinessIds: [], ownedBusinessIds: [], visibleDomains: [], domainsByBusinessId: {}, roleBindings: [] }`
  - holdout: `buildViewerSnapshot('p1', [{ businessId: 'A', tenantId: 't', role: 'OWNER', status: 'REVOKED', domainKeys: [] }], true, ['crm'])` → `{ principalId: 'p1', role: 'DEV', isPlatform: true, visibleBusinessIds: [], ownedBusinessIds: [], visibleDomains: [], domainsByBusinessId: {}, roleBindings: [] }`
  - holdout: `buildViewerSnapshot('p2', [{ businessId: 'A', tenantId: 't', role: 'OWNER', status: 'ACTIVE', domainKeys: [] }, { businessId: 'B', tenantId: 't', role: 'MEMBER', status: 'ACTIVE', domainKeys: ['scm'] }], false, ['crm', 'scm'])` → `{ principalId: 'p2', role: 'OWNER', isPlatform: false, visibleBusinessIds: ['A', 'B'], ownedBusinessIds: ['A'], visibleDomains: ['crm', 'scm'], domainsByBusinessId: { A: ['crm', 'scm'], B: ['scm'] }, roleBindings: [] }`

### Serving FR-023-002
- CMP-040 · `entryHandler(request: Request) → Promise<Response>` — `GET /api/entry` (API-088): `resolveRequestViewer`, load the visible Businesses with tenant and portfolio ancestry, respond with `entryReadModel`; 401/503 from the viewer helper pass through unchanged
- CMP-040 · `entryReadModel(viewer: Viewer, businesses: BusinessRow[]) → { viewer: { principal: string, role: string, visibleDomains: string[], isPlatform: boolean }, businesses: { id: string, code: string, name: string, tenant: { id: string, name: string }, portfolio: { id: string, name: string } }[] }` — pure · type: formatter
  - path: apps/server/src/modules/identity/domain/entry-read-model.js
  - rule: businesses keeps only rows whose id is in viewer.visibleBusinessIds, in the order of visibleBusinessIds; a visible id with no row is skipped
  - rule: each output business is exactly { id, code, name, tenant: { id, name }, portfolio: { id, name } }; every other input field is dropped
  - rule: the output viewer is exactly { principal: viewer.principalId, role, visibleDomains, isPlatform }; no other viewer field is copied
  - acceptance: `entryReadModel({ principalId: 'p1', role: 'MEMBER', isPlatform: false, visibleBusinessIds: ['B', 'A'], ownedBusinessIds: [], visibleDomains: ['crm'], domainsByBusinessId: { A: ['crm'], B: ['crm'] }, roleBindings: [] }, [{ id: 'A', code: 'A1', name: 'Alpha', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' }, internal: 1 }, { id: 'B', code: 'B1', name: 'Beta', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }, { id: 'C', code: 'C1', name: 'Gamma', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }])` → `{ viewer: { principal: 'p1', role: 'MEMBER', visibleDomains: ['crm'], isPlatform: false }, businesses: [{ id: 'B', code: 'B1', name: 'Beta', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }, { id: 'A', code: 'A1', name: 'Alpha', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }] }`
  - acceptance: `entryReadModel({ principalId: 'p1', role: 'MEMBER', isPlatform: false, visibleBusinessIds: [], ownedBusinessIds: [], visibleDomains: [], domainsByBusinessId: {}, roleBindings: [] }, [{ id: 'A', code: 'A1', name: 'Alpha', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }])` → `{ viewer: { principal: 'p1', role: 'MEMBER', visibleDomains: [], isPlatform: false }, businesses: [] }`
  - holdout: `entryReadModel({ principalId: 'p1', role: 'OWNER', isPlatform: false, visibleBusinessIds: ['A', 'Z'], ownedBusinessIds: ['A'], visibleDomains: ['crm'], domainsByBusinessId: { A: ['crm'] }, roleBindings: [] }, [{ id: 'A', code: 'A1', name: 'Alpha', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }])` → `{ viewer: { principal: 'p1', role: 'OWNER', visibleDomains: ['crm'], isPlatform: false }, businesses: [{ id: 'A', code: 'A1', name: 'Alpha', tenant: { id: 't', name: 'T' }, portfolio: { id: 'f', name: 'F' } }] }`
- CMP-040 · `shellGuardDecision(isAuthenticated: boolean, selectedBusinessId: string | null, visibleBusinessIds: string[]) → { allow: true } | { allow: false, redirectTo: '/login' | '/businesses' }` — pure · type: predicate
  - path: apps/server/src/modules/identity/domain/shell-guard.js
  - rule: not authenticated → { allow: false, redirectTo: '/login' }
  - rule: authenticated with selectedBusinessId null, empty, or not in visibleBusinessIds → { allow: false, redirectTo: '/businesses' }
  - rule: otherwise { allow: true }; the guard never redirects into the shell on its own
  - acceptance: `shellGuardDecision(false, 'A', ['A'])` → `{ allow: false, redirectTo: '/login' }`
  - acceptance: `shellGuardDecision(true, 'A', ['A', 'B'])` → `{ allow: true }`
  - acceptance: `shellGuardDecision(true, null, ['A'])` → `{ allow: false, redirectTo: '/businesses' }`
  - holdout: `shellGuardDecision(true, 'C', ['A', 'B'])` → `{ allow: false, redirectTo: '/businesses' }`
  - holdout: `shellGuardDecision(true, '', [])` → `{ allow: false, redirectTo: '/businesses' }`
- CMP-040 · `LandingPage() → JSX` — `/`: no data fetch, no viewer resolution, no shell chrome; the only route-bearing action is the link to `/login`
- CMP-040 · `BusinessRoutingPage({ entry }) → JSX` — `/businesses`: renders `entry.businesses` from API-088 only; an empty list renders the empty state and never redirects into the shell
- CMP-040 · `BusinessShellGuard({ children }) → JSX` — wraps `/overview` and below; applies `shellGuardDecision` to the resolved viewer and the selected Business before any shell chrome mounts

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-023-001 | `apps/server/src/app/api/viewer/route.js`, `apps/server/src/modules/identity/resolve-viewer.js` |
| FR-023-002 | `apps/server/src/app/(entry)/businesses/page.jsx`, `apps/server/src/app/(pm)/layout.jsx`, `apps/server/src/app/layout.jsx`, `apps/server/src/app/login/page.jsx`, `apps/server/src/app/page.jsx`, `apps/server/src/lib/business-routing.js`, `apps/server/src/lib/business-shell-guard.js`, `apps/server/src/components/layouts/{Breadcrumb,BusinessRoutingShell,BusinessShellGuard,EntryShell,Topbar}.jsx` |
