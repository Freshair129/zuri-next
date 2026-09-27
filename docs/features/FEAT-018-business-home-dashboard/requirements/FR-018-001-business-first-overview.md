---
id: FR-018-001
title: "Business-first Overview"
delivery: live
legacy: [FR-035]
relations:
  decided_by: [ADR-004]
  derived_from: [BR-003]
---

# FR-018-001 — Business-first Overview

The system SHALL render `/overview` for exactly one selected, visible Business — its execution
KPIs, Project health (only Projects owned by that Business), strategy and shortcuts to the domains
enabled for it — and SHALL treat a missing Business selection as an actionable state that routes to
the Business chooser, never as a Group card roll-up.

## Acceptance criteria

- AC-018-001-01 — Given no selected Business, then the page offers Business selection and shows no aggregated figures.
- AC-018-001-02 — Given a null-owner shared Project, then it is not counted in any Business's Overview.

## Implementation

- apps/server/src/app/(pm)/overview/page.jsx

## Verification

- TC-018-002 — Business-first Overview end to end (see [verification.md](../verification.md))
