---
id: SDD-040
title: "Mission Control DAG Orchestration Observability — design"
---

# SDD-040 — Mission Control DAG Orchestration Observability design

- **Components:** `CMP-067`
  (`mission-control-read-model.js`, `mission-control-contract.js`);
  `CMP-069` (`programme-orchestration-run-ledger.js`);
  `CMP-066` (`MissionControlBoard.jsx`).
- **Data owned:** none new in this slice (a read-only adapter over external
  PORL observation sources and the canonical roadmap DAG document).
- **Contracts exposed:** none (page-embedded server projection, no API
  route of its own found in this slice).
- **Contracts consumed:** the canonical roadmap DAG/document; the external
  PORL observation source (owner/freshness contract explicitly still open).
- **Main sequence:** 1. Operator opens Mission Control; the guard checks
  `isOperator` before any fetch. 2. The read model joins the DAG's waves
  with PORL observations, computing candidate-parallel status and gate
  results per task. 3. The board renders the DAG, gate reasons and evidence
  tables, all read-only. 4. `/roadmap`'s member projection separately
  excludes every PORL-derived field before it ever reaches that response.
- **Failure modes:** a stale PORL record → shown as `SNAPSHOT`/`UNKNOWN`,
  never `LIVE`; a gate that cannot be evaluated → shown as the blocking
  unknown, never silently passed; non-operator access → refused before
  fetch.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-040-001 | `apps/server/src/app/(control)/control/mission-control/page.jsx`, `apps/server/src/modules/platform-control/mission-control/{application/mission-control-read-model.js,components/MissionControlBoard.jsx}` |
| FR-040-002 | `apps/server/src/modules/platform-control/mission-control/application/programme-orchestration-run-ledger.js` |
| FR-040-003 | `apps/server/src/modules/platform-control/mission-control/{application/mission-control-read-model.js,mission-control-contract.js}` |
| FR-040-004 | `apps/server/src/modules/platform-control/programme-member-view.js` |
| FR-040-005 | `apps/server/src/modules/platform-control/mission-control/components/MissionControlBoard.jsx` |
