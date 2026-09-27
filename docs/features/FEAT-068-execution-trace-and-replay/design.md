---
id: SDD-068
title: "Execution trace and replay — design"
---

# SDD-068 — Execution trace and replay design

- **Components:**
  - `CMP-158` — `execution-trace.js` (`appendTraceEvent`,
    `readExecutionTrace`, `playbackTrace`, `redactTraceTurn`).
  - `CMP-166` — `line-execution-trace.js` (the
    authenticated worker's own recorder, keyed by `job.executionId`).
  - `CMP-169` — `memory-trace-contract.js`
    (`inspectMemoryWriteLink` — validates a `MEMORY_WRITTEN` event links
    back to a real, hash-matching context).
  - `CMP-170` — `model-provider.js` (records
    `MODEL_STARTED`/`MODEL_COMPLETED`/`MODEL_FAILED` around a real provider
    call).
  - Edge-side: `apps/edge/src/conversation/progress.ts` — a content-free
    local execution timeline for the (retired-by-default, ADR-095) optional
    Edge runtime.
- **Data owned:** `AgentTraceEvent` (Prisma; the domain's one owned model).
- **Contracts exposed:** `API-166` (hosted by
  `DOM-LOA`'s route file; this domain owns the read/playback contract the
  route calls — see contracts.md).
- **Contracts consumed:** `DOM-LOA`'s `LineConversationJob` (for the
  turn-open lock and `memorySyncOptIn`), `DOM-CRM`'s `Message`/reply-record
  evidence (FR-092-004, FR-092-005, FR-092-006, referenced by `OUTBOUND_RECORDED`).
- **Main sequence:** 1. Admission snapshots `memorySyncOptIn` onto the job
  (immutable). 2. Each turn phase (`TURN_RECEIVED` → context → model →
  optional memory → send) appends its own event(s), each idempotent on
  `(scope, idempotencyKey)`. 3. An owner reads
  `GET /api/line-oa/jobs/{id}/trace`, which calls `playbackTrace` over the
  stored events and returns a reconstructed, effect-free replay.
- **Failure modes:** a hash mismatch, a missing context, a failed model
  call, or a tombstone each mark the smallest affected unit (a call, an
  execution, or the whole turn) `REPLAY_INCOMPLETE` rather than silently
  omitting evidence or fabricating a result.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-068-001 | `apps/server/src/modules/agent/execution-trace.js`, `apps/server/src/modules/agent/memory-trace-contract.js`, `apps/server/src/modules/agent/line-execution-trace.js` |
| FR-068-002 | `apps/server/src/app/api/line-oa/jobs/[id]/trace/route.js`, `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`, `apps/server/src/modules/line-oa-studio/domain/line-trace-summary.js` |
| FR-068-003 | `apps/server/src/modules/agent/server-line-answer.js`, `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`, `apps/server/src/modules/line-oa-studio/application/line-memory-delivery.js`, `apps/edge/src/conversation/progress.ts` |
