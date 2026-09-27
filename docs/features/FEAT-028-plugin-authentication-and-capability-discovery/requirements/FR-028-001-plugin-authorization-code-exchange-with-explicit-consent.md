---
id: FR-028-001
title: "Plugin authorization-code exchange with explicit consent"
delivery: building
legacy: [FR-123]
relations:
  specified_by: [SDD-028]
  decided_by: [ADR-031]
---

# FR-028-001 — Plugin authorization-code exchange with explicit consent

The system SHALL let a signed-in browser session authorize a 60-second
single-use code, bound to an exact `client_id`, a registered `redirect_uri`,
an `installation_id` and a PKCE S256 challenge, only through a **POST** from
the rendered `/plugin/authorize` consent screen carrying a session cookie, a
session-bound anti-CSRF token and an HMAC-signed request token; `GET
/authorize` SHALL render only and SHALL mint nothing. Exchanging the code
with its verifier SHALL yield a 15-minute opaque bearer `PluginSession`.
Codes and tokens SHALL be persisted only as SHA-256 hashes.
`getPluginCapabilities` SHALL resolve the viewer **without** `platformGrant`,
so a plugin never inherits cross-tenant DEV visibility. Redirect matching
SHALL be exact (`localhost` and `127.0.0.1` are two distinct registrations).
Replaying a consumed code SHALL be refused **and** SHALL revoke the session
that code already minted. Revoke SHALL be idempotent and answer identically
for a token that never existed.

## Acceptance criteria

- AC-028-001-01 — Given a `GET /api/plugin/auth/authorize` call, when it runs, then no `PluginAuthorizationCode` row is created and no session cookie is read.
- AC-028-001-02 — Given a fully valid consent-form POST, when it completes, then exactly one single-use code is minted, hash-stored, and bound to the exact client/redirect/installation/PKCE challenge shown on the screen.
- AC-028-001-03 — Given a code presented a second time after successful exchange, when it is replayed, then the exchange is refused **and** the `PluginSession` that code minted is revoked.
- AC-028-001-04 — Given a viewer with a platform DEV grant, when `getPluginCapabilities` resolves for their plugin session, then the capability list excludes cross-tenant DEV visibility.

## Implementation

- `apps/server/src/app/(entry)/plugin/authorize/page.jsx`, `apps/server/src/app/api/plugin/auth/{authorize,capabilities,revoke,token}/route.js`, `apps/server/src/modules/identity/{plugin-auth-service.js,plugin-consent.js,plugin-consent-view.js,plugin-consent-access.js}`

## Verification

- TC-028-001 — Consent gate: GET never mints, POST does (see [verification.md](../verification.md))
- TC-028-002 — Replay revokes the minted session (see [verification.md](../verification.md))
- TC-028-003 — Capability discovery never carries a platform grant (see [verification.md](../verification.md))
