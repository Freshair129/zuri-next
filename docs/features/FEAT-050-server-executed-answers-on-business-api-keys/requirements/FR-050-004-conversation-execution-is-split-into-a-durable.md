---
id: FR-050-004
title: "Conversation execution is split into a durable SERVER cohort and an opt-in Conversation Runtime cohort"
delivery: building
legacy: [FR-265 (runtime-cohort context, not a legacy PRD row — declared by ADR-049)]
relations:
  specified_by: [API-124]
  decided_by: [ADR-049]
---

# FR-050-004 — Conversation execution is split into a durable SERVER cohort and an opt-in Conversation Runtime cohort

The system SHALL snapshot a job's durable executor cohort
(`runtimeOwner`: `SERVER` | `CONVERSATION_RUNTIME`) from the account's
configured `runtimeOwner` at admission time, SHALL require every outstanding
job to be quiescent before an owner changes an account's cohort, and SHALL
have each cohort claim, revalidate and complete jobs only through its own
authenticated boundary.

## Acceptance criteria

- AC-050-004-01 — Given an account configured `runtimeOwner: 'CONVERSATION_RUNTIME'`, when a new conversation job is admitted, then the job's `runtimeOwner` is snapshotted `CONVERSATION_RUNTIME` and the legacy `/api/line-oa/worker` route's claim query excludes it.
- AC-050-004-02 — Given an account with jobs still `SENDING`/`UNKNOWN`, when an owner attempts `CONFIGURE_EXECUTION` to change `runtimeOwner`, then the change is refused until those jobs are quiescent.

## Implementation

- `apps/server/src/modules/line-oa-studio/application/conversation-runtime-core.js`, `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js`

## Verification

- TC-050-004 — Runtime-cohort snapshot and claim boundary (see [verification.md](../verification.md))
