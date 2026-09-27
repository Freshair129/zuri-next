---
id: FR-033-001
title: "AuditEvent carries queryable scope and the change made"
delivery: implemented
legacy: [FR-198]
relations:
  specified_by: [SDD-033]
  decided_by: [ADR-026]
---

# FR-033-001 — AuditEvent carries queryable scope and the change made

`AuditEvent` SHALL gain seven nullable columns
(`tenantId`, `businessId`, `reason`, `beforeJson`, `afterJson`, `requestId`,
`sessionId`), indexed by `(tenantId, occurredAt)`, `(businessId,
occurredAt)` and `(actorId, occurredAt)`. Every `recordAudit` parameter that
fills them SHALL be optional. Only `membership-grant-service.js`,
`membership-lifecycle-service.js` and `access-invite-service.js` SHALL
populate them in this change; no retroactive backfill of existing rows
SHALL occur.

## Acceptance criteria

- AC-033-001-01 — Given an `AuditEvent` written before this migration, when it is read, then `tenantId`/`businessId`/`reason` are null — never an inferred or backfilled value.
- AC-033-001-02 — Given a Membership suspension after this change, when the resulting event is read, then it carries `tenantId`/`businessId`/ `reason` as columns, not only inside `payloadJson`.

## Implementation

- `apps/server/src/modules/identity/{access-invite-service.js,membership-grant-service.js,membership-lifecycle-service.js}`, `apps/server/src/modules/project-manager/application/audit.js`

## Verification

- TC-033-001 — AuditEvent scope columns populated by the two lifecycle writers (see [verification.md](../verification.md))
