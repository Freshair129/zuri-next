---
id: FR-015-003
title: "Project priority"
delivery: live
legacy: [FR-087]
relations:
  specified_by: [API-051]
  derived_from: [BR-005]
---

# FR-015-003 — Project priority

The system SHALL store an optional `Project.priority` from `PROJECT_PRIORITIES` (CRITICAL, HIGH,
MEDIUM, LOW) — nullable, never defaulted — editable through the Project create/update service, with
every dropdown, validator and OpenAPI enum derived from the enum source.

## Acceptance criteria

- AC-015-003-01 — Given priority "URGENT", then 400.

## Implementation

- apps/server/src/lib/validation/entities.js; application/project-service.js; components/ProjectModal.jsx; components/project-status-options.js

## Verification

- TC-015-002 — Priority and PIC (see [verification.md](../verification.md))
