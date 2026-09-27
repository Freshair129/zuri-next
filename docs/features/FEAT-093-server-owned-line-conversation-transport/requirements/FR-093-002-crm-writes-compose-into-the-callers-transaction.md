---
id: FR-093-002
title: "CRM writes compose into the caller's transaction and enforce scope"
part: FEAT-093-P01
owner: DOM-CRM
delivery: implemented
legacy: [FR-148 (split 2/2)]
relations:
  specified_by: [SDD-093, API-116, API-117]
---

# FR-093-002 — CRM writes compose into the caller's transaction and enforce scope

The system SHALL let inbound ingestion and accepted-outbound recording run inside the
admission or delivery transaction of the job ledger, enforce Tenant/Business/account
scope on both, and preserve message idempotency (inbound per external message id,
outbound per inbound message).

## Acceptance criteria

- AC-093-002-01 — Given an admission transaction that rolls back after ingestion, when inspected, then neither the Message nor the job exists.

## Implementation

- apps/server/src/modules/crm/line-ingest-service.js; apps/server/src/modules/crm/reply-record-service.js; apps/server/src/modules/identity/resolve-line-identity.js

## Verification

- TC-093-001 — Account-scoped conversations (see [verification.md](../verification.md))
- TC-093-005 — Job ledger, fencing, send outcomes and cadence (see [verification.md](../verification.md))
