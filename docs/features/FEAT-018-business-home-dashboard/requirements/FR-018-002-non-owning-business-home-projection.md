---
id: FR-018-002
title: "Non-owning Business Home projection"
delivery: live
legacy: [FR-060 (split 1/2 — health projection)]
relations:
  decided_by: [ADR-004]
  derived_from: [BR-004]
---

# FR-018-002 — Non-owning Business Home projection

The system SHALL compute Business Home from the owning domains' read models (Projects with
milestones/gates, Business strategy, People directory count) without persisting any figure or adding
any write path: per-domain health with states SCORED, NO_SIGNAL (live domain without data) and
RESERVED (no module — no number); Development health = 100 − (12 × overdue required gates + 8 ×
overdue milestones + 3 × other open required gates), clamped to 0–100; People reported as a headcount
fact, not a score; a composite score = mean of SCORED domains, always stating its coverage ("n of m
domains").

## Acceptance criteria

- AC-018-002-01 — Given 1 overdue required gate and 1 overdue milestone, then Development health = 80 with signal "1 required gate overdue".
- AC-018-002-02 — Given Commerce has no module, then its slot is RESERVED with no score and the composite excludes it.

## Implementation

- apps/server/src/modules/business/application/business-home-read-model.js; apps/server/src/config/domains.js

## Verification

- TC-018-001 — Business Home read model (see [verification.md](../verification.md))
