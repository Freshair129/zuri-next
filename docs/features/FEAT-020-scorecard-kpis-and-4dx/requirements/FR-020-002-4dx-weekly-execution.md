---
id: FR-020-002
title: "4DX weekly execution"
delivery: declared
legacy: [FR-270]
relations:
  decided_by: [ADR-016]
  derived_from: [BR-088]
---

# FR-020-002 — 4DX weekly execution

The system SHALL allow at most two non-archived Goals per Business with `isWig = true`, enforced inside
the transaction that sets the flag; each WIG SHALL name one Key Result as its lag measure and may hold
lead measures (weekly target the team controls) with weekly values; a named Person SHALL be able to
record weekly commitments (optionally tied to a lead measure, toggled done); a WIG session per
(Business, week starting Monday 00:00 Asia/Bangkok) SHALL record the report/scoreboard/plan steps
idempotently; all writes OWNER-only and audited; Business Home SHALL show the weekly WIG card and a
session-incomplete attention row after a stated grace period.

## Acceptance criteria

- AC-020-002-01 — Given two WIGs in Business A, when a third is flagged, then refused; in Business B, then allowed.
- AC-020-002-02 — Given a session step marked twice, then one session row exists.

## Implementation

- none — only `weekStartFor` in apps/server/src/modules/project-manager/progress/week.js and `BusinessGoal.isWig` column
