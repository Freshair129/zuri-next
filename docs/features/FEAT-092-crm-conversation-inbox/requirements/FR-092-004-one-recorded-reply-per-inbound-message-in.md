---
id: FR-092-004
title: "One recorded reply per inbound message, in scope"
part: FEAT-092-P02
owner: DOM-CRM
delivery: live
legacy: [FR-093 (split 1/2)]
relations:
  specified_by: [SDD-092, API-117]
  derived_from: [SEC-001, BR-056]
---

# FR-092-004 — One recorded reply per inbound message, in scope

The system SHALL record an automatic reply as an `OUTBOUND` Message only when the named
inbound `Message.id` resolves inside the given Tenant (and Business and LINE channel
account when given) and is INBOUND (404 `INBOUND_MESSAGE_NOT_FOUND`, 400
`INBOUND_MESSAGE_NOT_INBOUND`); the conversation is derived from that message, never
from the request; the external id `reply:<inboundMessageId>` makes a redelivered
receipt return the existing row; the body is the text actually sent, and whether it
came from the model (`STACK`) or the transport's fallback (`TRANSPORT_FALLBACK`) is
recorded on the audit event only. The reply joins the inbound message's session.

## Acceptance criteria

- AC-092-004-01 — Given a receipt naming an inbound message of another Tenant, when recorded, then 404 and nothing is written.
- AC-092-004-02 — Given the same receipt twice, when recorded, then one OUTBOUND row exists and the second call returns `created: false`.

## Implementation

- apps/server/src/modules/crm/reply-record-service.js

## Verification

- TC-092-003 — Reply record scope, idempotency and acceptance (see [verification.md](../verification.md))
