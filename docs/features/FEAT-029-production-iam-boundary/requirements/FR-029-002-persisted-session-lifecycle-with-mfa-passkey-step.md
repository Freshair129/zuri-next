---
id: FR-029-002
title: "Persisted session lifecycle with MFA/passkey step-up"
delivery: building
legacy: [FR-095]
relations:
  specified_by: [SDD-029]
  decided_by: [ADR-022, ADR-028]
---

# FR-029-002 — Persisted session lifecycle with MFA/passkey step-up

A successful login SHALL create a revocable `Session` bound to `Person` with
an opaque-token hash; every protected request SHALL check live status and
expiry. Logout, `Person` erasure, Membership suspension or explicit
revocation SHALL deny the next request. `MfaFactor.secret` SHALL be stored
only as a sealed AES-256-GCM envelope, never plaintext, and a production
deployment with no sealing key SHALL refuse MFA operations with `503` rather
than falling back.

## Acceptance criteria

- AC-029-002-01 — Given a live Session, when the bound Person is erased, then the very next request using that session is denied.
- AC-029-002-02 — Given a production deployment with no `ZURI_MFA_SECRET_KEY` configured, when an MFA operation is attempted, then it refuses `503` before any factor is read, written or deleted.
- AC-029-002-03 — Given a sealed `MfaFactor.secret` copied to a different factor row, when it is opened there, then authentication of the envelope fails (AAD binds table, key version, Person and factor id).

## Implementation

- `apps/server/src/app/api/auth/{mfa/**,webauthn/**,step-up}/route.js`, `apps/server/src/modules/identity/{session-assurance.js,mfa-service.js,totp.js,webauthn.js,webauthn-cbor.js,webauthn-challenge.js,passkey-service.js,mfa-secret-seal.js,mfa-secret-reseal.js}`, `apps/server/src/modules/identity/ui/MfaSecurityCard.jsx`

## Verification

- TC-029-002 — Session lifecycle, MFA and passkey step-up (see [verification.md](../verification.md))
