---
id: FR-025-003
title: "Self-serve signup is the one door into the product"
delivery: live
legacy: [FR-120]
relations:
  specified_by: [SDD-025]
  decided_by: [ADR-020]
---

# FR-025-003 — Self-serve signup is the one door into the product

An unauthenticated visitor SHALL be able to create their own `Person` and
`PersonCredential` at a public `/signup` (`POST /api/auth/signup`) and
continue into the Profile-first onboarding at its `PROFILE` step. Signup
SHALL confer no authority: it SHALL create no `PlatformGrant`, Tenant,
Business, Space, Project or `WorkspaceMembership`. Signup SHALL NOT overwrite
an existing `PersonCredential`.

## Acceptance criteria

- AC-025-003-01 — Given a fresh visitor completing `/signup`, when the account is created, then the resulting Person holds zero Memberships, RoleBindings and PlatformGrants.
- AC-025-003-02 — Given an email that already has a `PersonCredential`, when signup is attempted again with that email, then it is refused (409) and the existing credential is untouched.

## Implementation

- `apps/server/src/app/api/auth/signup/route.js`, `apps/server/src/modules/identity/{signup-service.js,signup-copy.js,signup-rate-limit.js}`

## Verification

- TC-025-003 — Self-serve signup grants nothing and refuses duplicates (see [verification.md](../verification.md))
