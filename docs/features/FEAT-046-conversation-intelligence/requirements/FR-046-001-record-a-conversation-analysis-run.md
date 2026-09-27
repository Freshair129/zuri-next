---
id: FR-046-001
title: "Record a conversation analysis run"
delivery: building
legacy: [FR-127 (split 1/2)]
relations:
  specified_by: [SDD-046]
  decided_by: [ADR-039]
  derived_from: [BR-047, SEC-004]
---

# FR-046-001 — Record a conversation analysis run

The system SHALL persist each analysis run as a ConversationAnalysis keyed to the
internal `Conversation.id` (never an external thread id) with its own generated id,
the UTC analysis day, analysis time, `contactType` (NEW_LEAD, RETURNING, SUPPORT),
`state` (HOT, WARM, COLD, CLOSED_WON, CLOSED_LOST), optional CTA, tags, summary and the
raw model output; same-day reruns are separate rows. The writer SHALL require that the
viewer owns the exact bound Business (or any owned Business of the tenant for a
tenant-shared conversation) and that the Customer's consent is `GRANTED`, checked in
the same transaction as the insert; the audit event carries ids and classification only.

## Acceptance criteria

- AC-046-001-01 — Given a Customer with consent `PENDING`, when an analysis is recorded, then 404 `CONVERSATION_NOT_FOUND` and nothing is written.
- AC-046-001-02 — Given two runs on the same day, when both are recorded, then both rows exist with distinct ids.
- AC-046-001-03 — Given a recorded run, when its audit event is read, then it contains no summary, tags or raw output.

## Implementation

- apps/server/src/modules/crm/conversation-analysis-service.js; apps/server/src/lib/validation/enums.js; apps/server/src/modules/identity/erase-principal.js

## Verification

- TC-046-001 — Analysis write/read, consent gate, erasure and restore (see [verification.md](../verification.md))
