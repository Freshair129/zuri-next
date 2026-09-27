---
id: SDD-001
title: "Scope hierarchy & scope administration — design"
---

# SDD-001 — Scope hierarchy & scope administration design

- **Components:** CMP-030 — creators (`createPortfolio/Tenant/LegalEntity/TaxRegistrationBranch/Business/BusinessInGroup/Branch/Workspace`), `updateWorkspace`, `archiveWorkspace`, `listScope`, `assertWorkspaceInScope`, `listWorkspacesForScope`; CMP-024 — `requireViewer`, `assertWorkspaceWritable`; CMP-005 — capability registry + writer; CMP-002.
- **Data owned:** Portfolio, Tenant, LegalEntity, Business (incl. `capabilitiesJson`, `version`), Branch, Workspace (`scopeType` PORTFOLIO|TENANT|BUSINESS, `status`, `version`).
- **Contracts exposed:** API-077, API-076 (dispatch on `entity` ∈ portfolio|tenant|business|businessInGroup|workspace|legalEntity|taxRegistrationBranch|branch), API-083, API-006. `scope-service` is also the in-process contract other domains use to build scope (never direct inserts).
- **Contracts consumed:** IAM viewer contract (`resolveRequestViewer`, `ownsBusiness`, `ownsTenant`, `seesBusiness`, `isInstallationOperator` — FR-023-001/FR-061), IAM grant writer `grantBusinessMembership` (FR-030-001).
- **Main sequence (create):** 1. route resolves viewer (fail closed) 2. read body, pick creator by `entity` (unknown → 400) 3. creator validates input (Zod), checks its own tier predicate 4. unique codes resolved before the transaction 5. insert + audit (self-service: tenant, business, workspace, OWNER grant, audit in one transaction).
- **Failure modes:** unowned target → 404-shaped; operator tier → 403 naming the capability; unknown workspace scope type → 403 "no declared creation authority"; code collision → regenerated; stale capability version → 409.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-001-001 | apps/server/src/modules/project-manager/application/scope-service.js; apps/server/src/lib/validation/entities.js |
| FR-001-002 | apps/server/src/app/api/scope/route.js (`visibleScope`) |
| FR-001-003 | apps/server/src/app/api/workspaces/[id]/route.js; scope-service.js (`updateWorkspace`, `archiveWorkspace`); application/project-authorization.js |
| FR-001-004..007 | apps/server/src/modules/project-manager/application/scope-service.js; apps/server/src/modules/identity/viewer-authority.js (consumed) |
| FR-001-008 | apps/server/src/lib/business-capabilities.js; apps/server/src/modules/business/application/business-capability-service.js; apps/server/src/app/api/businesses/[id]/capabilities/route.js; apps/server/src/app/(pm)/settings/page.jsx |
