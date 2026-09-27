---
id: SDD-029
title: "Production IAM Boundary — design"
---

# SDD-029 — Production IAM Boundary design

- **Components:** `CMP-036`
  (`resolve-line-identity.js`, `link-line-identity.js`,
  `channel-identity.js`, `classify-principal.js`) — external binding
  resolution; `CMP-052` (`auth-service.js`,
  `session-assurance.js`, `session-port.js`, `sign-out.js`, `mfa-service.js`,
  `totp.js`, `webauthn.js`, `webauthn-cbor.js`, `webauthn-challenge.js`,
  `passkey-service.js`, `mfa-secret-seal.js`, `mfa-secret-reseal.js`) —
  session + step-up; `CMP-049`
  (`authorization-context.js`, `agent-tool-authorizer.js`) — the shared seam.
- **Data owned:** `Person`, `ExternalIdentity`, `ChannelIdentity`,
  `IdentityLinkToken`, `Session`, `MfaFactor`, `PasskeyCredential`.
- **Contracts exposed:** `API-089`, `API-095`; the LINE erasure
  trigger `POST /api/crm/customers/[customerId]/erasure` (consumed by
  `DOM-CRM`'s Customer Inbox, exposed here because erasure is an identity
  act).
- **Contracts consumed:** none.
- **Main sequence:** 1. A provider/channel subject arrives. 2. It resolves
  through a namespaced binding to one `Person` (or is refused). 3. On login,
  a `Session` row is created; the signed cookie is transport only. 4. Every
  protected request revalidates the live row and, where required, checks a
  live step-up window. 5. Agent/tool/action code paths call the same
  `resolveAuthorizationContext`/`authorizeScope` seam before doing protected
  work.
- **Failure modes:** unknown/ambiguous subject → no Person, no authority;
  expired/revoked Session → denied next request; missing MFA key in
  production → 503 before any read/write; a tool argument attempting to
  widen scope → ignored, resolved scope governs.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-029-001 | `apps/server/src/modules/identity/{resolve-line-identity.js,link-line-identity.js,channel-identity.js,classify-principal.js}` |
| FR-029-002 | `apps/server/src/app/api/auth/{mfa/**,webauthn/**,step-up}/route.js`, `apps/server/src/modules/identity/{session-assurance.js,mfa-service.js,totp.js,webauthn.js,webauthn-cbor.js,webauthn-challenge.js,passkey-service.js,mfa-secret-seal.js,mfa-secret-reseal.js}`, `apps/server/src/modules/identity/ui/MfaSecurityCard.jsx` |
| FR-029-003 | `apps/server/src/modules/identity/{authorization-context.js,agent-tool-authorizer.js,session-port.js}` |
| FR-029-004 | `apps/server/src/modules/identity/resolve-line-identity.js` |
| FR-029-005 | `apps/server/src/modules/identity/{link-line-identity.js,classify-principal.js,erase-customer-principal.js}`, `apps/server/src/app/api/crm/customers/[customerId]/erasure/route.js` |
