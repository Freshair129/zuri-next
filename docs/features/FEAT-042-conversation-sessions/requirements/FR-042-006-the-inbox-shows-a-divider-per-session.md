---
id: FR-042-006
title: "The inbox shows a divider per session"
delivery: implemented
legacy: [FR-243 (split 6/6)]
relations:
  specified_by: [SDD-042, API-108]
---

# FR-042-006 — The inbox shows a divider per session

The system SHALL return, for each message of a thread, its session id, session code
and session open time, and the inbox SHALL draw a divider naming the session code and
open time wherever the session changes between consecutive messages; a message
without a session draws no divider.

## Acceptance criteria

- AC-042-006-01 — Given a thread spanning two sessions, when opened in the inbox, then exactly one divider labelled with the second session's code appears between them.

## Implementation

- apps/server/src/modules/crm/conversation-read-model.js; apps/server/src/app/(pm)/customer/conversations/page.jsx

## Verification

- TC-042-003 — Session surfaces in thread and inbox (see [verification.md](../verification.md))
