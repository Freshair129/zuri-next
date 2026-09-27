---
id: FR-094-009
title: "A publisher registers and tests the webhook through LINE"
part: FEAT-094-P05
owner: DOM-LOA
delivery: implemented
legacy: [FR-227]
relations:
  specified_by: [SDD-094, API-121]
  depends_on: [API-141]
---

# FR-094-009 — A publisher registers and tests the webhook through LINE

The system SHALL provide the account action `REGISTER_WEBHOOK` that sets the account's
LINE webhook endpoint to this server's account URL (derived from the public base URL),
reads it back with its active flag, runs LINE's webhook test and stores endpoint, active
flag, last test time, reason and HTTP status in `webhookStateJson`; it is idempotent,
retryable without re-entering the secret, refused on an ARCHIVED account (409) and when
the public base URL is not configured (503 `PUBLIC_BASE_URL_NOT_CONFIGURED`). When LINE
refuses the URL, the toggle is off or the test fails, the account shows the Thai reason
and a manual card with the URL to paste; a test whose signature does not verify is
reported as a stored secret that does not belong to the channel and routes to rotation.

## Acceptance criteria

- AC-094-009-01 — Given LINE reports "Use webhook" off, when registration runs, then the stored state is inactive and the manual card is shown.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js; apps/server/src/modules/line-oa-studio/domain/line-oa-webhook-copy.js; apps/server/src/modules/line-oa-studio/ui/LineOaReadinessJourney.jsx; apps/server/src/lib/public-base-url.js

## Verification

- TC-094-005 — Webhook registration and derived quiescence (see [verification.md](../verification.md))
