---
id: FR-041-003
title: "Business scope is enforced before any row is returned"
delivery: live
legacy: [FR-023 (split 3/4)]
relations:
  specified_by: [SDD-041]
  derived_from: [SEC-001, BR-046]
---

# FR-041-003 — Business scope is enforced before any row is returned

The system SHALL require a `businessId` for any non-legacy channel account (400
`BUSINESS_REQUIRED_FOR_CHANNEL_ACCOUNT`), SHALL refuse a Business outside the tenant
(404 `BUSINESS_NOT_FOUND`), and SHALL refuse to move an existing Conversation to a
different Business (409 `CONVERSATION_BUSINESS_SCOPE_CONFLICT`) — checked even for a
duplicate, before any identifier is returned.

## Acceptance criteria

- AC-041-003-01 — Given a conversation bound to Business A, when a message arrives naming Business B for the same thread, then ingestion fails with 409 and nothing is written.
- AC-041-003-02 — Given a channel account id other than `LEGACY:LINE` and no Business, when ingested, then it fails with 400.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js

## Verification

- TC-041-003 — Account/Business scope guards (see [verification.md](../verification.md))
