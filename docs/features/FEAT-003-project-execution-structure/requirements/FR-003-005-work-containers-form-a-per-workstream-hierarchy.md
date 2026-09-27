---
id: FR-003-005
title: "Work containers form a per-Workstream hierarchy"
delivery: live
legacy: [FR-005 (split 1/2 — containers)]
relations:
  specified_by: [API-019, API-018]
---

# FR-003-005 — Work containers form a per-Workstream hierarchy

The system SHALL create and update WorkContainers (`WC…`) under a Workstream with a subtype
from `CONTAINER_SUBTYPES` (e.g. SPRINT, EPIC, RELEASE, MIGRATION_STAGE, SALES_PIPELINE…), a
status from `CONTAINER_STATUSES`, optional dates and metadata, and an optional parent that
SHALL belong to the same Workstream.

## Acceptance criteria

- AC-003-005-01 — Given a parent container of another Workstream, then the create is refused.

## Implementation

- apps/server/src/modules/project-manager/application/work-service.js; work-read-service.js; active-filters.js; apps/server/src/app/api/containers/**; apps/server/src/app/api/work/**; apps/server/src/modules/project-manager/views/universal/AllWorkView.jsx; apps/server/src/app/(pm)/work/page.jsx

## Verification

- TC-003-001 — Core model CRUD and invariants (see [verification.md](../verification.md))
