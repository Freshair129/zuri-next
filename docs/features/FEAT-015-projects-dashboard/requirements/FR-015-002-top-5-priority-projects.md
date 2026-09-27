---
id: FR-015-002
title: "Top 5 Priority Projects"
delivery: live
legacy: [FR-086 (split 2/2 — Top 5 panel)]
relations:
  specified_by: [API-070]
  decided_by: [ADR-011]
---

# FR-015-002 — Top 5 Priority Projects

The system SHALL order the panel by `priority` rank (CRITICAL, HIGH, MEDIUM, LOW) then `targetAt`,
excluding Projects with no or unknown priority, and when no Project carries a priority SHALL render
an empty state saying so (with where to set it) rather than substituting a deadline ordering.

## Acceptance criteria

- AC-015-002-01 — Given no priorities set, then `items: []` with a reason, not the five soonest deadlines.

## Verification

- TC-015-001 — Dashboard read model and UI (see [verification.md](../verification.md))
