---
id: FR-089-006
title: "LINE broadcast planning intent"
delivery: building
legacy: [FR-185]
relations:
  specified_by: [SDD-089]
  decided_by: [none]
---

# FR-089-006 — LINE broadcast planning intent

The system SHALL let Marketing persist a Business-scoped `MarketingBroadcastIntent`
(unique Business/idempotency key, current revision) and append-only, immutable
`MarketingBroadcastIntentVersion` rows whose strict payload stores only exact LINE OA
account and Marketing content references plus unavailable audience/consent planning
metadata — never a message body, recipient list or provider credential. Create,
revise and archive SHALL resolve the same owner gate, validate content/account
version and canonical hash, and write one audit event; dispatch SHALL always be
unavailable in this slice, and Paid Media / AskMarketing projections SHALL
deterministically distinguish EMPTY, PARTIAL, UNAVAILABLE and UNKNOWN without ever
calling a CRM reader or a provider.

## Acceptance criteria

- AC-089-006-01 — Given a broadcast intent payload including a recipient list or message body, when it is submitted, then it is refused — the schema does not accept those fields at all.
- AC-089-006-02 — Given an archived intent, when a new revision is attempted, then it is refused (archive is terminal).
- AC-089-006-03 — Given any request to dispatch/send, when it is attempted, then the response is explicitly unavailable, never a queued or sent state.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-broadcast-service.js`, `apps/server/src/app/api/growth/broadcast-intents/**`

## Verification

- TC-089-006 — Broadcast intent schema refusal and append-only revisions (see [verification.md](../verification.md))
