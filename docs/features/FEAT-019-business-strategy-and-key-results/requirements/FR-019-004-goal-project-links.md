---
id: FR-019-004
title: "Goal ↔ Project links"
delivery: implemented
legacy: [FR-059 (split 3/3 — project links)]
relations:
  specified_by: [API-011, API-010]
---

# FR-019-004 — Goal ↔ Project links

The system SHALL link and unlink Projects to Goals of the same Business (ProjectGoal), owner-only and
audited, refusing a Project of another Business or an unknown/archived Project.

## Acceptance criteria

- AC-019-004-01 — Given a Project of Business B and a Goal of Business A, then the link is refused.

Delivery: live

## Verification

- TC-019-002 — Strategy mutations (see [verification.md](../verification.md))
