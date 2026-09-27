---
id: FR-021-001
title: "Append-only audit trail"
delivery: live
legacy: [FR-014 (split 1/2 — audit writer)]
relations:
  derived_from: [SEC-003, BR-081, BR-001]
---

# FR-021-001 — Append-only audit trail

The system SHALL provide one audit writer that appends an AuditEvent with entity type and id, action,
JSON payload, actor type and id, optional Tenant/Business scope, reason, before/after JSON, request id
and session id, and SHALL offer no update or delete path for audit rows. Other domains MAY append
through the same writer; this domain defines the shape.

## Acceptance criteria

- AC-021-001-01 — Given any PRJ mutation, then exactly one AuditEvent with the entity id and action exists afterwards.
- AC-021-001-02 — Given the API surface, then no route updates or deletes an AuditEvent.

## Implementation

- apps/server/src/modules/project-manager/application/audit.js; apps/server/src/app/api/audit/route.js; apps/server/src/app/(pm)/audit/page.jsx

## Verification

- TC-021-001 — Audit browser (see [verification.md](../verification.md))
- TC-021-002 — Snapshot export/import (see [verification.md](../verification.md))
