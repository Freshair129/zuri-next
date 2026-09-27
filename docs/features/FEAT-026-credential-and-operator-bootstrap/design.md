---
id: SDD-026
title: "Credential & Operator Bootstrap — design"
---

# SDD-026 — Credential & Operator Bootstrap design

- **Components:** `CMP-047` (`auth-service.js`,
  `password-reset-copy.js`) — mint/redeem; `CMP-045`
  (`operator-bootstrap.js`, `operator-use.js`) — grant store, bootstrap,
  issuance, use-recording.
- **Data owned:** `PasswordResetToken`, `PlatformGrant`.
- **Contracts exposed:** `API-091` (password-resets sub-path).
- **Contracts consumed:** none.
- **Main sequence (reset):** 1. Owner/operator mints a token for a target
  Person. 2. Token handed over out of band (LINE, in person). 3. Person
  redeems at `/api/auth/reset-password`. 4. New credential set; token burnt;
  every Session for that Person revoked.
- **Main sequence (operator):** 1. `bootstrap-operator.mjs` runs once,
  creating the first ACTIVE grant. 2. A standing operator later runs
  `issueOperatorGrant` for a new Person, superseding any prior grant of
  theirs. 3. Every request's session port re-reads the store fresh.
- **Failure modes:** redeeming an expired/consumed token → refused; a second
  bootstrap attempt → refused; revoking the last ACTIVE operator grant
  without an override → refused.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-026-001 | `apps/server/src/app/api/auth/reset-password/route.js`, `apps/server/src/app/api/platform/users/password-resets/route.js`, `apps/server/src/app/reset-password/page.jsx`, `apps/server/src/modules/identity/{auth-service.js,password-reset-copy.js}` |
| FR-026-002 | `apps/server/src/modules/identity/{operator-bootstrap.js,operator-use.js,session-port.js}` |
