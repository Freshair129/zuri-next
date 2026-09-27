---
id: SDD-036
title: "Platform Programme Roadmap & Domain Map — design"
---

# SDD-036 — Platform Programme Roadmap & Domain Map design

- **Components:** `CMP-070` (`roadmap-sot.js`,
  `program-roadmap-containers.js`, `program-roadmap-data.js`,
  `ProgramRoadmapBoard.jsx`); `CMP-062`
  (`program-domain-map.js`, `DomainMapView.jsx`); `CMP-065`
  (`programme-member-view.js`).
- **Data owned:** none (reads the programme document and the FR-022-001, FR-022-002, FR-022-003
  snapshot; writes nothing).
- **Contracts exposed:** none.
- **Contracts consumed:** `DOM-PRJ` `getProductReadinessSnapshot()` (FR-022-001, FR-022-002, FR-022-003).
- **Main sequence:** 1. Operator requests `/control/roadmap`; the guard
  checks `isOperator` before any programme data renders. 2. The board
  reads the programme document and the FR-022-001, FR-022-002, FR-022-003 snapshot server-side,
  projecting both into the plan/domain-map views. 3. Any signed-in person
  requests `/roadmap`; the same inputs are reduced server-side into the
  member projection before the response leaves the server.
- **Failure modes:** non-operator at `/control/roadmap` → non-enumerating
  404 before render; the member window closed → 404 for everyone; the
  member projection is the sole boundary — hiding a field only in the
  component would still leak it in the payload, so a test asserts the
  projection function's own output excludes the removed fields.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-036-001 | `apps/server/src/app/(control)/{control/roadmap/page.jsx,layout.jsx}`, `apps/server/src/components/layouts/{PlatformControlGuard,PlatformControlSessionRetry,PlatformControlShell}.jsx`, `apps/server/src/lib/platform-control-guard.js`, `apps/server/src/modules/platform-control/{roadmap-sot.js,program-roadmap-data.js,program-roadmap-containers.js}` |
| FR-036-002 | `apps/server/src/modules/platform-control/{program-domain-map.js,components/DomainMapView.jsx}` |
| FR-036-003 | `apps/server/src/app/roadmap/page.jsx`, `apps/server/src/modules/platform-control/programme-member-view.js` |
