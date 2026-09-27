---
id: FR-090-002
title: "Insights refresh request and state (declared)"
delivery: building
legacy: [FR-276]
relations:
  specified_by: [SDD-090]
  decided_by: [none]
---

# FR-090-002 — Insights refresh request and state (declared)

The system SHALL let an authorized member request a refresh
(`POST /api/insights/refresh`) and read its state
(`GET /api/insights/refresh/[syncRunId]`); requests for the same binding and window
SHALL coalesce into one run; a conflicting concurrent run SHALL be refused rather
than queued twice; a failed run SHALL retry exactly once; a failed or partial run
SHALL never replace the last complete snapshot.

## Acceptance criteria

- AC-090-002-01 — Given two refresh requests for the same binding/window in quick succession, when both are submitted, then they coalesce into one run, not two.
- AC-090-002-02 — Given a run already in progress for a binding/window, when a conflicting request arrives, then it is refused, not silently queued behind it.
- AC-090-002-03 — Given a run that fails after one retry, when the brand's snapshot is next read, then it still reflects the last complete snapshot, not the failed/partial one.

## Implementation

- Not implemented in this checkout — no `refresh` route exists under `apps/server/src/app/api/insights/` as of this reading
