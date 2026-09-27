---
id: FR-049-003
title: "Publish jobs are server-owned, leased and fenced"
delivery: implemented
legacy: [FR-152 (split 1/2)]
relations:
  specified_by: [EVT-003]
  decided_by: [ADR-045]
---

# FR-049-003 — Publish jobs are server-owned, leased and fenced

The system SHALL queue at most one open `LineOaRichMenuJob` per menu — `PUBLISH`
a FROZEN version, or `SET_DEFAULT`/`SET_ALIAS` a PUBLISHED one — with the
menu's `version` as compare-and-swap, and SHALL have the worker claim the
oldest due job with compare-and-set and a bounded lease, fencing on the
account's status, transport mode and transport epoch before any external call.

## Acceptance criteria

- AC-049-003-01 — Given a menu with one open job, when a second job is queued for the same menu, then it is refused as a conflict.
- AC-049-003-02 — Given a job whose account's transport epoch has since advanced, when the worker attempts to claim it, then the claim is fenced and refused.

## Implementation

- `apps/server/src/modules/line-oa-studio/application/line-oa-rich-menu-jobs.js`, `application/server-line-rich-menu-runtime.js`

## Verification

- TC-049-003 — Job queueing, fencing and lease (see [verification.md](../verification.md))
