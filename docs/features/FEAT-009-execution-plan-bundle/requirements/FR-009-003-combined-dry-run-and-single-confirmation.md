---
id: FR-009-003
title: "Combined dry run and single confirmation"
delivery: implemented
legacy: [FR-108 (split 3/4 — combined dry run)]
relations:
  specified_by: [API-005]
  derived_from: [BR-054]
---

# FR-009-003 — Combined dry run and single confirmation

The system SHALL dry-run the strategy through the Business-strategy services' rules
(horizon reconcile previewed truthfully: an omitted horizon with goals is a conflict, one
without goals a removal), run the existing PlanEnvelope dry run for every Project entry,
validate cross-Project dependencies (type from `DEPENDENCY_TYPES`, no cycle with existing
PROJECT edges) against the combined preview, and return one combined preview; any unresolved
conflict SHALL make the whole bundle non-committable. Strategy writes by a key-only viewer
SHALL surface as a dry-run conflict ("strategy writes require owner authority").

## Acceptance criteria

- AC-009-003-01 — Given one Project envelope with a conflict and two clean ones, then `committable: false` and nothing is written on commit.
- AC-009-003-02 — Given an API-key viewer and a bundle with a roadmap, then the preview lists the owner-authority conflict.

## Implementation

- import/bundle/bundle-dry-run.js; import/plan-import-service.js
