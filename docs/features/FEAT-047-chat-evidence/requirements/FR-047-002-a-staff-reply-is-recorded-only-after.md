---
id: FR-047-002
title: "A staff reply is recorded only after LINE accepts it"
delivery: building
legacy: [FR-246 (split 2/2)]
relations:
  specified_by: [SDD-047, API-109]
  depends_on: [API-136]
  derived_from: [BR-056]
---

# FR-047-002 — A staff reply is recorded only after LINE accepts it

The system SHALL deliver the reply as a LINE push (never the Reply API; no reply token
is consumed) through the LINE OA server ports, SHALL record an `OUTBOUND` Message with
external id `staff:<clientRequestId>` in the session of the conversation's latest
message and one `STAFF_REPLY_DELIVERED` audit event naming the actor and reply source
`STAFF` — only when the provider accepted the push (else 502
`STAFF_REPLY_NOT_ACCEPTED_BY_LINE`, nothing recorded). A repeated `clientRequestId`
returns the existing message with `created: false`. The inbox SHALL state that replies
typed in LINE Official Account Manager are not recorded.

## Acceptance criteria

- AC-047-002-01 — Given LINE rejects the push, when sending, then 502 and no Message exists.
- AC-047-002-02 — Given the same `clientRequestId` submitted twice, when both complete, then one Message exists.

## Implementation

- apps/server/src/modules/crm/reply-record-service.js; apps/server/src/app/api/crm/conversations/[id]/reply/route.js; apps/server/src/app/(pm)/customer/conversations/page.jsx

## Verification

- TC-047-001 — Staff reply authority, send and record (see [verification.md](../verification.md))
