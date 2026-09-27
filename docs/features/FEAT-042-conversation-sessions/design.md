---
id: SDD-042
title: "Conversation sessions — design"
---

# SDD-042 — Conversation sessions design

- **Components:** CMP-088 — `conversation-session-service.js` (`assignMessageSession`, `joinReplySession`, `openSessionIdAt`, pure `continuesSession`/`closedAtFor`/`sessionCode`); CMP-096 — `conversation-session-backfill.js` + `scripts/backfill-conversation-sessions.mjs`.
- **Data owned:** ConversationSession; `Message.sessionId`, `ConversationEvent.sessionId`. `LineConversationJob.sessionId` is DOM-LOA's column, written by the backfill through the job row only during backfill (see §9).
- **Contracts exposed:** API-111 (in-process); session fields on API-108.
- **Contracts consumed:** account idle timeout from FEAT-051 (passed by the admission caller as `sessionIdleTimeoutMinutes`).
- **Main sequence:** ingest/reply writer → lock Conversation row (touch `updatedAt`) → read latest session → continue or close+open → write message with `sessionId`.
- **Failure modes:** a timeout out of range falls back to 30; a session of another conversation passed to `joinReplySession` is ignored (reply recorded without session).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-042-001..004 | apps/server/src/modules/crm/conversation-session-service.js; apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/reply-record-service.js |
| FR-042-005 | apps/server/src/modules/crm/conversation-session-backfill.js; apps/server/scripts/backfill-conversation-sessions.mjs |
| FR-042-006 | apps/server/src/modules/crm/conversation-read-model.js; apps/server/src/app/(pm)/customer/conversations/page.jsx |
