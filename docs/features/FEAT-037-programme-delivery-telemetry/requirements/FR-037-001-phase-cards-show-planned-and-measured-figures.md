---
id: FR-037-001
title: "Phase cards show planned and measured figures, always labelled and never blended"
delivery: live
legacy: [FR-216]
relations:
  specified_by: [SDD-037]
  decided_by: [ADR-034]
---

# FR-037-001 — Phase cards show planned and measured figures, always labelled and never blended

Each phase card on `/control/roadmap` SHALL show its sprint count, task count
by status, size (sum of complexity points), plan window (calendar days) and
effort estimate (from the sizing table), and — once measured — elapsed/
active time and tokens with their sources. A phase, lane or task with no
measurement SHALL read "not measured" — never zero and never its
prediction. No measured figure SHALL feed plan progress, a gate or a status.
Done/review cards SHALL be tinted light green/light orange in both themes,
with the status word retained on the card.

## Acceptance criteria

- AC-037-001-01 — Given a phase with no usage report or meter entry, when its card renders, then it shows "not measured", not `0`.
- AC-037-001-02 — Given a measured phase, when a gate or status check runs elsewhere, then the measured figure is never consulted as an input.

## Implementation

- `apps/server/src/app/(control)/control/roadmap/page.jsx`, `apps/server/src/modules/platform-control/{program-delivery-metrics.js,components/ProgramRoadmapBoard.jsx}`

## Verification

- TC-037-001 — Planned/measured labelling and card tint (see [verification.md](../verification.md))
