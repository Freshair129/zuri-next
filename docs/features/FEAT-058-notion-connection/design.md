---
id: SDD-058
title: "Notion connection — design"
---

# SDD-058 — Notion connection design

- **Components:** CMP-138 — `modules/integration/application/notion-oauth-service.js`; CMP-139 — `modules/integration/application/notion-webhook-service.js`.
- **Data owned:** NotionOAuthState, NotionWebhookVerificationToken, NotionWebhookReceipt; IntegrationConnection/Credential rows for the Notion provider.
- **Contracts exposed:** API-154, API-155, API-156, API-158, API-157.
- **Contracts consumed:** API-161; credential-write gate (DOM-IAM, FR-094-004); installation operator check (DOM-IAM).
- **Main sequence:** connect → state row → Notion consent → callback → consume state → exchange → store credential → ACTIVE connection → redirect.
- **Failure modes:** exchange or store failure removes the DRAFT connection; webhook setup store failure → 503.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-058-001, FR-058-002 | apps/server/src/modules/integration/application/notion-oauth-service.js; apps/server/src/app/api/integrations/notion/connect/route.js; apps/server/src/app/oauth/notion/callback/route.js |
| FR-058-003..005 | apps/server/src/modules/integration/application/notion-webhook-service.js; apps/server/src/app/api/integrations/notion/webhook/route.js; apps/server/src/app/api/platform/integrations/notion/webhook-verification/** |
