---
id: FR-093-006
title: "Admission writes the CRM message and one job atomically"
part: FEAT-093-P03
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 4/10)]
relations:
  specified_by: [SDD-093, API-131]
  depends_on: [API-116]
---

# FR-093-006 — Admission writes the CRM message and one job atomically

The system SHALL, inside one transaction that re-checks the account is still the
server owner for the captured `transportEpoch` (409 `LINE_ACCOUNT_NOT_SERVER_OWNED`
otherwise), ingest the inbound text (≤ 10 000 chars) into CRM and, when the event warrants
an answer (a direct 1:1 message, or a group/room message addressing the assistant by
name), create one `LineConversationJob` unique per `(account, eventId)` and per inbound
message, sealing the reply token encrypted per account with its reply deadline anchored
to LINE's event time. Admission retries transient failures after 4 s and 12 s, marks
deterministic failures (400/403/404/409/413) `SKIPPED` without retry, and wakes the
worker when it queues a job.

## Acceptance criteria

- AC-093-006-01 — Given the same LINE event admitted twice, when both finish, then one Message and one job exist.
- AC-093-006-02 — Given a group message not addressing the assistant, when admitted, then the Message is recorded and no job is created.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js; line-admission-reconciler.js

## Verification

- TC-093-003 — Webhook ingress and after-ack admission (see [verification.md](../verification.md))
