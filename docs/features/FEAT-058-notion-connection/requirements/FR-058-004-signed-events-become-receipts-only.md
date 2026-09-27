---
id: FR-058-004
title: "Signed events become receipts only"
delivery: building
legacy: [FR-274 (split 2/3)]
relations:
  specified_by: [SDD-058, API-156]
  decided_by: [ADR-057]
---

# FR-058-004 — Signed events become receipts only

The system SHALL verify `X-Notion-Signature` as `sha256=` HMAC-SHA256 of the exact raw
body under the verification token with a constant-time compare (401
`NOTION_WEBHOOK_SIGNATURE_INVALID`), validate the event shape (400), and record only
`{eventId, eventType, workspaceId, occurredAt, receivedAt}` as a `NotionWebhookReceipt`,
answering `duplicate: true` for a repeated event id; payload content SHALL NOT be
persisted or written into any business domain.

## Acceptance criteria

- AC-058-004-01 — Given a body altered after signing, when received, then 401 and no receipt is written.
- AC-058-004-02 — Given the same event delivered twice, when received, then one receipt exists and the second answer is `duplicate: true`.
