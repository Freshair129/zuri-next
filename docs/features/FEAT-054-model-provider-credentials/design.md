---
id: SDD-054
title: "Model provider credentials (API keys, Private Runtime Platform) — design"
---

# SDD-054 — Model provider credentials (API keys, Private Runtime Platform) design

- **Components:** CMP-144 — `core/secret-store/secret-store-port.js` (bundle schemas, kinds, error map), `envelope-secret-store.js`, `supabase-vault-secret-store.js`, `dispatching-secret-manager.js`, `credential-lifecycle.js`; CMP-137 — `modules/integration/application/model-provider-credential-service.js`; CMP-136 — `providers/model/model-provider-admin-port.js`, `providers/model/private-runtime-config.js`; CMP-125 — `modules/integration/application/credential-route.js`.
- **Data owned:** IntegrationProvider, IntegrationConnection (purpose `MODEL_PROVIDER`), IntegrationCredential, IntegrationCredentialVersion, IntegrationSecretEnvelope.
- **Contracts exposed:** API-151, API-152, API-153, API-161, API-150.
- **Contracts consumed:** credential-write gate and rate limit (DOM-IAM, FR-094-004); viewer authority (DOM-IAM).
- **Main sequence (provision):** parse → owner + domain gate → write gate → writable store present → live probe → transaction(connection create/reuse) → store + activate version → audit.
- **Failure modes:** store unavailable → `CHANNEL_SECRET_STORE_UNAVAILABLE`; connection transaction failure → `MODEL_PROVIDER_CONNECTION_FAILED` with compensation purge of any stored secret.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-054-001, FR-054-002 | apps/server/src/platform/integrations/core/secret-store/secret-store-port.js; envelope-secret-store.js; supabase-vault-secret-store.js; credential-lifecycle.js |
| FR-054-003, FR-054-004 | apps/server/src/modules/integration/application/model-provider-credential-service.js; apps/server/src/modules/integration/application/credential-route.js; apps/server/src/app/api/integration/model-providers/** |
| FR-054-005 | apps/server/src/platform/integrations/providers/model/model-provider-admin-port.js; apps/server/src/platform/integrations/providers/model/private-runtime-config.js; apps/server/src/modules/agent/model-provider.js |
| FR-054-006 | apps/server/src/modules/integration/application/model-provider-credential-service.js (`resolveBusinessModelCredential`) |
