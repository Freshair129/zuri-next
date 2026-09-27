---
id: FR-008-004
title: "OpenAPI document"
delivery: live
legacy: [FR-019 (split 3/3 — OpenAPI docs)]
relations:
  specified_by: [API-047]
  derived_from: [BR-005]
---

# FR-008-004 — OpenAPI document

The system SHALL serve a generated OpenAPI document of the public PRJ API surface, derived
from the same schemas and enum source used for validation, to an API-key or session caller
(loopback hosts exempt), with `Cache-Control: no-store`.

## Acceptance criteria

- AC-008-004-01 — Given a non-loopback request without key or session, then 401.
- AC-008-004-02 — Given the document, then the Project status enum equals `PROJECT_STATUSES`.

## Implementation

- apps/server/src/modules/project-manager/api-docs/openapi.js; apps/server/src/app/api/docs/route.js

## Verification

- TC-008-003 — Resolve and OpenAPI (see [verification.md](../verification.md))
