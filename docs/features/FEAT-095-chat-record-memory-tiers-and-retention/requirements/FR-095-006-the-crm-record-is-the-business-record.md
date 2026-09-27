---
id: FR-095-006
title: "The CRM record is the business record; memory is not"
part: FEAT-095-P03
owner: DOM-CRM
delivery: building
legacy: [FR-230 (split 3/3)]
relations:
  specified_by: [SDD-095]
  decided_by: [ADR-041]
---

# FR-095-006 — The CRM record is the business record; memory is not

The system SHALL write the CRM Conversation/Message first in the admission transaction
and SHALL serve the inbox, receipts and legal retention only from CRM, never from MSP
session events; MSP consolidation into episodic/passport memory uses summaries produced
by the agent lane and persists nothing into the knowledge substrate.

## Acceptance criteria

- AC-095-006-01 — Given MSP unreachable, when a LINE message is admitted, then the CRM record is written and the inbox shows it.

## Verification

- TC-095-002 — Retention overrides and sweep (see [verification.md](../verification.md))
