---
id: FR-033-002
title: "An owner can read their own access history and current grant roster"
delivery: implemented
legacy: [FR-199]
relations:
  specified_by: [SDD-033]
  decided_by: [ADR-026]
---

# FR-033-002 — An owner can read their own access history and current grant roster

`listAccessHistory({ businessId | tenantId | personId })` SHALL return
events in the MEMBERSHIP, ROLE_BINDING, ACCESS_INVITE and access-related
PERSON families for exactly one scope, newest first, each with a before/
after snapshot and the actor joined to `{ id, code, displayName }`; authority
SHALL be `ownsBusiness`, `ownsTenant`, oneself, or the installation operator,
refusing 404-shaped identically for a scope the caller does not own and one
that does not exist. `listBusinessAccess({ businessId })` SHALL return the
current-state roster — every grant in that Business in every status, with
granting/revoking person joined in.

## Acceptance criteria

- AC-033-002-01 — Given a caller who does not own Business A and Business A does not exist, when either is queried via `listAccessHistory`, then both refusals are byte-identical.
- AC-033-002-02 — Given a Business with one ACTIVE and one REVOKED Membership, when `listBusinessAccess` is called, then both rows are returned, each with its granting/revoking person.

## Implementation

- `apps/server/src/app/api/platform/{access-history/route.js,businesses/[businessId]/grants/route.js}`, `apps/server/src/modules/identity/access-history-service.js`, `apps/server/src/app/(pm)/platform/users/page.jsx`

## Verification

- TC-033-002 — Access history and business-access read models (see [verification.md](../verification.md))
