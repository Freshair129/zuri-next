---
id: SDD-008
title: "Enterprise API — design"
---

# SDD-008 — Enterprise API design

- **Components:** CMP-020 (`external-ref.js`: `lookupExternalRef`, `resolveEntityIdentity`, `syncExternalRefs`, `listExternalRefs`; key-viewer branch of `authorizeImportTarget`), CMP-019 (`buildOpenApiDocument`).
- **Data owned:** none new — ExternalRef rows are written by the import commit through the mapping helpers (model governed by DOM-IAM, BR-047).
- **Contracts exposed:** API-039, API-038 (machine use), API-075, API-047.
- **Contracts consumed:** IAM `resolveApiAccessViewer` (Bearer → Tenant principal, FR-008-002), `isApiAccessFor(viewer, tenantId)`.
- **Main sequence:** 1. try API key viewer, else session viewer 2. authorize target by Tenant (key) or Business ownership (session) 3. run the PlanEnvelope pipeline with external-ref resolution.
- **Failure modes:** key invalid → falls through to session → 401; cross-Tenant → 404.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-008-001 | apps/server/src/modules/project-manager/import/external-ref.js; import/plan-import-service.js |
| FR-008-002 | apps/server/src/modules/identity/api-access-auth.js (consumed); import/import-authorization.js; apps/server/src/app/api/import/{dry-run,commit}/route.js; apps/server/src/app/api/resolve/route.js; apps/server/src/app/api/docs/route.js |
| FR-008-003 | apps/server/src/app/api/resolve/route.js |
| FR-008-004 | apps/server/src/modules/project-manager/api-docs/openapi.js; apps/server/src/app/api/docs/route.js |
