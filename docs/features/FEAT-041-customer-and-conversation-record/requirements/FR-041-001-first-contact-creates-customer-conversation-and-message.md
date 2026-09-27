---
id: FR-041-001
title: "First contact creates Customer, Conversation and Message atomically"
delivery: live
legacy: [FR-023 (split 1/4)]
relations:
  specified_by: [SDD-041, API-116]
  depends_on: [FR-029-004]
  derived_from: [BR-046]
---

# FR-041-001 — First contact creates Customer, Conversation and Message atomically

The system SHALL, for an inbound LINE message, resolve the sender through the identity
contract and then find or create — in one transaction — the tenant's Customer for that
Person (unique per `(tenantId, personId)`, human code prefixed `CUS`), the Conversation
keyed by `(tenantId, channel=LINE, channelAccountId, externalThreadId)`, and the Message
with `direction`, `body`, `externalMessageId` and `contentKind` (default `TEXT`).

## Acceptance criteria

- AC-041-001-01 — Given a LINE user never seen in the tenant, when a message is ingested, then one Person-linked Customer, one Conversation and one Message exist and the result reports `created = {customer: true, conversation: true, message: true}`.
- AC-041-001-02 — Given the same LINE user in a second tenant, when a message is ingested there, then a separate Customer is created in that tenant; no row of the first tenant is read or changed.
- AC-041-001-03 — Given a message without a channel account, when ingested, then the conversation is recorded under the legacy account `LEGACY:LINE`.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js (`ingestLineMessage`); apps/server/src/modules/identity/resolve-line-identity.js

## Verification

- TC-041-001 — First contact, duplicate delivery and audit (see [verification.md](../verification.md))
- TC-041-002 — Tenant isolation of Customers (see [verification.md](../verification.md))
