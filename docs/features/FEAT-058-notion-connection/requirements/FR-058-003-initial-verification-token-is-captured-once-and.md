---
id: FR-058-003
title: "Initial verification token is captured once and pinned"
delivery: building
legacy: [FR-274 (split 1/3)]
relations:
  specified_by: [SDD-058, API-156]
---

# FR-058-003 — Initial verification token is captured once and pinned

The system SHALL accept `POST /api/integrations/notion/webhook` only as
`application/json` (415 otherwise) with a body ≤ 1 MiB (413); when no verification
token is configured, it SHALL accept only Notion's unsigned challenge, store its
`verification_token` encrypted (envelope with its own data key), and refuse other
bodies 401 `NOTION_WEBHOOK_VERIFICATION_REQUIRED`; after that, an identical challenge
retry is acknowledged and a different token is refused 409
`NOTION_WEBHOOK_TOKEN_ALREADY_CONFIGURED`.

## Acceptance criteria

- AC-058-003-01 — Given a configured token, when a challenge with another token arrives, then 409 and the stored token is unchanged.

## Implementation

- apps/server/src/modules/integration/application/notion-webhook-service.js; apps/server/src/app/api/integrations/notion/webhook/route.js; apps/server/src/app/api/platform/integrations/notion/webhook-verification/**
