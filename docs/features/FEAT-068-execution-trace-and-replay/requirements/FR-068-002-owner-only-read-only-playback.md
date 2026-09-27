---
id: FR-068-002
title: "Owner-only read-only playback"
delivery: implemented
legacy: [FR-171 (split 2 of 3 — read-only playback route)]
relations:
  specified_by: [none]
  decided_by: [ADR-061]
---

# FR-068-002 — Owner-only read-only playback

The system SHALL reconstruct, from the stored events alone and without
invoking any executor, tool handler, provider or callback, a per-execution
replay status (`REPLAY_COMPLETE` | `REPLAY_INCOMPLETE`) that withholds a
model call's output whenever its context is missing, its request-hash does
not match its recorded snapshot, the call failed, or the turn carries a
retention tombstone. The system SHALL expose this reconstruction only
through an authenticated, owner-only, `line-oa`-scoped read route
(`GET /api/line-oa/jobs/{id}/trace`) that derives its scope from the job
itself and requires Business ownership before returning anything.

## Acceptance criteria

- AC-068-002-01 — Given a `MODEL_COMPLETED` event whose linked `CONTEXT_COMMITTED` payload's `requestHash` does not match the SHA-256 of its own `requestBody`, when `playbackTrace` runs, then that call's status is `REPLAY_INCOMPLETE` with reason `CONTEXT_HASH_MISMATCH`, and its `output` is withheld (`null`) even though the row itself still exists.
- AC-068-002-02 — Given a turn carrying a `RETENTION_TOMBSTONE` event, when the trace is read, then every execution's status is `REPLAY_INCOMPLETE` and no memory write or delivery evidence is reconstructed, regardless of what the (redacted) underlying rows contain.
- AC-068-002-03 — Given a request from a viewer who does not own the job's Business, when `GET /api/line-oa/jobs/{id}/trace` is called, then the route returns the same class of refusal (401/403/404) the `resolveRequestViewer`/ownership check produces, never a 503 that leaks whether the job exists.

## Implementation

- `apps/server/src/app/api/line-oa/jobs/[id]/trace/route.js`, `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`, `apps/server/src/modules/line-oa-studio/domain/line-trace-summary.js`
