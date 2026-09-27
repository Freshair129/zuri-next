---
id: FR-038-002
title: "The board shows usage detail per lane, never estimating an absent figure"
delivery: live
legacy: [FR-240]
relations:
  specified_by: [SDD-038]
  decided_by: [ADR-034]
---

# FR-038-002 — The board shows usage detail per lane, never estimating an absent figure

Each phase card's measured row SHALL show input/output/thinking/cache tokens
as separate figures, tool calls with their error rate, prompts and
compactions, aggregated once across the meter's lanes and any accepted
reports. A lane without detail SHALL say so rather than showing zero.
Historical person/device split (from data recorded before the harness
plugin's retirement) SHALL remain readable where rows already carry it.

## Acceptance criteria

- AC-038-002-01 — Given a lane whose only source is the local meter (no detail-carrying report), when the board renders that lane's detail row, then it states the detail is unavailable rather than showing zeros.

## Implementation

- `apps/server/src/modules/platform-control/{components/ProgramRoadmapBoard.jsx,program-delivery-metrics.js}`

## Verification

- TC-038-002 — Board renders per-lane detail or states it is unavailable (see [verification.md](../verification.md))
