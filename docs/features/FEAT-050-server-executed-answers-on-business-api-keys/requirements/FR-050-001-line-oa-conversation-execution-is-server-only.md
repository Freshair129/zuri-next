---
id: FR-050-001
title: "LINE OA conversation execution is server-only"
delivery: building
legacy: [FR-265 (split 1/2)]
relations:
  specified_by: [API-121]
  decided_by: [ADR-047]
---

# FR-050-001 — LINE OA conversation execution is server-only

The system SHALL accept only `CLOUD` for `transportMode` and only `SERVER`
for `executionMode` on a `LineOaAccount`, SHALL NOT expose an action that
selects EDGE execution, and SHALL leave `LineConversationJob.executionMode`
rows already recorded `EDGE` as unmodified history.

## Acceptance criteria

- AC-050-001-01 — Given the account action vocabulary, when enumerated, then no action selects EDGE transport or execution.
- AC-050-001-02 — Given a `LineConversationJob` row with historical `executionMode: 'EDGE'`, when any current code path runs, then that row is never rewritten.

## Implementation

- `apps/server/src/lib/validation/enums.js`, `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`

## Verification

- TC-050-001 — Vocabulary retirement (see [verification.md](../verification.md))
