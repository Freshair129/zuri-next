---
id: FR-019-007
title: "SMART checks"
delivery: implemented
legacy: [FR-271]
relations:
  decided_by: [ADR-016]
---

# FR-019-007 — SMART checks

The system SHALL evaluate a Key Result with a pure `smartChecks` function returning Specific (title
non-empty and different from its Goal's), Measurable (metric, unit, finite baseline and target, target ≠
baseline), Time-bound (due date present, not in the past, and not after the Goal's target date when it
has one) as booleans, and Achievable and Relevant as `null` — never a fabricated score — and show the
checklist live in the Key Result editor.

## Acceptance criteria

- AC-019-007-01 — Given a KR titled like its Goal, then `specific: false`.
- AC-019-007-02 — Given any input, then `achievable` and `relevant` are `null`.

## Implementation

- apps/server/src/modules/project-manager/progress/smart-checks.js; components/StrategyEditModals.jsx

## Verification

- TC-019-004 — Strategy calculators (see [verification.md](../verification.md))
