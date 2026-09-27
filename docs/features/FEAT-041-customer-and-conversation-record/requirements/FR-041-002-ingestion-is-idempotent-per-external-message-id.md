---
id: FR-041-002
title: "Ingestion is idempotent per external message id"
delivery: live
legacy: [FR-023 (split 2/4)]
relations:
  specified_by: [SDD-041, API-116]
  derived_from: [BR-047]
---

# FR-041-002 — Ingestion is idempotent per external message id

The system SHALL treat a message whose `externalMessageId` already exists in the
Conversation as a duplicate: it SHALL return the existing Customer, Conversation,
Message and session ids with `created.message = false` and write nothing.

## Acceptance criteria

- AC-041-002-01 — Given a message already ingested, when the same LINE event is delivered again, then no new Message is written and the original `messageId` is returned.
- AC-041-002-02 — Given a duplicate result, when the caller is the admission path, then it reuses its existing job and never starts a second model turn.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js

## Verification

- TC-041-001 — First contact, duplicate delivery and audit (see [verification.md](../verification.md))
