---
id: FR-092-003
title: "The readers are read-only by construction"
part: FEAT-092-P01
owner: DOM-CRM
delivery: live
legacy: [FR-091 (split 3/3)]
relations:
  specified_by: [SDD-092]
  derived_from: [BR-056]
---

# FR-092-003 — The readers are read-only by construction

The system SHALL expose no write path through the inbox read model; the Inbox page
SHALL show conversations and threads from the two read contracts and SHALL offer no
automatic-reply control (the only composer is the owner's staff reply, FEAT-047).

## Acceptance criteria

- AC-092-003-01 — Given the read-model module, when its exports are inspected, then it exports no function that writes Conversation or Message.

## Verification

- TC-092-002 — Inbox UI contract (see [verification.md](../verification.md))
