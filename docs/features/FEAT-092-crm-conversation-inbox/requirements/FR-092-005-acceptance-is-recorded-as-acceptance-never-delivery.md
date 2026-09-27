---
id: FR-092-005
title: "Acceptance is recorded as acceptance, never delivery"
part: FEAT-092-P02
owner: DOM-CRM
delivery: live
legacy: [FR-093 (split 2/2)]
relations:
  specified_by: [SDD-092, API-117]
  derived_from: [BR-056]
---

# FR-092-005 — Acceptance is recorded as acceptance, never delivery

The system SHALL, for server transport, accept an outbound record only with full
Tenant, Business and channel-account scope (400 `OUTBOUND_SCOPE_REQUIRED`) and an
acceptance time (and optional provider request id), SHALL refuse any `deliveredAt`
claim (400 `ACCEPTANCE_IS_NOT_DELIVERY`), SHALL stamp the Message with the acceptance
time and SHALL audit it as `OUTBOUND_ACCEPTED`.

## Acceptance criteria

- AC-092-005-01 — Given a receipt carrying `deliveredAt`, when submitted through the acceptance writer, then 400 and nothing is written.

## Implementation

- apps/server/src/modules/crm/reply-record-service.js

## Verification

- TC-092-003 — Reply record scope, idempotency and acceptance (see [verification.md](../verification.md))
