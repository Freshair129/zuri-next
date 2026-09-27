---
id: FR-051-002
title: "A conversation job carries its session id for filtering and trace"
delivery: building
legacy: [FR-243 (LOA half, split 2/2)]
relations:
  specified_by: [API-122]
  decided_by: [ADR-044]
---

# FR-051-002 — A conversation job carries its session id for filtering and trace

The system SHALL copy the conversation session id onto `LineConversationJob`
at admission and SHALL let the account's job list be filtered by session code
(`?session=S-YYYYMMDD-XXXXXX`).

## Acceptance criteria

- AC-051-002-01 — Given an inbound message admitted into session S, when its job is created, then `LineConversationJob.sessionId` equals S's id.
- AC-051-002-02 — Given a `GET` on the account's jobs with `?session=S-…`, when executed, then only jobs of that session are returned.

## Implementation

- `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`, `apps/server/src/app/api/line-oa/accounts/[id]/jobs/route.js`

## Verification

- TC-051-002 — Job session-id copy and session filter (see [verification.md](../verification.md))
