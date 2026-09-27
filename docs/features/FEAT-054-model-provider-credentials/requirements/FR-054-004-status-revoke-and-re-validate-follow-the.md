---
id: FR-054-004
title: "Status, revoke and re-validate follow the vault lifecycle"
delivery: implemented
legacy: [FR-266 (split, INT half 2/3)]
relations:
  specified_by: [SDD-054, API-152, API-153]
---

# FR-054-004 — Status, revoke and re-validate follow the vault lifecycle

The system SHALL answer `GET /api/integration/model-providers?businessId=` with the
connection id, provider, model, credential status, store, last validation time and
outcome code and version — never key material — plus the provider catalogue; SHALL
revoke on `POST …/{id}/revoke` with `{reason, confirmation: "REVOKE"}`; and SHALL
re-validate on `POST …/{id}/validate`, refusing 409 `CREDENTIAL_REENTRY_REQUIRED` for
a credential that must be re-entered. Both writes pass the credential-write gate and
are audited; every credential route caps bodies at 16 KiB (413) and answers
`Cache-Control: no-store`.

## Acceptance criteria

- AC-054-004-01 — Given a revoke without the literal confirmation, when posted, then 400.
- AC-054-004-02 — Given a re-validation the provider refuses, when read back, then `lastValidationCode` shows the refusal, not a ready state.

## Implementation

- apps/server/src/modules/integration/application/model-provider-credential-service.js; apps/server/src/modules/integration/application/credential-route.js; apps/server/src/app/api/integration/model-providers/**

## Verification

- TC-054-002 — Model key provisioning, rotate, revoke, validate (see [verification.md](../verification.md))
