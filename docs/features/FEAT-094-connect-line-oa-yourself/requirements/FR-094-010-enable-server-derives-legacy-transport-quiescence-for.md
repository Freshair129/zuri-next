---
id: FR-094-010
title: "ENABLE_SERVER derives legacy-transport quiescence for vault-backed accounts"
part: FEAT-094-P05
owner: DOM-LOA
delivery: implemented
legacy: [FR-228]
relations:
  specified_by: [SDD-094, API-121]
  decided_by: [ADR-045, ADR-046]
---

# FR-094-010 — ENABLE_SERVER derives legacy-transport quiescence for vault-backed accounts

The system SHALL, on `ENABLE_SERVER` for an account whose credential is in a writable
store, treat the old transport as quiet only when LINE's reported webhook endpoint is
active and equals this server's account URL, no evidence arrived for the connection in
the 120 s before the registration test, and 120 s have passed since it — else refuse 409
`LINE_LEGACY_TRANSPORT_ACTIVE` with the last legacy receipt time; a mount-backed account
SHALL still require the typed confirmation (409 `LINE_OA_LEGACY_CONFIRMATION_REQUIRED`).
Credentials are validated through the dispatching secret manager; the epoch fence,
version check and refusal while jobs are SENDING/UNKNOWN are unchanged.

## Acceptance criteria

- AC-094-010-01 — Given a vault-backed account registered 60 s ago, when ENABLE_SERVER is requested, then 409 `LINE_LEGACY_TRANSPORT_ACTIVE`.
- AC-094-010-02 — Given a mount-backed account without `legacyQuiesced: true`, when enabling, then 409 `LINE_OA_LEGACY_CONFIRMATION_REQUIRED`.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js; apps/server/src/modules/line-oa-studio/domain/line-oa-webhook-copy.js; apps/server/src/modules/line-oa-studio/ui/LineOaReadinessJourney.jsx; apps/server/src/lib/public-base-url.js

## Verification

- TC-094-005 — Webhook registration and derived quiescence (see [verification.md](../verification.md))
