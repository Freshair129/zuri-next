---
id: FR-093-009
title: "One tick answers several customers and sends in order"
part: FEAT-093-P04
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 7/10)]
relations:
  specified_by: [SDD-093, EVT-002]
---

# FR-093-009 — One tick answers several customers and sends in order

The system SHALL, per authenticated tick (`POST /api/line-oa/worker`, bearer worker
token), first reconcile accepted sends and abandoned admissions, then answer up to 4
claimed jobs in parallel and send up to 5 ready answers sequentially (both
operator-overridable within 1–50); the supervising script SHALL poll every 250 ms while
a tick did work and back off from 1 s to 10 s while idle, and admission SHALL wake it
directly.

## Acceptance criteria

- AC-093-009-01 — Given three customers waiting, when one tick runs, then all three answers are generated in that tick rather than one per tick.
- AC-093-009-02 — Given an idle system, when ticks return IDLE, then the interval grows to at most 10 s.

## Verification

- TC-093-005 — Job ledger, fencing, send outcomes and cadence (see [verification.md](../verification.md))
