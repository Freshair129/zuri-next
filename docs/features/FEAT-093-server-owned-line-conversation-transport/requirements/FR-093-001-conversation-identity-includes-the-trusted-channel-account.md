---
id: FR-093-001
title: "Conversation identity includes the trusted channel account"
part: FEAT-093-P01
owner: DOM-CRM
delivery: implemented
legacy: [FR-148 (split 1/2)]
relations:
  specified_by: [SDD-093, API-116]
  decided_by: [ADR-045, ADR-038]
---

# FR-093-001 — Conversation identity includes the trusted channel account

The system SHALL key every LINE Conversation by `(tenantId, channel, channelAccountId,
externalThreadId)`, where `channelAccountId` is the server-resolved LINE OA account
(its binding code, else its id) — never taken from the LINE payload — and SHALL keep
rows that predate accounts under `LEGACY:LINE` without guessed attribution; the same
LINE user talking to two accounts of one Tenant has two conversations.

## Acceptance criteria

- AC-093-001-01 — Given one LINE user messaging accounts A and B of the same Business, when both are admitted, then two Conversations exist, one per account.
- AC-093-001-02 — Given historical rows, when the account-scope migration applies, then they carry `LEGACY:LINE` and none is reassigned to an account.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/reply-record-service.js; apps/server/src/modules/identity/resolve-line-identity.js

## Verification

- TC-093-001 — Account-scoped conversations (see [verification.md](../verification.md))
- TC-093-003 — Webhook ingress and after-ack admission (see [verification.md](../verification.md))
