---
id: FR-041-004
title: "Ingestion composes with the caller's transaction and is audited"
delivery: live
legacy: [FR-023 (split 4/4)]
relations:
  specified_by: [SDD-041]
  derived_from: [NFR-016]
---

# FR-041-004 — Ingestion composes with the caller's transaction and is audited

The system SHALL run inside the caller's transaction when given a transaction client
(propagating unique/serialization failures so the caller retries the whole
transaction), SHALL otherwise open its own transaction and retry it at most three
attempts on unique-constraint or serialization conflicts, and SHALL record one
`MESSAGE_INGESTED` audit event per new message carrying ids, direction and content
kind only — never message text.

## Acceptance criteria

- AC-041-004-01 — Given two concurrent first deliveries for one new thread, when both run standalone, then exactly one Conversation exists and both calls return its id.
- AC-041-004-02 — Given an ingested message, when its audit event is read, then the payload contains no `body` text.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/lib/validation/entities.js (`zIngestLineMessageInput`)

## Verification

- TC-041-001 — First contact, duplicate delivery and audit (see [verification.md](../verification.md))
