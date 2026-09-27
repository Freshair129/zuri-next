---
id: FR-037-002
title: "The usage meter measures from local Claude Code/Codex logs"
delivery: live
legacy: [FR-217]
relations:
  specified_by: [SDD-037]
  decided_by: [ADR-034]
---

# FR-037-002 — The usage meter measures from local Claude Code/Codex logs

`scripts/programme-usage-meter.mjs` SHALL read Claude Code and Codex session
logs on the operator's machine, count each billed request exactly once
(`requestId`/`response_id`), normalise to four token counts, attribute each
request to the lane whose declared branches include the request's branch —
only for requests made inside this repository — and compute per lane the
first/last activity, elapsed time and active time (gaps capped at 15
minutes). A branch claimed by two lanes, or a lane spanning two phases,
SHALL fail the generator by name. A second run over the same logs SHALL be
byte-stable.

## Acceptance criteria

- AC-037-002-01 — Given the same log files, when the meter runs twice, then the second run's output is byte-identical to the first.
- AC-037-002-02 — Given a request on an undeclared branch, when the meter runs, then it is reported as unattributed, never guessed onto a lane.

## Implementation

- `apps/server/src/modules/platform-control/program-roadmap-telemetry.js`, `apps/server/scripts/programme-usage-meter.mjs`

## Verification

- TC-037-002 — Usage meter attribution and byte-stable regeneration (see [verification.md](../verification.md))
