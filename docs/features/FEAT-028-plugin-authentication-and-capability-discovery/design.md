---
id: SDD-028
title: "Plugin Authentication & Capability Discovery — design"
---

# SDD-028 — Plugin Authentication & Capability Discovery design

- **Components:** `CMP-048` (`plugin-auth-service.js`,
  `plugin-consent.js`, `plugin-consent-view.js`, `plugin-consent-access.js`).
- **Data owned:** `PluginInstallation`, `PluginAuthorizationCode`,
  `PluginSession`.
- **Contracts exposed:** `API-092`.
- **Contracts consumed:** none (resolves scope through identity's own
  `resolveViewer`).
- **Main sequence:** 1. Harness redirects to `GET /authorize` (renders
  consent, no DB read). 2. Person approves via POST, carrying the anti-CSRF
  and HMAC request tokens. 3. Code minted, hash-stored. 4. Harness exchanges
  code + PKCE verifier at `/token` for a 15-minute `PluginSession`. 5.
  Harness calls `/capabilities` and subsequent commands, each re-authorizing
  on its own path before mutating anything.
- **Failure modes:** GET attempting to mint → structurally impossible (no
  write path exists on GET); expired/wrong-client/wrong-redirect code →
  refused; replayed code → refused and revokes; missing/misconfigured plugin
  config in production → `503 PLUGIN_AUTH_CONFIG_MISSING`.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-028-001 | `apps/server/src/app/(entry)/plugin/authorize/page.jsx`, `apps/server/src/app/api/plugin/auth/{authorize,capabilities,revoke,token}/route.js`, `apps/server/src/modules/identity/{plugin-auth-service.js,plugin-consent.js,plugin-consent-view.js,plugin-consent-access.js}` |
