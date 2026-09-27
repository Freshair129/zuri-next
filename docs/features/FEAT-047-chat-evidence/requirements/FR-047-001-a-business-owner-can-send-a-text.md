---
id: FR-047-001
title: "A Business owner can send a text reply from the inbox"
delivery: building
legacy: [FR-246 (split 1/2)]
relations:
  specified_by: [SDD-047, API-109]
  derived_from: [BR-046]
---

# FR-047-001 — A Business owner can send a text reply from the inbox

The system SHALL accept `POST /api/crm/conversations/{id}/reply` with
`{businessId, text (1–5000), clientRequestId (uuid)}` only from a viewer with the
`customer` domain (else 404) who owns the Business (else 403) and has a Person
identity (else 401), for a conversation in the Business's Tenant that is tenant-shared
or bound to that Business (else 404). It SHALL refuse before any send a non-LINE or
legacy-account conversation (409 `STAFF_REPLY_NOT_SUPPORTED_FOR_CHANNEL`) and an
account that is not server-enabled (409 `LINE_ACCOUNT_NOT_SERVER_ENABLED`).

## Acceptance criteria

- AC-047-001-01 — Given a conversation on `LEGACY:LINE`, when a staff reply is sent, then 409 and LINE is not called.
- AC-047-001-02 — Given a Member without owner authority, when sending, then 403 and LINE is not called.

## Implementation

- apps/server/src/modules/crm/reply-record-service.js; apps/server/src/app/api/crm/conversations/[id]/reply/route.js; apps/server/src/app/(pm)/customer/conversations/page.jsx

## Verification

- TC-047-001 — Staff reply authority, send and record (see [verification.md](../verification.md))
- TC-047-004 — Legal hold and expiry (see [verification.md](../verification.md))
