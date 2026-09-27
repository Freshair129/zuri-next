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

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-023-001 | `apps/server/src/app/api/viewer/route.js`, `apps/server/src/modules/identity/resolve-viewer.js` |
| FR-023-002 | `apps/server/src/app/(entry)/businesses/page.jsx`, `apps/server/src/app/(pm)/layout.jsx`, `apps/server/src/app/layout.jsx`, `apps/server/src/app/login/page.jsx`, `apps/server/src/app/page.jsx`, `apps/server/src/lib/business-routing.js`, `apps/server/src/lib/business-shell-guard.js`, `apps/server/src/components/layouts/{Breadcrumb,BusinessRoutingShell,BusinessShellGuard,EntryShell,Topbar}.jsx` |
