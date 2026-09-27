---
id: SDD-002
title: "Business shell, entry & navigation — design"
---

# SDD-002 — Business shell, entry & navigation design

- **Components:** CMP-008 — `deriveShell`/`visibleWorkspaces` (pure), `resolveBusinessShellDecision` (pure), `ScopeProvider` (loads `/api/scope` + `/api/viewer`, persists selection client-side), Topbar, Breadcrumb, DomainBar, Sidebar, `navigation.js` registry (modules, Business tabs, Project tabs, planned tabs, Work views), `config/domains.js` (domain keys, path → domain), `config/scope-views.js` (lens vocabularies, context levels); landing `ZuriLanding` inside `EntryShell`.
- **Data owned:** none persisted; selection (Portfolio/Business) and lens are client state.
- **Contracts consumed:** API-077; IAM `GET /api/viewer` (visible/owned Business ids, domains, operator flag — FR-023-001/FR-061); IAM `/api/entry` via `/businesses` (FR-002-005).
- **Main sequence:** 1. `(pm)` layout mounts ScopeProvider → fetch scope + viewer 2. guard computes decision 3. READY → render Topbar/DomainBar/Sidebar with modules for the current path 4. non-READY → redirect or state screen.
- **Failure modes:** viewer 401 → login; viewer 5xx/session store down → SESSION_UNAVAILABLE retry screen (no redirect loop); stale selection → Business chooser; unknown route → no selected view invented.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-002-001 | apps/server/src/lib/shell-mode.js; apps/server/src/context/ScopeContext.jsx; apps/server/src/app/(pm)/settings/page.jsx |
| FR-002-002 | apps/server/src/config/scope-views.js; apps/server/src/components/layouts/Topbar.jsx; apps/server/src/config/domains.js |
| FR-002-003 | apps/server/src/components/layouts/Topbar.jsx; apps/server/src/components/layouts/CommandPalette.jsx |
| FR-002-004 | apps/server/src/components/layouts/Breadcrumb.jsx |
| FR-002-005 | apps/server/src/lib/business-shell-guard.js; apps/server/src/components/layouts/BusinessShellGuard.jsx; apps/server/src/components/layouts/BusinessRoutingShell.jsx; apps/server/src/lib/viewer-failure.js |
| FR-002-006 | apps/server/src/app/page.jsx; apps/server/src/components/landing/ZuriLanding.jsx; apps/server/src/components/layouts/EntryShell.jsx |
| FR-002-007 | apps/server/src/modules/project-manager/navigation.js; apps/server/src/modules/project-manager/components/ProjectManagerBusinessNav.jsx; apps/server/src/modules/project-manager/components/ProjectTabs.jsx; apps/server/src/app/(pm)/projects/[projectId]/layout.jsx; apps/server/src/components/layouts/AppShell.jsx |
