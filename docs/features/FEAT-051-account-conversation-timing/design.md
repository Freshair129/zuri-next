---
id: SDD-051
title: "Account conversation timing — design"
---

# SDD-051 — Account conversation timing design

- **Components:** `CMP-098` (`line-oa-account.js` — time-of-day
  and range validation) · `CMP-102` (`line-conversation-jobs.js`
  — the admission-time out-of-hours short-circuit).
- **Data owned:** `LineOaAccount.sessionIdleTimeoutMinutes/businessHoursOpen/
  businessHoursClose/outOfHoursReplyText`; `LineConversationJob.sessionId`.
- **Contracts exposed:** carried on `API-121` (configuration) and
  `API-122` (session filter); the admission short-circuit is
  internal to `API-131`.
- **Contracts consumed:** `API-111` (CRM decides
  which session a message joins; this domain only reads the timeout it
  applies and stores the resulting session id as a reference).
- **Main sequence:** 1. publisher configures timeout and/or hours
  (versioned CAS). 2. inbound message admitted: CRM assigns/opens a session
  using this account's timeout. 3. admission checks
  `isAccountWithinBusinessHours`; if outside hours and a reply is configured,
  the job is created `READY` with the fixed text and an `OUT_OF_HOURS_RULE`
  trace entry, skipping model execution entirely.
- **Failure modes:** a declared-but-incomplete hours set (missing one of the
  three fields) is refused at the action boundary, never partially stored.

## Implementation map

| Requirement | Current code |
|---|---|
| FR-051-001 | `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`, `apps/server/prisma/schema.prisma` (`sessionIdleTimeoutMinutes`) |
| FR-051-002 | `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`, `apps/server/src/app/api/line-oa/accounts/[id]/jobs/route.js` |
| FR-051-003 | `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js` (lines implementing `isAccountWithinBusinessHours` short-circuit), `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js` |
