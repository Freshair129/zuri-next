---
id: FR-055-005
title: "The data plane pulls decided facts by cursor"
delivery: live
legacy: [FR-100 (split 3/3)]
relations:
  specified_by: [SDD-055, API-164]
---

# FR-055-005 — The data plane pulls decided facts by cursor

The system SHALL answer `GET /api/platform/sot/decisions/export?tenantId=&since=&limit≤500`
for an operator or the Tenant's data-plane key with APPROVED/REJECTED rows in stable
`(updatedAt, id)` order and a `nextCursor` (`<iso>_<id>`); a malformed cursor is 400.

## Acceptance criteria

- AC-055-005-01 — Given a cursor from a previous page, when exporting, then no row already returned is repeated.

## Verification

- TC-055-002 — Decision queue submit/decide/export (see [verification.md](../verification.md))
