---
id: FR-093-005
title: "LINE is acknowledged only after a restart-recoverable capture"
part: FEAT-093-P03
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 3/10)]
relations:
  specified_by: [SDD-093, API-132]
  decided_by: [ADR-045]
---

# FR-093-005 — LINE is acknowledged only after a restart-recoverable capture

The system SHALL, on `POST /api/line-oa/accounts/{id}/webhook`, resolve an account that
is server-enabled and CLOUD, read the body (≤ 1 MiB, else 413), verify
`x-line-signature` against that account (empty verification requests included), record
evidence for each event, mark every captured row `ADMITTING`, and only then answer 2xx;
admission continues after the response, not awaited. If an event cannot be captured the
route SHALL answer non-2xx so LINE redelivers; one bad event does not discard its
neighbours.

## Acceptance criteria

- AC-093-005-01 — Given a request with an invalid signature, when received, then it is refused and nothing is recorded.
- AC-093-005-02 — Given capture succeeded and the process dies before admission, when the reconciler runs, then the event is admitted exactly once.

## Implementation

- apps/server/src/app/api/line-oa/accounts/[id]/webhook/route.js

## Verification

- TC-093-003 — Webhook ingress and after-ack admission (see [verification.md](../verification.md))
