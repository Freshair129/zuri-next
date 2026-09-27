---
id: FR-094-005
title: "Credential writes are rate-limited"
part: FEAT-094-P02
owner: DOM-IAM
delivery: implemented
legacy: [FR-224 (split 2/2)]
relations:
  specified_by: [SDD-094]
---

# FR-094-005 — Credential writes are rate-limited

The system SHALL allow at most 5 credential writes or validations per Person and
Business in 15 minutes (a LINE-rejected validation counts twice) and at most 60 LINE
validation calls per minute per installation, answering 429 `CREDENTIAL_RATE_LIMITED`
with `retryAfterSeconds`.

## Acceptance criteria

- AC-094-005-01 — Given five writes in ten minutes, when a sixth is attempted, then 429 with a positive `retryAfterSeconds`.

## Implementation

- apps/server/src/modules/identity/credential-write-gate.js; apps/server/src/modules/identity/rate-limit.js; apps/server/src/modules/integration/application/credential-route.js

## Verification

- TC-094-002 — Step-up gate and rate limits (see [verification.md](../verification.md))
