---
id: FR-018-003
title: "Attention queue and briefing"
delivery: live
legacy: [FR-060 (split 2/2 — attention and briefing)]
relations:
  derived_from: [BR-004]
---

# FR-018-003 — Attention queue and briefing

The system SHALL build an attention queue only from real signals — required gates open (MED) or
overdue (HIGH), milestones past target (HIGH), goals past target (HIGH), goals without a linked
Project (INFO), Key Results behind pace (MED) or off track (HIGH) — ordered by severity then a stable
key, and a one-line briefing composed from the same computed signals (health and coverage, count of
urgent items, reserved domains).

## Acceptance criteria

- AC-018-003-01 — Given a goal past its target date, then a HIGH row "Goal past target — <title>" appears.
- AC-018-003-02 — Given equal-severity rows, then their order is identical across renders.

## Verification

- TC-018-001 — Business Home read model (see [verification.md](../verification.md))
