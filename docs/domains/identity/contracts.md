# Identity — contracts

Routes enumerated from `docs/domains/identity/CHARTER.md`'s `owns_routes`
globs and the live worktree (`apps/server/src/app/api/**`), not only the
input slice.

### API-088 — Viewer-scoped entry read model
Owner: DOM-IAM
`GET /api/entry` · `GET /api/viewer` (compatibility window, same trusted seam)
· `GET /api/scope` (internal scope-management interface; not consumed by
Business Routing).

Auth: trusted `SessionPort` (signed `zuri_session` cookie → live `Session`
row); `401` with no session, `503` if the session store is unavailable.
Response (`/api/entry`): `{ viewer: { principal, role, visibleDomains,
isPlatform }, businesses: [{ id, code, name, tenant, portfolio }] }` — no
memberships, hidden Business ids or client-editable authorization claims.

Implements: FR-023-001, FR-023-002
Legacy: `GET /api/entry`, `GET /api/viewer` (ADR-017)

### API-087 — Credential login, logout, signup, password reset, step-up
Owner: DOM-IAM
`POST /api/auth/login` · `POST /api/auth/logout` · `POST /api/auth/signup` ·
`POST /api/auth/reset-password` · `GET /api/auth/csrf` · `POST
/api/auth/step-up`.

Auth: `login`/`signup`/`reset-password` are public; `logout`/`step-up` need a
live Session. Errors: generic `401` on bad credentials (never distinguishes
"unknown account" from "wrong password"); `429` on signup rate limit.

Implements: FR-025-003 (signup), FR-026-001 (reset), FR-029-002 (session/logout)
Legacy: FR-120, FR-104, FR-095

### API-089 — TOTP factor lifecycle
Owner: DOM-IAM
`GET /api/auth/mfa/factors` · `DELETE /api/auth/mfa/factors` · `POST
/api/auth/mfa/totp/enroll` · `POST /api/auth/mfa/totp/verify`.

Auth: live Session. `503 MFA_SECRET_KEY_REQUIRED` in production with no
sealing key configured (ADR-028 D3).

Implements: FR-029-001, FR-029-002
Legacy: FR-094, FR-095

### API-095 — Passkey registration, login, step-up
Owner: DOM-IAM
`GET /api/auth/webauthn/credentials` · `DELETE
/api/auth/webauthn/credentials` · `POST /api/auth/webauthn/register/options`
· `POST /api/auth/webauthn/register/verify` · `POST
/api/auth/webauthn/login/options` · `POST /api/auth/webauthn/login/verify` ·
`POST /api/auth/webauthn/step-up`.

Auth: registration/step-up need a live Session; login options/verify are
public (they establish the session).

Implements: FR-029-001, FR-029-002
Legacy: FR-094, FR-095

### API-090 — Profile-first onboarding and workspace creation
Owner: DOM-IAM
`GET /api/onboarding/state` · `POST /api/onboarding/profile` · `POST
/api/onboarding/workspaces`.

Auth: live Session (any authenticated Person, including Waiting-Room-only).
`POST /api/onboarding/profile` requires given name, family name and
telephone; `POST /api/onboarding/workspaces` creates one Portfolio + one
OWNER `WorkspaceMembership` and zero Tenant/Business/Space/Project rows.

Implements: FR-025-001, FR-025-005
Legacy: FR-066, FR-122

### API-096 — Workspace invite and membership
Owner: DOM-IAM
`POST /api/workspace-invites` · `DELETE /api/workspace-invites/[id]` · `POST
/api/workspace-invites/accept` · `GET /api/workspace-memberships` · `DELETE
/api/workspace-memberships`.

Auth: mint/revoke need `assertWorkspaceAdminAuthority`; accept needs a live
Session (binds to the accepting session's `personId`, never the invited
email). Refusal: one generic `INVALID_OR_EXPIRED_INVITE` for every failure
mode.

Implements: FR-025-002
Legacy: FR-067

### API-091 — Users & Permissions administration
Owner: DOM-IAM
`GET /api/platform/users` · `PATCH /api/platform/users` · `POST
/api/platform/users/memberships` · `POST
/api/platform/users/memberships/[id]/lifecycle` · `POST
/api/platform/users/offboard` · `POST /api/platform/users/password-resets`.

Auth: OWNER-only (per-Business/Tenant), or installation operator. The
lifecycle route accepts `{ action: suspend|reinstate|revoke, reason }`.
Refusal: 409 `LAST_OWNER` when an action would leave a scope with no live
OWNER.

Implements: FR-024-002, FR-024-004, FR-026-001, FR-030-001
Legacy: FR-038, FR-062, FR-104, FR-191

### API-086 — Access history and grant roster (read-only)
Owner: DOM-IAM
`GET /api/platform/access-history?{businessId|tenantId|personId}` · `GET
/api/platform/businesses/[businessId]/grants`.

Auth: `ownsBusiness`/`ownsTenant`/self/operator. Refusal: 404-shaped
identically for an unowned and a nonexistent scope (SEC-001).

Implements: FR-033-002
Legacy: FR-199

### API-092 — Plugin authorization-code and token exchange
Owner: DOM-IAM
`GET /api/plugin/auth/authorize` (renders consent, mints nothing) · `POST
/api/plugin/auth/authorize` (the consent form's own submission — the only
path that mints a code) · `POST /api/plugin/auth/token` · `GET
/api/plugin/auth/capabilities` · `POST /api/plugin/auth/revoke`.

Auth: `authorize` POST needs a live Session + session-bound anti-CSRF token +
HMAC-signed request token; `token` needs the code + PKCE verifier;
`capabilities`/further commands need the resulting 15-minute opaque
`PluginSession` bearer. A replayed code revokes the session it already
minted (RFC 9700 §4.1.1).

Implements: FR-028-001
Legacy: FR-123

### API-093 — My Profile (read)
Owner: DOM-IAM
`GET /api/profile`.

Auth: live Session (self only).

Implements: FR-024-001
Legacy: FR-038

### API-094 — SoT external data-plane authentication (consumed, not exposed)
Owner: DOM-IAM
No route of its own; `resolveSotDataPlaneViewer` is a bearer-token check
(`Authorization: Bearer sdpk_...`) consumed by the FR-055-003, FR-055-004, FR-055-005 submit/export
routes owned by another domain. Minting/listing/revoking a `SotDataPlaneKey`
is an identity service (`sot-data-plane-auth.js`) with no HTTP surface in
this slice.

Implements: FR-027-001
Legacy: FR-102

## Retired (ADR-095 D1, 2026-09-24 — routes removed from the tree; schema and historical rows preserved per D3)

- `POST /api/platform/edge-devices/credentials`, `GET
  /api/platform/edge-devices/credentials`, `DELETE
  /api/platform/edge-devices/credentials/[id]` — Edge Device credential
  mint/list/revoke.
- `POST /api/edge/pairing/start`, `POST /api/edge/pairing/approve`, `GET
  /api/edge/pairing/poll` — Edge Device pairing.
- `POST /api/platform/harness-pairing/start`, `POST
  /api/platform/harness-pairing/approve`, `GET
  /api/platform/harness-pairing/poll`, `GET /api/platform/harness-devices`,
  `PATCH /api/platform/harness-devices/[id]` — agent harness pairing and
  device management.

Legacy: FR-144, FR-220, FR-222 (crosswalked as `retired` — see
`registry/crosswalk/IAM.csv`)
