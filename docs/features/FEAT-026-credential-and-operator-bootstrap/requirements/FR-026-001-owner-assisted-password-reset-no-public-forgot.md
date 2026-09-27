---
id: FR-026-001
title: "Owner-assisted password reset, no public forgot-password route"
delivery: live
legacy: [FR-104]
relations:
  specified_by: [SDD-026]
---

# FR-026-001 — Owner-assisted password reset, no public forgot-password route

A Business owner over a Business the target Person belongs to, or the
installation operator, SHALL be able to mint a single-use, one-hour,
hash-bound reset token (`POST /api/platform/users/password-resets`); the
public `POST /api/auth/reset-password` SHALL consume it, creating a new
`PersonCredential`, burning the token and revoking **every** active Session
for that Person. The raw token SHALL appear exactly once, in the
authenticated mint response, for out-of-band handover; it SHALL be stored
only as a SHA-256 digest and never logged. There SHALL be no public
forgot-password route.

## Acceptance criteria

- AC-026-001-01 — Given a minted reset token, when it is redeemed at `/api/auth/reset-password`, then a new credential is set and every prior Session for that Person is revoked.
- AC-026-001-02 — Given a redeemed or expired token presented again, when reset is attempted, then it is refused.
- AC-026-001-03 — Given an unauthenticated visitor, when they look for a self-service "forgot password" route, then none exists.

## Implementation

- `apps/server/src/app/api/auth/reset-password/route.js`, `apps/server/src/app/api/platform/users/password-resets/route.js`, `apps/server/src/app/reset-password/page.jsx`, `apps/server/src/modules/identity/{auth-service.js,password-reset-copy.js}`

## Verification

- TC-026-001 — Password reset mint, redeem, session revocation (see [verification.md](../verification.md))
