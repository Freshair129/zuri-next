---
id: FR-058-002
title: "The callback exchanges the code server-side and vaults the tokens"
delivery: building
legacy: [FR-273 (split 2/2)]
relations:
  specified_by: [SDD-058, API-155, API-161]
  decided_by: [ADR-057]
---

# FR-058-002 — The callback exchanges the code server-side and vaults the tokens

The system SHALL, on `GET /oauth/notion/callback?code=&state=`, refuse a malformed,
unknown, expired or consumed state (400 `NOTION_OAUTH_STATE_INVALID`) and a different
actor (403 `NOTION_OAUTH_ACTOR_MISMATCH`), re-run the write gate, consume the state
exactly once, treat a provider `error` as 400 `NOTION_OAUTH_DENIED`, exchange the code at
Notion's `/v1/oauth/token` with the configured redirect URI, and store the access and
refresh tokens as a `NOTION_OAUTH_TOKEN` credential on a Business-scoped connection that
becomes ACTIVE only after the store succeeds (a DRAFT connection is removed on failure).
A workspace already connected to another connection is refused 409
`NOTION_WORKSPACE_ALREADY_CONNECTED`. The response SHALL be a redirect carrying only an
outcome code, with `Cache-Control: no-store` and `Referrer-Policy: no-referrer`; no code
or token reaches the browser.

## Acceptance criteria

- AC-058-002-01 — Given a state used once, when the callback is replayed, then 400 and no second exchange occurs.
- AC-058-002-02 — Given a token exchange failure, when the callback completes, then the redirect carries `NOTION_OAUTH_EXCHANGE_FAILED` and no ACTIVE connection exists.
- AC-058-002-03 — Given a successful exchange, when the connection is read, then only its status and metadata are visible, never token material.

## Implementation

- apps/server/src/modules/integration/application/notion-oauth-service.js; apps/server/src/app/api/integrations/notion/connect/route.js; apps/server/src/app/oauth/notion/callback/route.js

## Verification

- TC-058-001 — OAuth and webhook end to end (see [verification.md](../verification.md))
