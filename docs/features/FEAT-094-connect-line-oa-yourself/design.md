---
id: SDD-094
title: "Connect LINE OA yourself — design"
---

# SDD-094 — Connect LINE OA yourself design

- **Components:** CMP-144 (`core/secret-store/**`); CMP-132 (`modules/integration/application/line-channel-connection-service.js#connectLineChannelWithSecret`: validate → claim → store); CMP-133 (`line-channel-credential-service.js`: rotate, revoke, validate); CMP-123 (`core/channel-account-claim.js`); CMP-131; CMP-037 (`modules/identity/credential-write-gate.js`, `rate-limit.js` over `RateLimitBucket`); CMP-101 (`LineOaConnectWizard.jsx`, `line-oa-connect-wizard-copy.js`, `credential-input-props.js`, `LineOaCredentialMigrationCard.jsx`); CMP-099 (`line-oa-account-service.js` REGISTER_WEBHOOK, ENABLE_SERVER); CMP-111 (`LineOaReadinessJourney.jsx`).
- **Data owned:** DOM-INT — IntegrationConnection, IntegrationCredential, IntegrationCredentialVersion, IntegrationSecretEnvelope, ChannelAccountClaim; DOM-IAM — RateLimitBucket, TOTP factors; DOM-LOA — LineOaAccount (`webhookStateJson`, `serverEnabled`, `transportEpoch`).
- **Contracts exposed:** API-142, API-143, API-144, API-145, API-123, API-121.
- **Contracts consumed:** API-161, API-138, API-141.
- **Main sequence:** wizard → step-up → `POST /api/line-oa/connections` (gate → LINE validate → claim → vault write → connection) → `POST /api/line-oa/accounts` (DRAFT) → `REGISTER_WEBHOOK` → wait → `ENABLE_SERVER` (derived quiescence, credential validation) → CONNECTED, server-enabled.
- **Failure modes:** LINE outage → 503 with nothing stored; claim refusal → no orphan secret; store/transaction split failure → compensation purge.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-094-001..003 | apps/server/src/platform/integrations/core/secret-store/**; apps/server/src/modules/integration/application/line-channel-credential-service.js; apps/server/src/app/api/line-oa/connections/[id]/credential/** |
| FR-094-004, FR-094-005 | apps/server/src/modules/identity/credential-write-gate.js; apps/server/src/modules/identity/rate-limit.js; apps/server/src/modules/integration/application/credential-route.js |
| FR-094-006, FR-094-007 | apps/server/src/modules/integration/application/line-channel-connection-service.js; apps/server/src/platform/integrations/core/channel-account-claim.js; apps/server/src/platform/integrations/providers/line/line-channel-admin-port.js; apps/server/src/app/api/line-oa/connections/route.js |
| FR-094-008 | apps/server/src/modules/line-oa-studio/ui/LineOaConnectWizard.jsx; apps/server/src/modules/line-oa-studio/domain/line-oa-connect-wizard-copy.js; apps/server/src/modules/line-oa-studio/ui/LineOaCredentialMigrationCard.jsx; apps/server/src/app/api/line-oa/accounts/route.js |
| FR-094-009, FR-094-010 | apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js; apps/server/src/modules/line-oa-studio/domain/line-oa-webhook-copy.js; apps/server/src/modules/line-oa-studio/ui/LineOaReadinessJourney.jsx; apps/server/src/lib/public-base-url.js |
