---
id: FR-015-004
title: "Project accountable owner (PIC)"
delivery: live
legacy: [FR-088]
relations:
  specified_by: [API-051]
  decided_by: [ADR-011]
---

# FR-015-004 — Project accountable owner (PIC)

The system SHALL store one optional accountable Person per Project (`picPersonId`), distinct from
Team membership and from `WorkItem.assigneeRef`, set explicitly and never inferred from assignments.

## Acceptance criteria

- AC-015-004-01 — Given PIC set to P and all work reassigned to Q, then the PIC remains P.

## Verification

- TC-015-002 — Priority and PIC (see [verification.md](../verification.md))
