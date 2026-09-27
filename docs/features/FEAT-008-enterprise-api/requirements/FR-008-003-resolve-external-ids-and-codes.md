---
id: FR-008-003
title: "Resolve external ids and codes"
delivery: live
legacy: [FR-019 (split 2/3 — resolve)]
relations:
  specified_by: [API-075]
---

# FR-008-003 — Resolve external ids and codes

The system SHALL resolve either `system`+`value` to `{ id, code, type, externalRef }` or
`type`+`code` (PROJECT, WORKSTREAM, MILESTONE, GATE, WORK_CONTAINER, WORK_ITEM, WORKSPACE,
REPOSITORY) to `{ id, code, type, externalRefs[] }`, only when the record is visible to the
caller (session viewer: Project readable / Workspace visible / Repository `seesBusiness`; API
key: record's Tenant = key Tenant). An unmapped or invisible reference SHALL answer 404 with
the same message; a mapping to a deleted record SHALL answer 410 only to an installation
operator.

## Acceptance criteria

- AC-008-003-01 — Given `system` without `value`, then 400.
- AC-008-003-02 — Given a reference mapped to a record in another Tenant, then 404 "is not mapped to any record".

## Implementation

- apps/server/src/app/api/resolve/route.js

## Verification

- TC-008-003 — Resolve and OpenAPI (see [verification.md](../verification.md))
