---
id: FR-094-004
title: "Every credential write requires AAL2"
part: FEAT-094-P02
owner: DOM-IAM
delivery: implemented
legacy: [FR-224 (split 1/2)]
relations:
  specified_by: [SDD-094]
  decided_by: [ADR-046, ADR-047]
---

# FR-094-004 — Every credential write requires AAL2

The system SHALL require, for every credential write, rotation, revocation and live
validation, a logged-in Person (401 `AUTH_REQUIRED`) with an ACTIVE TOTP factor (403
`MFA_FACTOR_REQUIRED` with the enrolment path) and a session stepped up to AAL2 (403
`ASSURANCE_LEVEL_INSUFFICIENT` with the step-up path). An operator MAY suspend only the
step-up for an installation by setting `ZURI_CREDENTIAL_STEP_UP=off`; while suspended
the 401 and the rate limits still apply and every passing write is audited
`CREDENTIAL_STEP_UP_SUSPENDED` with the action and the setting, never a credential.

## Acceptance criteria

- AC-094-004-01 — Given a password-only session, when a credential is written, then 403 `ASSURANCE_LEVEL_INSUFFICIENT` and nothing is stored.
- AC-094-004-02 — Given `ZURI_CREDENTIAL_STEP_UP=off`, when a write passes, then an audit event `CREDENTIAL_STEP_UP_SUSPENDED` is recorded.

## Implementation

- apps/server/src/modules/identity/credential-write-gate.js; apps/server/src/modules/identity/rate-limit.js; apps/server/src/modules/integration/application/credential-route.js

## Verification

- TC-094-002 — Step-up gate and rate limits (see [verification.md](../verification.md))
