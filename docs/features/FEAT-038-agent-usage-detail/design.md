---
id: SDD-038
title: "Agent Usage Detail — design"
---

# SDD-038 — Agent Usage Detail design

- **Components:** `CMP-074` (shared counting logic in
  `scripts/programme-usage-meter.mjs`, surfaced through
  `program-delivery-metrics.js`/`ProgramRoadmapBoard.jsx`).
- **Data owned:** `ProgrammeUsageReport`'s detail columns
  (`reasoningTokens`, `toolCallCount`, `toolErrorCount`, `promptCount`,
  `detailJson`).
- **Contracts exposed:** consumed through `API-101`'
  existing endpoint (detail is an optional field on the same payload).
- **Contracts consumed:** none.
- **Main sequence:** 1. The meter parses local session logs, computing
  detail counts alongside the headline four. 2. It writes both into the
  document's usage block. 3. The board reads the merged figures and renders
  a per-lane detail breakdown, or states "not available" where the source
  carried none.
- **Failure modes:** a detail field a source does not write reads as `0`,
  never estimated; a lane with genuinely no detail-carrying source states
  that explicitly rather than showing misleading zeros.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-038-001 | `apps/server/src/modules/platform-control/application/{programme-usage-reports.js,task-usage-ledger.js}` |
| FR-038-002 | `apps/server/src/modules/platform-control/{components/ProgramRoadmapBoard.jsx,program-delivery-metrics.js}` |
