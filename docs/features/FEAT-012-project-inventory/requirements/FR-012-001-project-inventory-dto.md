---
id: FR-012-001
title: "Project inventory DTO"
delivery: live
legacy: [FR-077 (split 1/2 — DTO)]
relations:
  specified_by: [SDD-012, API-064]
  decided_by: [ADR-009]
  derived_from: [BR-004]
---

# FR-012-001 — Project inventory DTO

The system SHALL return, for one Project, a strict `PROJECT_INVENTORY` schema-version `1.0`
DTO with sections: Project identity with direct Business owner and Space context;
Workstreams, WorkContainers and WorkItems; Milestones and Gates; Dependencies whose two
endpoints are inside the Project (with graph version); legacy ProjectFiles and managed FileAssets
as metadata only, merged without duplicate ids; ProjectRepository links; visible Team /
Membership rows; strategy-based progress with evidence; and recent AuditEvent activity. Raw
`metricDataJson`, `metadataJson`, audit `payloadJson`, filesystem roots and binary content SHALL
be excluded. The DTO SHALL never be a raw ORM graph.

## Acceptance criteria

- AC-012-001-01 — Given a Project with a dependency to another Project's item, then the dependency section omits it.
- AC-012-001-02 — Given an AuditEvent with a payload, then the activity row carries entity type, action, actor type and time but no payload.
- AC-012-001-03 — Given a GET, then no `progressCache` is updated.

## Implementation

- apps/server/src/modules/project-manager/application/project-inventory-read-model.js; apps/server/src/app/api/projects/[id]/inventory/route.js; apps/server/src/app/(pm)/projects/[projectId]/inventory/page.jsx; apps/server/src/app/api/_helpers.js

## Verification

- TC-012-001 — Inventory read model (see [verification.md](../verification.md))
- TC-012-003 — Inventory under load (see [verification.md](../verification.md))
