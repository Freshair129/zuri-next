---
id: FR-094-008
title: "The Thai wizard connects and creates a DRAFT account"
part: FEAT-094-P04
owner: DOM-LOA
delivery: implemented
legacy: [FR-225 (split 2/2)]
relations:
  specified_by: [SDD-094, API-123]
  depends_on: [API-142, API-143]
---

# FR-094-008 — The Thai wizard connects and creates a DRAFT account

The system SHALL offer a Thai connect wizard in the LINE OA Studio that performs the
step-up (with inline TOTP enrolment when needed), collects Channel ID, Channel secret and
the optional token override with inputs that disable autofill/persistence, posts to the
connection route and on success creates a DRAFT `LineOaAccount` through
`POST /api/line-oa/accounts`; the form no longer accepts a `deployment-secret:` reference,
and an account backed by the deployment mount moves into the vault when its owner
re-enters the secret through the rotate route.

## Acceptance criteria

- AC-094-008-01 — Given a successful connection, when the wizard completes, then a DRAFT account bound to the new `LINE_OA` connection exists.
- AC-094-008-02 — Given each refusal code, when shown, then the wizard displays its Thai explanation from the error table.

## Implementation

- apps/server/src/modules/line-oa-studio/ui/LineOaConnectWizard.jsx; apps/server/src/modules/line-oa-studio/domain/line-oa-connect-wizard-copy.js; apps/server/src/modules/line-oa-studio/ui/LineOaCredentialMigrationCard.jsx; apps/server/src/app/api/line-oa/accounts/route.js

## Verification

- TC-094-004 — Self-serve onboarding and wizard (see [verification.md](../verification.md))
