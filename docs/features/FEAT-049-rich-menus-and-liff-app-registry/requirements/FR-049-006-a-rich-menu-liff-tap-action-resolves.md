---
id: FR-049-006
title: "A rich menu LIFF tap action resolves by code, never invents a URL"
delivery: implemented
legacy: [FR-153 (split 2/2)]
relations:
  specified_by: [API-134]
  decided_by: [ADR-044]
---

# FR-049-006 — A rich menu LIFF tap action resolves by code, never invents a URL

The system SHALL resolve a rich menu `LIFF` tap action to
`https://liff.line.me/{liffId}{path}` through an `ACTIVE` app named by code, at
both queue time and execution time, and SHALL refuse with `LIFF_UNRESOLVED`
(no such app) or `LIFF_NOT_ACTIVE` (not yet active) rather than invent one.

## Acceptance criteria

- AC-049-006-01 — Given a rich menu `LIFF` action naming a code with no matching app on the account, when queued, then the job is refused `LIFF_UNRESOLVED`.
- AC-049-006-02 — Given a matching but `DRAFT` app, when the action is resolved, then it is refused `LIFF_NOT_ACTIVE`.

## Implementation

- `apps/server/src/modules/line-oa-studio/application/line-oa-rich-menu-jobs.js` (LIFF resolution at queue/execution time)

## Verification

- TC-049-006 — LIFF action resolution refusals (see [verification.md](../verification.md))
