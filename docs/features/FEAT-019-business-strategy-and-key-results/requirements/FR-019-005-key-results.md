---
id: FR-019-005
title: "Key Results"
delivery: implemented
legacy: [FR-268 (split 1/2 — key results)]
relations:
  specified_by: [API-009, API-013]
  decided_by: [ADR-016]
---

# FR-019-005 — Key Results

The system SHALL let an owner add Key Results to a Goal — title, metric, unit, baseline, target (≠
baseline), direction UP|DOWN, optional due date, optional owner Person, confidence 1–5 (default 3),
status — and update them, with a code (`KR…`, declared codes unique) and audit.

## Acceptance criteria

- AC-019-005-01 — Given target = baseline, then 400 "target must differ from baseline".

## Verification

- TC-019-003 — Key Results and check-ins (see [verification.md](../verification.md))
