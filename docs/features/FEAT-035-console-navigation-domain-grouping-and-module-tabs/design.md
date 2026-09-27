---
id: SDD-035
title: "Console Navigation: Domain Grouping & Module Tabs — design"
---

# SDD-035 — Console Navigation: Domain Grouping & Module Tabs design

- **Components:** `CMP-061` (`DOMAIN_GROUPS` in
  `src/config/domains.js`, read by `DomainBar.jsx`/`Sidebar.jsx`);
  `CMP-068` (`<ModuleTabs>` in `src/components/ui/index.jsx`,
  tab lists in `src/lib/module-tabs.js`).
- **Data owned:** none (config-file constants).
- **Contracts exposed:** none.
- **Contracts consumed:** `DOM-IAM`'s per-Business domain-visibility answer
  (`domainsForBusiness`) gates which children of a group actually render.
- **Main sequence:** 1. `domainBarSlots()` derives one bar slot per
  `DOMAIN_GROUPS` entry plus one per ungrouped domain. 2.
  `sidebarDomainForPath()` resolves the active path to its leaf domain,
  listing siblings from the same group. 3. A leaf domain's own multi-page
  module renders `<ModuleTabs>` reading its own tab list.
- **Failure modes:** a child key claimed by two groups, or a child that also
  stands alone in the bar → caught by a pinning test, not a runtime
  failure.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-035-001 | `apps/server/src/config/domains.js`, `apps/server/src/components/layouts/{DomainBar,Sidebar}.jsx` |
| FR-035-002 | `apps/server/src/components/ui/index.jsx`, `apps/server/src/lib/module-tabs.js` |
| FR-035-003 | `apps/server/src/config/domains.js` |
