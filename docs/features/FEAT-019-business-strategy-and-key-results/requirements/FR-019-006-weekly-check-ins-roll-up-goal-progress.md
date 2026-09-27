---
id: FR-019-006
title: "Weekly check-ins roll up goal progress"
delivery: implemented
legacy: [FR-268 (split 2/2 — check-ins and roll-up)]
relations:
  specified_by: [API-014]
  derived_from: [BR-089, NFR-005]
---

# FR-019-006 — Weekly check-ins roll up goal progress

The system SHALL record at most one check-in per Key Result per week (week starting Monday 00:00
Asia/Bangkok; a second check-in in the same week updates it) with value, confidence, note and source,
and in the same transaction recompute: KR progress = clamp((value − baseline)/(target − baseline))
for UP, mirrored for DOWN; Goal progress = mean of its Key Results' progress. KR status SHALL be BAD
when confidence ≤ 1, otherwise from the gap between expected (time-elapsed) and actual progress: ≤ 12
points OK, ≤ 30 WARN, else BAD, with confidence ≤ 2 lowering OK to WARN.

## Acceptance criteria

- AC-019-006-01 — Given baseline 0, target 200, value 50 (UP), then KR progress = 25.
- AC-019-006-02 — Given two check-ins on Tuesday and Friday of one week, then one row exists with Friday's value.
- AC-019-006-03 — Given Key Results at 25 % and 75 %, then Goal progress = 50.

## Implementation

- apps/server/src/modules/project-manager/progress/key-result-progress.js; progress/goal-rollup.js; progress/week.js

## Verification

- TC-019-003 — Key Results and check-ins (see [verification.md](../verification.md))
- TC-019-004 — Strategy calculators (see [verification.md](../verification.md))
