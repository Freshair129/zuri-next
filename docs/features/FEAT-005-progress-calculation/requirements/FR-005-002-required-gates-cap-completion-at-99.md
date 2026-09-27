---
id: FR-005-002
title: "Required gates cap completion at 99 %"
delivery: live
legacy: [FR-010 (split 2/2 — gate cap)]
relations:
  derived_from: [BR-051]
---

# FR-005-002 — Required gates cap completion at 99 %

The system SHALL cap TASK_WEIGHT, MILESTONE_READINESS and EXPANSION_READINESS at 99 % with
a warning while any `required` Gate of the Workstream is not PASSED or WAIVED, even when all
weight is complete, and SHALL warn separately about BLOCKED required gates.

## Acceptance criteria

- AC-005-002-01 — Given all items DONE and one required Gate OPEN, then percent = 99 and a warning says "capped at 99%".
- AC-005-002-02 — Given the Gate WAIVED, then percent = 100.

## Verification

- TC-005-002 — Gate cap and rounding (see [verification.md](../verification.md))
