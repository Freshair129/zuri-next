---
id: SDD-091
title: "Phase 1 LINE runtime connections — design"
---

# SDD-091 — Phase 1 LINE runtime connections design

- **Components:** CMP-171 — `modules/agent/model-provider.js`, `model-provider-catalog.js`, `openrouter-oauth.js`; CMP-174 — `modules/agent/phase1-runtime.js` (runtime source, role-scoped DB access, `resolveModel`); CMP-130 — `platform/integrations/core/integration-registry.js`; CMP-143 — `platform/integrations/core/secret-manager.js`, `credential-vault.js`; CMP-129 — `modules/integration/application/integration-management-service.js`, `core/connection-health.js`, `core/connector-catalog.js`.
- **Data owned:** DOM-INT — IntegrationProvider, IntegrationConnection, IntegrationCredential; DOM-AGT owns no rows here.
- **Contracts exposed:** API-140, API-161.
- **Contracts consumed:** LINE binding resolution (DOM-AGT, FR-064-003); FEAT-054 Business model credential resolver.
- **Main sequence:** binding → trusted scope → Business credential? → else Phase-1 connection → secret manager → `createModelProviderPort` → generate with trace hooks.
- **Failure modes:** every ambiguity, missing secret, expiry, forbidden source/backend throws before knowledge/model/reply work.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-091-001, FR-091-002 | apps/server/src/modules/agent/model-provider.js; apps/server/src/modules/agent/model-provider-catalog.js; apps/server/src/modules/agent/openrouter-oauth.js; apps/server/src/platform/integrations/llm/provider-catalog.js |
| FR-091-003 | apps/server/src/platform/integrations/core/integration-registry.js |
| FR-091-004 | apps/server/src/platform/integrations/core/secret-manager.js; apps/server/src/platform/integrations/core/credential-vault.js; apps/server/src/modules/agent/phase1-runtime.js |
| FR-091-005 | apps/server/src/modules/agent/phase1-runtime.js |
| FR-091-006, FR-091-007 | apps/server/src/modules/integration/application/integration-management-service.js; apps/server/src/platform/integrations/core/connection-health.js; apps/server/src/app/api/platform/integrations/route.js; apps/server/src/app/(pm)/platform/integrations/page.jsx |
