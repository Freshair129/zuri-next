---
id: FR-006-005
title: "Schedule"
delivery: live
legacy: [FR-064]
relations:
  specified_by: [API-069, API-051]
  derived_from: [BR-004]
---

# FR-006-005 — Schedule

The system SHALL render Project and Milestone dates on a derived month grid — a bar per
Project from `startAt` to `targetAt`, a marker per Milestone `targetAt` — globally for the
selected Business and per Project; items without dates SHALL simply not render a bar. The
view SHALL be read-only and non-owning; a normal viewer SHALL never fall back to an
installation-wide timeline.

## Acceptance criteria

- AC-006-005-01 — Given a Project without `targetAt`, then no bar is drawn and no error occurs.
- AC-006-005-02 — Given no selected Business, then the global Schedule requests nothing.

## Implementation

- apps/server/src/app/(pm)/timeline/page.jsx; apps/server/src/app/(pm)/projects/[projectId]/timeline/page.jsx; views/universal/TimelineView.jsx

## Verification

- TC-006-005 — Schedule scope (see [verification.md](../verification.md))
