---
id: SDD-050
title: "Server-executed answers on Business API keys — design"
---

# SDD-050 — Server-executed answers on Business API keys design

- **Components:** `CMP-111` (`line-oa-readiness-journey.js`,
  pure — composes account health, webhook health and model-credential status
  into one resumable journey) · `CMP-110` (`LineOaModelKeyCard.jsx`)
  · `CMP-103` (`conversation-runtime-core.js`, the
  authenticated boundary described in `ADR-049`).
- **Data owned:** `LineOaAccount.transportMode/executionMode/runtimeOwner/
  modelAccess` (columns; `modelAccess` retained as a column but its
  `LOCAL_ONLY` branch is unreachable from production); `LineConversationJob.
  runtimeOwner`.
- **Contracts exposed:** `API-124`,
  `EVT-002`.
- **Contracts consumed:** `API-151` (read status
  only); the agent lane's server answer adapter (`FR-067-001`).
- **Main sequence (SERVER cohort):** 1. worker tick claims a due job. 2.
  `resolveModel` reads the Business's `MODEL_PROVIDER` connection, falling
  back to the Phase-1 resolver only on absence. 3. a broken credential fails
  closed (never silently falls back). 4. the model answers; the reply is
  persisted before send.
  **Main sequence (Conversation Runtime cohort):** 1. the extracted service
  claims through `conversation-runtime.v1`. 2. it resolves authority and a
  claim-bound, short-lived model credential grant. 3. it invokes the model and
  reports completion back through the same versioned port.
- **Failure modes:** no credential and no fallback → closed failure, distinct
  error code; ambiguous provider timeout → job stays open for retry within
  lease; a claim whose account/consent authority has changed mid-flight is
  revalidated and refused.

## Implementation map

| Requirement | Current code |
|---|---|
| FR-050-001 | `apps/server/src/lib/validation/enums.js`, `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js` |
| FR-050-002 | `apps/server/src/modules/agent/server-line-answer.js` |
| FR-050-003 | `apps/server/src/modules/line-oa-studio/domain/line-oa-readiness-journey.js`, `apps/server/src/modules/line-oa-studio/ui/LineOaModelKeyCard.jsx`, `apps/server/src/modules/line-oa-studio/ui/credential-input-props.js` |
| FR-050-004 | `apps/server/src/modules/line-oa-studio/application/conversation-runtime-core.js`, `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js` |
