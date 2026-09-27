---
id: FR-048-003
title: "Transport mode admits CLOUD only"
delivery: implemented
legacy: [FR-146 (split 3/4)]
relations:
  specified_by: [API-123, API-121]
  decided_by: [ADR-047]
---

# FR-048-003 — Transport mode admits CLOUD only

The system SHALL accept only `CLOUD` for a `LineOaAccount`'s `transportMode`
and SHALL NOT expose an action that switches it, `EDGE` having been retired
(`ADR-047`).

## Acceptance criteria

- AC-048-003-01 — Given a POST to create an account with `transportMode: 'EDGE'`, when validated, then the request is rejected by schema (`LINE_OA_TRANSPORT_MODES` admits `CLOUD` only).
- AC-048-003-02 — Given `LINE_OA_ACCOUNT_ACTIONS`, when enumerated, then `SWITCH_TRANSPORT_MODE` is absent.

## Implementation

- `apps/server/src/lib/validation/enums.js` (`LINE_OA_TRANSPORT_MODES`, `LINE_OA_ACCOUNT_ACTIONS`)

## Verification

- TC-048-003 — Transport mode and action vocabulary (see [verification.md](../verification.md))
