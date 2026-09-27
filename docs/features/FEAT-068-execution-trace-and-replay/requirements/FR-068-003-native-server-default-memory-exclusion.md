---
id: FR-068-003
title: "Native SERVER default memory exclusion"
delivery: implemented
legacy: [FR-171 (split 3 of 3 — native SERVER memory-adapter default)]
relations:
  specified_by: [none]
  decided_by: [ADR-061]
---

# FR-068-003 — Native SERVER default memory exclusion

The system SHALL default every native SERVER LINE job to carrying **no**
private-memory adapter — an empty memory reference set with disposition
`EXCLUDED_BY_POLICY` — and SHALL compose the trusted MSP thread adapter
only for a job whose `memorySyncOptIn` was set immutably at admission time
from server configuration (never from a client, model, or later request),
never retroactively for an already-admitted job.

## Acceptance criteria

- AC-068-003-01 — Given a job admitted with `ZURI_MSP_THREAD_MEMORY_ENABLED` unset (the default), when the job is answered, then its trace carries empty memory references and `EXCLUDED_BY_POLICY`, and `createServerLineAnswer` never calls `selectedThreadMemory.appendMessage`.
- AC-068-003-02 — Given a job admitted with the flag set (`memorySyncOptIn: true` recorded on the `LineConversationJob` row at admission), when a later request tries to disable memory for that same job, then the job's own immutable `memorySyncOptIn` is unaffected — opt-in is a per-job, admission-time decision, not a per-request one.

## Implementation

- `apps/server/src/modules/agent/server-line-answer.js`, `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`, `apps/server/src/modules/line-oa-studio/application/line-memory-delivery.js`, `apps/edge/src/conversation/progress.ts`
