---
id: FR-008-002
title: "Per-Tenant API key enforcement"
delivery: live
legacy: [FR-106 (enforcement on PRJ routes, key lifecycle is DOM-IAM)]
relations:
  depends_on: [FR-008-002]
  derived_from: [SEC-005, SEC-001]
---

# FR-008-002 — Per-Tenant API key enforcement

The system SHALL accept on the Enterprise API routes (`/api/import/dry-run`,
`/api/import/commit`, `/api/resolve`, `/api/docs`) an `Authorization: Bearer <key>` whose
SHA-256 digest matches an ACTIVE API access key, and SHALL scope every such request to the
key's own Tenant: an import target or resolved record in another Tenant SHALL be answered as
not found. A missing, invalid or revoked key SHALL fall through to session authentication so
that all three failures answer identically; revocation SHALL take effect on the next request.

## Acceptance criteria

- AC-008-002-01 — Given a key of Tenant A, when committing into a Workspace of Tenant B, then the refusal equals the refusal for a nonexistent Workspace.
- AC-008-002-02 — Given a revoked key and no session, then the response equals the response for no key (401).
- AC-008-002-03 — Given a valid key, then `lastUsedAt` is updated and the request proceeds as the Tenant principal.

## Implementation

- apps/server/src/modules/identity/api-access-auth.js (consumed); import/import-authorization.js; apps/server/src/app/api/import/{dry-run,commit}/route.js; apps/server/src/app/api/resolve/route.js; apps/server/src/app/api/docs/route.js

## Verification

- TC-008-002 — API key enforcement and Tenant scoping (see [verification.md](../verification.md))
