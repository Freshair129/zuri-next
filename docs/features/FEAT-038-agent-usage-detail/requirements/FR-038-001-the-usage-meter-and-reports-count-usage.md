---
id: FR-038-001
title: "The usage meter and reports count usage detail, names and numbers only"
delivery: live
legacy: [FR-239]
relations:
  specified_by: [SDD-038]
  decided_by: [ADR-034]
---

# FR-038-001 — The usage meter and reports count usage detail, names and numbers only

For every session and branch the local usage meter SHALL count, beyond the
four headline token figures: thinking/reasoning tokens, cache writes by
lifetime, web search/fetch requests, tool calls by name with errors and
denials, user prompts, compactions and API errors, and requests per model.
Only tool and model names and numbers SHALL be kept — never prompt,
response, thinking, tool-argument or tool-output text. The usage-report
endpoint SHALL accept this detail as an optional, strictly validated object,
so a report with no detail (an older or now-retired reporting source)
SHALL still be accepted.

## Acceptance criteria

- AC-038-001-01 — Given a session with three tool calls, one of which errored, when the meter counts it, then the tool-call detail records three calls and one error, with no tool-output text stored anywhere.
- AC-038-001-02 — Given a report submitted with no detail object, when it is accepted, then the report is stored successfully with its headline counts intact.

## Implementation

- `apps/server/src/modules/platform-control/application/{programme-usage-reports.js,task-usage-ledger.js}`

## Verification

- TC-038-001 — Usage-detail counting, privacy allowlist, optional acceptance (see [verification.md](../verification.md))
