---
id: FR-094-003
title: "Revocation and restore fence the account"
part: FEAT-094-P01
owner: DOM-INT
delivery: implemented
legacy: [FR-223 (split 3/3)]
relations:
  specified_by: [SDD-094, API-144]
---

# FR-094-003 — Revocation and restore fence the account

The system SHALL, on revoke, mark the credential `REVOKED`, purge the stored material,
invalidate the runtime cache and fence the account it serves; after a snapshot restore
every credential SHALL be `REENTRY_REQUIRED` and refuse validation (409
`CREDENTIAL_REENTRY_REQUIRED`) until re-entered.

## Acceptance criteria

- AC-094-003-01 — Given a revoked credential, when the worker next resolves the account, then resolution fails and nothing is sent.

## Verification

- TC-094-001 — Vault stores and lifecycle (see [verification.md](../verification.md))
- TC-094-005 — Webhook registration and derived quiescence (see [verification.md](../verification.md))
