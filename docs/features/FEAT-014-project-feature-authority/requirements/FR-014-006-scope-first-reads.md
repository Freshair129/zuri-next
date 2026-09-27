---
id: FR-014-006
title: "Scope-first reads"
delivery: building
legacy: [FR-252 (split 6/7 — reads)]
relations:
  specified_by: [API-058, API-061, API-054]
  derived_from: [BR-004]
---

# FR-014-006 — Scope-first reads

The system SHALL validate the complete Tenant → Business → Workspace → Project hierarchy before
loading any Feature payload, answering missing, deleted, foreign and invalid-hierarchy targets
with one redacted 404 `RESOURCE_NOT_FOUND`; SHALL provide the Feature view (Project Features,
their domains, WorkItem contributions counted once, pinned evidence, unchanged weighted progress,
aggregate snapshot explicitly UNAVAILABLE), a Feature list with signed, expiring cursor pagination
and a Feature detail; and SHALL never infer Feature rows from other data.

## Acceptance criteria

- AC-014-006-01 — Given a WorkItem linked to two Features, then the view counts it once in totals.
- AC-014-006-02 — Given a tampered cursor, then 400.

## Implementation

- application/project-feature-read-model.js; apps/server/src/app/api/projects/[id]/feature-view/route.js; apps/server/src/app/(pm)/projects/[projectId]/feature-view/page.jsx; components/ProjectFeature*.jsx

## Verification

- TC-014-003 — Reads and view (see [verification.md](../verification.md))
