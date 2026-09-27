---
id: FR-093-003
title: "Every webhook event is recorded as Integration evidence without its reply token"
part: FEAT-093-P02
owner: DOM-INT
delivery: implemented
legacy: [FR-149 (split 1/10)]
relations:
  specified_by: [SDD-093, API-146, API-160]
---

# FR-093-003 — Every webhook event is recorded as Integration evidence without its reply token

The system SHALL record each LINE event as a `RawExternalRecord` (lane CUSTOMER,
schema `line.messaging-api.webhook.v1`) under the account's `LINE_OA` connection before
admission, stripping transient fields — the reply token above all — from what is
persisted, idempotent per event; its `processingStatus` moves `RECEIVED → ADMITTING →
ADMITTED | SKIPPED | FAILED` and no other value.

## Acceptance criteria

- AC-093-003-01 — Given a captured event, when its stored payload is read, then it contains no `replyToken`.

## Implementation

- apps/server/src/platform/integrations/providers/line/line-oa-evidence.js; line-oa-webhook.js; server-line-transport.js

## Verification

- TC-093-002 — Evidence and messaging port (see [verification.md](../verification.md))
