---
id: FR-095-003
title: "The server admission seam stops skipping non-text events"
part: FEAT-095-P02
owner: DOM-LOA
delivery: building
legacy: [FR-229 (split 3/3)]
relations:
  specified_by: [SDD-095, API-131]
  depends_on: [API-106]
---

# FR-095-003 — The server admission seam stops skipping non-text events

The system SHALL route, in the LINE admission transaction, non-text message types and
the listed event types to the CRM writers above, and SHALL create no LineConversationJob
for any of them.

## Acceptance criteria

- AC-095-003-01 — Given a sticker message on a server-enabled account, when admitted, then a Message exists and no job was created.

## Implementation

- apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js

## Verification

- TC-095-001 — Non-text admission and events (see [verification.md](../verification.md))
- TC-095-004 — Context Composer and receipts (see [verification.md](../verification.md))
