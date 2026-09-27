---
id: FR-076-004
title: "Live pipeline health overlay"
delivery: implemented
legacy: [FR-215]
relations:
  specified_by: [SDD-076]
  decided_by: [ADR-070]
---

# FR-076-004 — Live pipeline health overlay

The system SHALL show, for the active Business only, per-edge counts by status and the
last run time for every edge backed by a ledger or job table (the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 pipeline
ledger, LINE conversation jobs, rich-menu publish jobs, asset-extraction jobs), read
through the owning domain's own read port with exactly one bounded read per table. An
edge with no backing table SHALL show no number rather than a zero; a failed read
SHALL leave the edge unavailable/null rather than reporting a false zero, and SHALL
still link to the existing monitor or job surface for a failed record. The static map
SHALL render and remain usable even when every live read fails.

## Acceptance criteria

- AC-076-004-01 — Given a read against one owning-domain port fails, when the overlay renders, then that one edge shows unavailable/null while the other three ports' edges render normally.
- AC-076-004-02 — Given an edge with no backing table at all, when the overlay renders, then it shows no number — never a `0` that could be misread as "ran zero times."
- AC-076-004-03 — Given a viewer of a different Business, when the overlay requests health for the active Business, then none of another Business's counts are ever visible.
- AC-076-004-04 — Given every one of the four reads fails, when the page renders, then the static map itself still renders and remains usable — the live overlay never blocks it.

## Implementation

- apps/server/src/app/api/pipelines/health/route.js; apps/server/src/modules/knowledge/pipeline-map/pipeline-health-service.js; apps/server/src/modules/knowledge/pipeline-map/use-pipeline-health.js

## Verification

- TC-076-004 — Live health overlay — truthful unavailable/null states (see [verification.md](../verification.md))
