---
id: FR-048-001
title: "Account identity and scope derivation"
delivery: implemented
legacy: [FR-146 (split 1/4)]
relations:
  specified_by: [API-123]
  decided_by: [ADR-044]
---

# FR-048-001 — Account identity and scope derivation

The system SHALL create a `LineOaAccount` with an internal UUID, a
Tenant-unique human `code`, a 1:1 reference to an existing `LINE_OA`
`IntegrationConnection`, and `tenantId`/`businessId` derived from the trusted
viewer and the selected visible Business — never from the request payload.

## Acceptance criteria

- AC-048-001-01 — Given a viewer who can see Business B and an existing `LINE_OA` connection of B, when they POST `/api/line-oa/accounts` with that connection id, then a DRAFT account is created scoped to B.
- AC-048-001-02 — Given a `businessId` the viewer cannot see, when they POST to create an account, then the request is refused with the same 404 an unknown Business gets.

## Implementation

- `apps/server/src/app/api/line-oa/accounts/route.js`, `apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js`

## Verification

- TC-048-001 — Account creation, scope derivation and refusal shape (see [verification.md](../verification.md))
