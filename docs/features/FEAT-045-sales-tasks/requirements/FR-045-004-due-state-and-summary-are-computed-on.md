---
id: FR-045-004
title: "Due state and summary are computed on read; access is gated"
delivery: implemented
legacy: [FR-161 (split 4/4)]
relations:
  specified_by: [SDD-045, API-120, API-119]
  derived_from: [BR-046]
---

# FR-045-004 — Due state and summary are computed on read; access is gated

The system SHALL compute, on every read, each open task's due state (OVERDUE, TODAY,
UPCOMING by Asia/Bangkok calendar day; NONE when closed) and a summary (open, in
progress, overdue, due today, mine, unassigned) without storing them; lists filter by
status, assignee, Customer, Conversation, due state and include-closed (limit ≤ 500).
Reads SHALL require Business visibility plus the `customer` domain (FR-003-009 404
otherwise); writes SHALL additionally require Business OWNER or the `SALES_REP`
binding (403 otherwise).

## Acceptance criteria

- AC-045-004-01 — Given a task due yesterday (Bangkok), when listed, then its due state is OVERDUE and the summary counts it in `overdue`.
- AC-045-004-02 — Given a Member with the CRM domain but neither owner nor SALES_REP, when creating, then 403.
- AC-045-004-03 — Given a principal without the CRM domain, when reading, then 404.

## Verification

- TC-045-001 — Pure rules: schedule, transitions, code, due state (see [verification.md](../verification.md))
- TC-045-002 — Service authorization, links and CAS (see [verification.md](../verification.md))
