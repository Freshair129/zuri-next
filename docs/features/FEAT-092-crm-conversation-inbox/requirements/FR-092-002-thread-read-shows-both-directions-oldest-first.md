---
id: FR-092-002
title: "Thread read shows both directions oldest-first"
part: FEAT-092-P01
owner: DOM-CRM
delivery: live
legacy: [FR-091 (split 2/3)]
relations:
  specified_by: [SDD-092, API-108]
---

# FR-092-002 — Thread read shows both directions oldest-first

The system SHALL answer `GET /api/crm/conversations/{id}?businessId=` with the thread's
messages oldest-first (direction, body, content kind, time, session fields) and the
customer behind it, and SHALL answer 404 for a conversation outside the same scope.

## Acceptance criteria

- AC-092-002-01 — Given a conversation with an inbound message and its recorded answer, when opened, then both appear in order with their directions.

## Verification

- TC-092-001 — Inbox scope and thread read (see [verification.md](../verification.md))
