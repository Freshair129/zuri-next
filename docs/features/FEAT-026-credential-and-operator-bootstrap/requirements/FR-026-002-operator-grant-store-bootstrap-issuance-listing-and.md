---
id: FR-026-002
title: "Operator grant store, bootstrap, issuance, listing and revocation"
delivery: live
legacy: [FR-107]
relations:
  specified_by: [SDD-026]
---

# FR-026-002 — Operator grant store, bootstrap, issuance, listing and revocation

The `isOperator` capability SHALL be holdable in production through a
server-held `PlatformGrant` row (Person-bound, capability `OPERATOR`,
revocable, audited); the session port SHALL resolve `platformGrant` from it
on every request, so revoking a grant denies the very next request.
`scripts/bootstrap-operator.mjs` SHALL create the installation's first
operator (Person + credential + ACTIVE grant, one transaction, audited with
no password material) and SHALL refuse while any ACTIVE OPERATOR grant
stands. Where the store is absent, resolution SHALL read `false`, never a
widened default. Further grants SHALL be issued by a standing operator
(`issueOperatorGrant`: mandatory reason, `expiresAt` capped at 90 days,
superseding any prior ACTIVE grant for that Person/capability in the same
transaction) and SHALL be revocable (refusing to revoke the last ACTIVE grant
without an explicit override) and listable.

## Acceptance criteria

- AC-026-002-01 — Given no ACTIVE OPERATOR grant exists, when bootstrap runs, then exactly one Person gets an ACTIVE grant and a credential shown once.
- AC-026-002-02 — Given an ACTIVE OPERATOR grant already exists, when bootstrap is run again, then it refuses.
- AC-026-002-03 — Given a revoked grant, when the next request from that session arrives, then `isOperator` resolves false — no stale session outlives the revocation.

## Implementation

- `apps/server/src/modules/identity/{operator-bootstrap.js,operator-use.js,session-port.js}`

## Verification

- TC-026-002 — Operator bootstrap refuses a second attempt (see [verification.md](../verification.md))
- TC-026-003 — Issue/list/revoke operator grants (see [verification.md](../verification.md))
