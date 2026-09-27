---
id: FR-058-001
title: "OAuth start binds a single-use state to Tenant, Business and actor"
delivery: building
legacy: [FR-273 (split 1/2)]
relations:
  specified_by: [SDD-058, API-154]
  depends_on: [FR-094-004]
---

# FR-058-001 — OAuth start binds a single-use state to Tenant, Business and actor

The system SHALL, on `GET /api/integrations/notion/connect?businessId=`, require a
logged-in Person (401), ownership of the Business (404 `NOTION_BUSINESS_NOT_FOUND`), the
credential-write gate (AAL2 step-up and rate limit), and configured OAuth client and
redirect URI (503 `NOTION_OAUTH_NOT_CONFIGURED`); it SHALL store only the hash of a
random 43-character state bound to Tenant, Business and actor with a 10-minute expiry,
and redirect to Notion's authorize URL.

## Acceptance criteria

- AC-058-001-01 — Given a Member who does not own the Business, when starting, then 404 and no state row is written.
- AC-058-001-02 — Given no configured redirect URI, when starting, then 503.

## Implementation

- apps/server/src/modules/integration/application/notion-oauth-service.js; apps/server/src/app/api/integrations/notion/connect/route.js; apps/server/src/app/oauth/notion/callback/route.js

## Verification

- TC-058-001 — OAuth and webhook end to end (see [verification.md](../verification.md))
