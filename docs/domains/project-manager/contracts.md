---
title: Projects & Work — public contracts
owner: DOM-PRJ
status: draft
---

# Contracts — DOM-PRJ
Conventions for every HTTP contract below unless stated otherwise:

- **Runtime:** SRV-001 (Next.js route handlers under `apps/server/src/app/api/`).
- **Viewer:** the handler resolves one trusted viewer from the request session
  (IAM `resolveRequestViewer`, FR-002-005) before reading the body; a missing or
  invalid session fails closed with 401. Client-supplied identity/role/scope claims are
  never authority (SEC-007).
- **Authorization predicates** (IAM viewer contract, FR-024-003): `seesBusiness` for
  reads, `ownsBusiness` for writes on Business-governed targets (BR-002), `ownsTenant`
  for tenant-tier creation, `isOperator` for installation-wide operations.
- **Refusal shape:** an unowned or invisible Business-governed target answers exactly
  like a nonexistent one (404, same body); a target governed above Business is refused for
  every principal (403/400) with a reason naming the missing authority.
- **Errors:** JSON `{ error, issues?, details? }`. Zod validation failure → 400 with
  `issues[]`; optimistic-concurrency conflict → 409; database infrastructure failure →
  500 (Prisma errors are classified by name, never reported as 400).
- **Writes** go through a PRJ application service that records an AuditEvent
  (BR-001).

## Scope & shell

### API-077 — Visible scope inventory
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-001-002, FR-002-001
- Method/path: `GET /api/scope`
- Purpose: the shell's compatibility inventory of Portfolios, Tenants, Businesses (with `capabilitiesJson`), non-archived Workspaces and Project headers.
- Auth/scope: viewer required; non-operators receive only `seesBusiness` Businesses and the ancestry/Workspaces/Projects reachable from them; operators receive everything.
- Response: `{ portfolios[], tenants[], businesses[], workspaces[], projects[{id,code,name,businessId,workspaceId,status}] }`.
- Errors: 401 no session.
- Legacy: apps/server/src/app/api/scope/route.js

### API-076 — Create a scope entity
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-001-001, FR-001-004, FR-001-005, FR-001-006, FR-001-007
- Method/path: `POST /api/scope`
- Request: `{ entity, data }`, `entity` ∈ `portfolio | tenant | business | businessInGroup | workspace | legalEntity | taxRegistrationBranch | branch`; `data` validated per entity (name, optional code, parent ids, `scopeType` for workspace).
- Auth/scope: per creator — Branch / BUSINESS Workspace: `ownsBusiness`; Business-in-Tenant / TENANT Workspace / TaxRegistrationBranch: `ownsTenant`; `businessInGroup`: any authenticated principal (creator bound as tenant OWNER in the same transaction); Portfolio / Tenant / LegalEntity / PORTFOLIO Workspace: `isOperator`.
- Response: the created row; for `businessInGroup` `{ portfolio, tenant, business, workspace }`.
- Errors: 400 unknown entity / validation; 401; 403 operator tier or undeclared workspace scope type; 404 unowned parent; 422 `LEGAL_ENTITY_TENANT_MISMATCH`.
- Legacy: apps/server/src/app/api/scope/route.js

### API-083 — Update or archive a Workspace
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-001-003
- Method/path: `PATCH /api/workspaces/[id]` (body `{ name?, status? }`), `DELETE /api/workspaces/[id]` (soft archive → `status: ARCHIVED`).
- Auth/scope: `ownsBusiness` over the Workspace's Business; PORTFOLIO/TENANT Workspaces refused for everyone.
- Response: the updated Workspace (version incremented).
- Errors: 401; 404 unknown or unowned; 403/400 above-Business target.
- Legacy: apps/server/src/app/api/workspaces/[id]/route.js

### API-006 — Toggle a Business capability
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-001-008
- Method/path: `PATCH /api/businesses/[id]/capabilities`
- Request: strict `{ version: int>0, capability: "physicalStock", enabled: boolean }`.
- Auth/scope: viewer role OWNER and `ownsBusiness(viewer, id)`.
- Response: `{ id, version, capabilities: { physicalStock: boolean } }`; a no-op toggle returns current state without writing.
- Errors: 400 validation; 404 unknown or unowned Business (indistinguishable, SEC-001); 409 stale `version`.
- Legacy: apps/server/src/app/api/businesses/[id]/capabilities/route.js

## Projects & execution structure

Common to this section: reads require `seesBusiness` over the target's governing Business
(Project owner, else its Space's Business; PORTFOLIO/TENANT Spaces are readable when the
viewer sees any Business under them); writes require `ownsBusiness` (FR-003-009);
archived/soft-deleted rows answer 404.

### API-069 — List or create Projects
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-001, FR-003-002, FR-003-003
- Method/path: `GET /api/projects`, `POST /api/projects`
- Request (GET): strict query `workspaceId?, businessId?, tenantId?, status?, q?, limit? (≤500), view? = list|overview|timeline|workspace`. (POST): `{ workspaceId, name, code?, businessId?, description?, type?, status?, priority?, picPersonId?, startAt?, targetAt? }`.
- Response: GET `view=list` → `{ items: ProjectListItem[], limit, truncated }`; other views → compatibility arrays. POST → created Project.
- Auth/scope: non-operators must see the named Business/Workspace/Tenant; POST requires write authority on the Workspace.
- Errors: 400 validation / owner-Space mismatch; 401; 404 invisible filter target or unowned Workspace; 403 above-Business Space.
- Legacy: apps/server/src/app/api/projects/route.js

### API-051 — Read, update or archive one Project
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-001, FR-003-003, FR-015-002, FR-015-003
- Method/path: `GET|PATCH|DELETE /api/projects/[id]`
- Request (PATCH): any Project field incl. `workspaceId` (move), `businessId`, `priority`, `picPersonId`.
- Response: GET → Project with business, workspace, live workstreams (containers, items), milestones, gates, repository links; PATCH → updated Project; DELETE → archived Project (`status ARCHIVED`, `deletedAt`).
- Errors: 401; 404 unknown/archived/unowned; 403 above-Business; 400 cross-Business move.
- Legacy: apps/server/src/app/api/projects/[id]/route.js

### API-068 — Project hierarchy tree
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-006-002, FR-007-005
- Method/path: `GET /api/projects/[id]/tree`
- Response: Project with Space and Workstreams → root containers (items, one level of children with items) → unparented items; deleted items excluded.
- Auth/scope: Project readable. Errors: 401, 404.
- Legacy: apps/server/src/app/api/projects/[id]/tree/route.js

### API-085 — List or create Workstreams
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-004
- Method/path: `GET /api/workstreams?projectId&executionMode`, `POST /api/workstreams`
- Request (POST): `{ projectId, name, executionMode, progressStrategy?, progressWeight?, status?, viewConfig?, code? }`.
- Response: Workstreams with Project header / created Workstream. Non-operators are limited to visible Businesses.
- Errors: 400 invalid mode/strategy; 401; 404 unknown/unowned Project; 403 above-Business.
- Legacy: apps/server/src/app/api/workstreams/route.js

### API-084 — Update or archive a Workstream
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-004
- Method/path: `PATCH|DELETE /api/workstreams/[id]`
- Request (PATCH): `{ name?, executionMode?, progressStrategy?, progressWeight?, status?, viewConfig? }`; DELETE soft-archives.
- Errors: 401; 404 unknown/deleted/unowned; 403 above-Business.
- Legacy: apps/server/src/app/api/workstreams/[id]/route.js

### API-019 — Create a WorkContainer
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-005
- Method/path: `POST /api/containers` with `{ workstreamId, subtype, title, parentId?, status?, startAt?, targetAt?, metadata?, code? }`.
- Errors: 400 parent in another Workstream; 401; 404 unknown/unowned Workstream.
- Legacy: apps/server/src/app/api/containers/route.js

### API-018 — Update a WorkContainer
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-005
- Method/path: `PATCH /api/containers/[id]` with `{ title?, status?, subtype?, startAt?, targetAt?, metadata? }`.
- Errors: 401; 404 unknown/unowned.
- Legacy: apps/server/src/app/api/containers/[id]/route.js

### API-082 — List or create WorkItems
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-006
- Method/path: `GET /api/work?projectId|workstreamId|businessId&executionMode&subtype&status&q`, `POST /api/work`
- Request (POST): `{ workstreamId, subtype, title, containerId?, status?, assigneeRef?, weight?, numericValue?, probability?, metrics?, metadata?, startAt?, targetAt?, code? }`.
- Response: hydrated items (parsed metrics/metadata) excluding deleted / created item.
- Auth/scope: GET requires a visible Project/Workstream, or defaults to the viewer's visible Businesses; POST requires Workstream write authority.
- Errors: 400; 401; 403 no scope; 404.
- Legacy: apps/server/src/app/api/work/route.js

### API-081 — Update or delete a WorkItem
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-006
- Method/path: `PATCH|DELETE /api/work/[id]`; DELETE soft-deletes (`CANCELLED`, `deletedAt`).
- Errors: 401; 404 unknown/deleted/unowned; conflict on `WORK_VERSION_CONFLICT` when an in-process caller supplies an expected version.
- Legacy: apps/server/src/app/api/work/[id]/route.js

### API-046 — List or create Milestones
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-007
- Method/path: `GET /api/milestones?projectId|workstreamId|businessId`, `POST /api/milestones` with `{ projectId, title, workstreamId?, status?, weight?, targetAt?, completedAt?, code? }`.
- Response: GET → milestones and gates for the drill-down scope / created Milestone.
- Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/milestones/route.js

### API-045 — Update a Milestone
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-007
- Method/path: `PATCH /api/milestones/[id]`. Errors: 401; 404.
- Legacy: apps/server/src/app/api/milestones/[id]/route.js

### API-036 — Create a Gate
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-007
- Method/path: `POST /api/gates` with `{ projectId, title, workstreamId?, required?, status?, evidence?, targetAt?, code? }`. Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/gates/route.js

### API-035 — Update a Gate
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-007
- Method/path: `PATCH /api/gates/[id]` (status, evidence, required, target). Errors: 401; 404.
- Legacy: apps/server/src/app/api/gates/[id]/route.js

### API-020 — List or create Dependencies
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-008
- Method/path: `GET /api/dependencies?projectId|businessId`, `POST /api/dependencies` with `{ sourceType, sourceId, targetType, targetId, dependencyType }`.
- Response: GET → edges with resolved endpoint summaries (`code, title, status`) / created edge.
- Auth/scope: GET — visible Project or Business; POST — write authority over BOTH endpoints.
- Errors: 400 self-edge, cycle, unsupported endpoint; 401; 404 missing/unowned endpoint.
- Legacy: apps/server/src/app/api/dependencies/route.js

### API-021 — Delete a Dependency
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-003-008
- Method/path: `DELETE /api/dependencies/[id]` — write authority over both endpoints. Errors: 401; 404.
- Legacy: apps/server/src/app/api/dependencies/[id]/route.js

## Repositories & project team

### API-071 — List or create Repositories
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-004-001, FR-004-002
- Method/path: `GET /api/repositories`, `POST /api/repositories`
- Request (POST): `{ businessId, provider, externalRepoId?, ownerName?, repoName?, fullName?, url?, defaultBranch?, status?, code? }`.
- Response: GET → Repositories of visible Businesses with their Project links; POST → created Repository.
- Auth/scope: GET filters by `seesBusiness`; POST requires `ownsBusiness(businessId)`.
- Errors: 400 validation (businessId required); 401; 404 unowned Business.
- Legacy: apps/server/src/app/api/repositories/route.js

### API-072 — Update a Repository
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-004-002
- Method/path: `PATCH /api/repositories/[id]`
- Auth/scope: `ownsBusiness(repository.businessId)`; ownerless Repository refused for everyone.
- Errors: 401; 403 ownerless; 404 unknown/unowned.
- Legacy: apps/server/src/app/api/repositories/[id]/route.js

### API-074 — Link a Repository to a Project
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-004-001, FR-004-002
- Method/path: `POST /api/repositories/link` with `{ projectId, repoId, role?, pathScope?, branch? }`.
- Auth/scope: write authority over the Project's and the Repository's Business.
- Errors: 400; 401; 403 ownerless/ungoverned; 404.
- Legacy: apps/server/src/app/api/repositories/link/route.js

### API-073 — Unlink a Repository
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-004-001
- Method/path: `DELETE /api/repositories/link/[id]` — Project write authority. Errors: 401; 404.
- Legacy: apps/server/src/app/api/repositories/link/[id]/route.js

### API-066 — Project Team
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-004-003, FR-004-004
- Method/path: `GET|POST|PATCH|DELETE /api/projects/[id]/team`
- Request: POST `{ personId, role? }`; PATCH `{ membershipId, role }` (same role only); DELETE `{ membershipId }`.
- Response: GET → memberships (Business-scoped + tenant-wide, with `mutable` flag) and per-person active assignee load; mutations → the Membership / `{ id }`.
- Auth/scope: GET `seesBusiness`; mutations `ownsBusiness` over the Project's Business; Group-workspace Projects read-only.
- Errors: 400 duplicate / read-only scope / unknown Person; 401; 404; 409 `ROLE_CHANGE_MOVED_TO_PERMISSIONS`.
- Legacy: apps/server/src/app/api/projects/[id]/team/route.js

## Progress

### API-050 — Workstream progress
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-005-001, FR-005-002, FR-005-004
- Method/path: `GET /api/progress/workstream/[id]`
- Response: `{ percent, evidence{strategy, …inputs, formula}, warnings[] }` (refreshes `progressCache`).
- Auth/scope: Project readable. Errors: 401; 404 unknown/deleted/invisible.
- Legacy: apps/server/src/app/api/progress/workstream/[id]/route.js

### API-049 — Project roll-up
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-005-003, FR-005-004
- Method/path: `GET /api/progress/project/[id]`
- Response: `{ percent, totalWeight, workstreams[{…workstream result, progressWeight}], warnings, formula }`.
- Auth/scope: Project readable. Errors: 401; 404.
- Legacy: apps/server/src/app/api/progress/project/[id]/route.js

### API-048 — Installation portfolio roll-up
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-005-003
- Method/path: `GET /api/progress/portfolio`
- Response: per-Business and overall roll-up (reporting only; not a shell scope).
- Auth/scope: `isOperator` only. Errors: 401; 403 non-operator.
- Legacy: apps/server/src/app/api/progress/portfolio/route.js

### API-052 — Project-contained dependency graph
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-006-003
- Method/path: `GET /api/projects/[id]/dependencies`
- Response: `{ project, nodes[{type,id,code,title,status}], edges[{id,source,target,dependencyType}] }` restricted to edges whose endpoints both belong to the Project.
- Auth/scope: Project readable. Errors: 401; 404.
- Legacy: apps/server/src/app/api/projects/[id]/dependencies/route.js

## Plan intake

Common to this section: the viewer is either an Enterprise API key principal (FEAT-008)
or a session viewer; the target Workspace is resolved from `workspaceId` or `projectId` and
authorized before the plan is parsed (FR-007-004).

### API-039 — Dry-run a PlanEnvelope
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-007-001, FR-007-002, FR-007-004, FR-008-002
- Method/path: `POST /api/import/dry-run`
- Request: `{ plan: PlanEnvelope, workspaceId? , projectId? }`.
- Response: `{ valid, errors[], preview{ inserts[], updates[], conflicts[] } | null }`; never writes.
- Auth/scope: session viewer or API key; `ownsBusiness` over the target Business (key: target Business in the key's Tenant).
- Errors: 401; 404 unknown/unowned target; 403 above-Business target; validation failures are reported in-body (`valid:false`).
- Legacy: apps/server/src/app/api/import/dry-run/route.js

### API-038 — Commit a PlanEnvelope
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-007-003, FR-007-004, FR-008-002, FR-010-004
- Method/path: `POST /api/import/commit`
- Request: `{ plan, workspaceId?, projectId? }`.
- Response: `{ committed: true, projectId, executionRunId, receipt…, counts }` or `{ committed: false, errors[], preview }`.
- Auth/scope: as dry-run. Idempotency: schemaVersion 1.2 `trace.idempotencyKey` + payload hash.
- Errors: 401; 403; 404; idempotency conflict in-body; 500 on transaction failure (rolled back).
- Legacy: apps/server/src/app/api/import/commit/route.js

### API-041 — Convert and dry-run a workbook
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-007-007, FR-007-004
- Method/path: `POST /api/import/xlsx` (multipart: `file`, `workspaceId?`, `projectId?`)
- Response: `{ valid:false, errors[], envelope:null }` on conversion errors, else dry-run result plus `envelope`.
- Auth/scope: session viewer; target authorized in the dry run.
- Errors: 400 no file; 401; 404/403 target; 500 unreadable workbook.
- Legacy: apps/server/src/app/api/import/xlsx/route.js

### API-040 — Download the Excel plan template
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-007-007
- Method/path: `GET /api/import/template` → `zuri-ai-plan-template.xlsx` (sheets and dropdowns generated from the schema and enums).
- Auth/scope: any authenticated viewer. Errors: 401.
- Legacy: apps/server/src/app/api/import/template/route.js

## Enterprise API

### API-075 — Resolve an external id or code
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-008-003, FR-008-002
- Method/path: `GET /api/resolve?system=&value=` or `GET /api/resolve?type=&code=`
- Response: `{ id, code, type, externalRef{system,value,labelAs,verifiedAt} }` or `{ id, code, type, externalRefs[] }`.
- Auth/scope: API key (record in key's Tenant) or session (record readable/visible).
- Errors: 400 only one of system/value; 401; 404 unmapped/invisible; 410 dangling mapping (operator only).
- Legacy: apps/server/src/app/api/resolve/route.js

### API-047 — OpenAPI document
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-008-004
- Method/path: `GET /api/docs` → OpenAPI JSON for the public PRJ surface (`Cache-Control: no-store`).
- Auth/scope: API key or session; loopback hosts exempt.
- Errors: 401.
- Legacy: apps/server/src/app/api/docs/route.js

### API-005 — Dry-run an ExecutionPlanBundle
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-009-001, FR-009-002, FR-009-003
- Method/path: `POST /api/import/bundle/dry-run`
- Request: `{ bundle: ExecutionPlanBundle }` (strategy, projects[] of PlanEnvelope entries, dependencies[], scope, trace).
- Response: combined preview `{ committable, errors[], conflicts[], strategy preview, projects[{ preview, pendingGoalRefs }], dependencies[] }`; never writes.
- Auth/scope: session `ownsBusiness` or Tenant API key; strategy writes require owner authority (conflict otherwise).
- Errors: 401; 404/403 scope refusal; validation in-body.
- Legacy: apps/server/src/app/api/import/bundle/dry-run/route.js

### API-004 — Commit an ExecutionPlanBundle atomically
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-009-004
- Method/path: `POST /api/import/bundle/commit`
- Request: as dry-run; `trace.idempotencyKey` recommended (required for replay).
- Response: bundle receipt `{ committed, bundle receipt, per-Project receipts[], audit ids }` or `{ committed:false, errors }`.
- Errors: 401; 403/404; 409 declared code taken; idempotency mismatch refusal; 500 rolled back.
- Legacy: apps/server/src/app/api/import/bundle/commit/route.js

## Execution roadmap, agents and trace

### API-065 — Execution Roadmap read model
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-010-001
- Method/path: `GET /api/projects/[id]/roadmap`
- Response: strict `RoadmapBoardContract` v1.0 — `project`, `goals`, `risks`, `summary`, `sources`, `plans[]`, `containers[]`, `items[]`, `dependencies[]`, `identityRefs`, `roster`, `closure`; unowned fields carry `{ state: 'UNAVAILABLE', reason }`.
- Auth/scope: Project readable. Errors: 401; 404.
- Legacy: apps/server/src/app/api/projects/[id]/roadmap/route.js

### API-042 — Project Manager MCP endpoint
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-010-002
- Method/path: `POST /api/mcp` (JSON-RPC 2.0; header `Mcp-Session-Id` echoed).
- Request: `initialize` | `notifications/initialized` | `tools/list` | `tools/call {name, arguments}`; PM tools `project_manager.plan_dry_run`, `plan_commit`, `work_read`, `work_status_update`; the same transport also hosts `data_pipeline.*` (DOM-INT, FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005) and `knowledge.*` tools (DOM-KNW, FR-073-001).
- Auth/scope: session viewer required; re-resolved per call; each tool applies its service's authorization.
- Errors: HTTP 400 + -32700 parse error; 401/-32001 no viewer; 503 session store unavailable; -32601 unknown method; tool errors as JSON-RPC errors.
- Legacy: apps/server/src/app/api/mcp/route.js

### API-044 — Dry-run meeting actions
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-010-003
- Method/path: `POST /api/import/meeting-actions/dry-run` with `{ intake: meeting-action-intake.v1, workspaceId?, projectId? }`.
- Response: dry-run result plus `{ contract, warnings[], plan, source{app, personId} }`.
- Auth/scope: API key or session; standard import target authorization.
- Errors: 400 contract violation; 401; 404/403 target.
- Legacy: apps/server/src/app/api/import/meeting-actions/dry-run/route.js

### API-043 — Commit meeting actions
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-010-003, FR-010-004
- Method/path: `POST /api/import/meeting-actions/commit` (same body); commits as trace source `MEETING_ACTION`.
- Response: commit result plus `{ contract, warnings[], source }`.
- Errors: as dry-run; idempotency conflict in-body.
- Legacy: apps/server/src/app/api/import/meeting-actions/commit/route.js

### API-024 — Read an execution run
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-010-004
- Method/path: `GET /api/projects/[id]/execution-runs/[executionRunId]`
- Response: run with ordered steps (ids, keys, attempts, hashes, status, failure fields, replay lineage).
- Auth/scope: Project readable. Errors: 401; 404 unknown run or run of another Project.
- Legacy: apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/route.js

### API-025 — Replay an execution run
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-010-005
- Method/path: `POST /api/projects/[id]/execution-runs/[executionRunId]/replay` with `{ mode: 'full'|'partial', stepKeys? }`.
- Response: commit result of the replay with new `executionRunId`, `replayOfExecutionRunId`, `trace`.
- Auth/scope: Project write authority (via the import pipeline).
- Errors: 400 invalid JSON / `TRACE_PARTIAL_STEP_NOT_REPLAYABLE` / `TRACE_PARTIAL_BUNDLE_NOT_REPLAYABLE`; 401; 404.
- Legacy: apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/replay/route.js

### API-023 — List approvals of a run
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-011-002
- Method/path: `GET /api/projects/[id]/execution-runs/[executionRunId]/approvals`
- Response: approval DTOs (state, action class, effect key, redacted summary, expiry, requester, decision) for that run.
- Auth/scope: Project readable. Errors: 401; 404.
- Legacy: apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/approvals/route.js

### API-022 — Approve or reject
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-011-002
- Method/path: `POST /api/projects/[id]/execution-runs/[executionRunId]/approvals/[approvalRequestId]/decision` with `{ decision: 'APPROVE'|'REJECT', reason? }`.
- Response: `{ approval }` or `{ approval, idempotent: true }`.
- Auth/scope: reviewer ≠ requester, holding the eligible capability in the approval Business (re-resolved now).
- Errors: 400 invalid JSON; 401; 403 `REVIEWER_NOT_ELIGIBLE` / `SCOPE_NOT_ALLOWED`; 404; 409 `REVIEWER_CONFLICT`, `APPROVAL_EXPIRED`, `APPROVAL_ALREADY_DECIDED`.
- Legacy: apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/approvals/[approvalRequestId]/decision/route.js

## Project read models

### API-064 — Project inventory snapshot
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-012-001, FR-012-002
- Method/path: `GET /api/projects/[id]/inventory?page=&limit=` (limit default 100, max 500)
- Response: `PROJECT_INVENTORY` v1.0 — `project`, `workstreams`, `containers`, `items`, `milestones`, `gates`, `dependencies`, `files`, `repositories`, `team`, `progress`, `activity`; each collection `{ status, items, page, limit, truncated, nextPage, reasonCode }`.
- Auth/scope: `seesBusiness` for owned Projects; ownerless Projects only inside a visible scope.
- Errors: 400 invalid query; 401; 404 unknown/unauthorized.
- Legacy: apps/server/src/app/api/projects/[id]/inventory/route.js

### API-053 — Project execution domains
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-013-001, FR-013-002
- Method/path: `GET /api/projects/[id]/domain-view`
- Response: versioned `ProjectDomainView` — `domains[{ domainId, label, state (MAPPED|UNMAPPED), primaryWorkstreamCount, supportingWorkstreamCount, activeWorkItemCount, … UNAVAILABLE feature/blocker fields }]`, `technicalOwners[]`, root `uniqueActiveWorkItemCount`, `unboundWorkstreamCount`, `progress`.
- Auth/scope: Project readable (roadmap guard). No side effects.
- Errors: 401 `AUTH_REQUIRED`; 404 `RESOURCE_NOT_FOUND` (redacted, identical for missing/deleted/foreign/invalid hierarchy).
- Legacy: apps/server/src/app/api/projects/[id]/domain-view/route.js

## Project features

Common to this section (FR-014-005): mutations require a live session, header
`x-csrf-token` valid for that session (IAM API-write CSRF), exact configured `Origin`,
`Idempotency-Key`, and `If-Match` (Feature version, or the Project feature-graph ETag for
Project-targeted operations); authority = owner of the Project's Business or installation
operator, re-checked after the Project lock. Responses carry a typed mutation receipt.
Error envelope codes: 400 `MALFORMED_REQUEST`, 401 `AUTH_REQUIRED`, 403 `CSRF_INVALID` /
`CAPABILITY_DENIED`, 404 `RESOURCE_NOT_FOUND` (redacted), 409 `IDEMPOTENCY_KEY_REUSED` /
`DUPLICATE_FEATURE_CODE` / `DELETED_FEATURE_CODE_REQUIRES_RESTORE` / `CHILD_SET_CONFLICT` /
`ALLOCATION_RESTORE_CONFLICT`, 412 `VERSION_MISMATCH`, 422 validation codes
(`INVALID_ALLOCATION`, `CROSS_PROJECT_WORK_LINK`, `GRAPH_MEMBERSHIP_MISMATCH`,
`REQUIREMENT_REVISION_MISMATCH`, `SNAPSHOT_REQUIRED`, `SNAPSHOT_INVALID`, `DOMAIN_ID_UNRECOGNIZED`,
`PRIMARY_DOMAIN_DUPLICATE`, `INVALID_LIFECYCLE`, `FEATURE_LIMIT_REACHED`), 428
`PRECONDITION_REQUIRED`, 503 `SESSION_UNAVAILABLE` / `DATA_INTEGRITY_UNAVAILABLE` (retryable).

### API-058 — Project Feature view
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-006
- Method/path: `GET /api/projects/[id]/feature-view?featureId=`
- Response: Features with domains, deduplicated WorkItem contributions, pinned evidence, weighted progress, aggregate snapshot `UNAVAILABLE`.
- Auth/scope: Project reader (scope-first). Errors: 401; 404.
- Legacy: apps/server/src/app/api/projects/[id]/feature-view/route.js

### API-061 — List or create Features
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-001, FR-014-006
- Method/path: `GET /api/projects/[id]/features?cursor&limit&visibility=LIVE|DELETED`, `POST /api/projects/[id]/features`
- Request (POST): `{ code, title, problem, outcome, primaryDomainId, canonicalFeatureKey?, governanceSnapshotId?, lifecycle? }`.
- Response: GET → signed-cursor page; POST → 201 Feature + receipt.
- Auth/scope: GET reader (DELETED owner only); POST owner mutation contract.
- Legacy: apps/server/src/app/api/projects/[id]/features/route.js

### API-054 — Read, edit or delete a Feature
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-001, FR-014-004, FR-014-006
- Method/path: `GET|PATCH|DELETE /api/projects/[id]/features/[featureId]`
- Request (PATCH): `{ title?, problem?, outcome?, primaryDomainId?, lifecycle? }`; DELETE soft-deletes the cohort.
- Legacy: apps/server/src/app/api/projects/[id]/features/[featureId]/route.js

### API-057 — Restore a deleted Feature
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-004
- Method/path: `POST /api/projects/[id]/features/[featureId]/restore` (mutation contract). Errors add 409 `ALLOCATION_RESTORE_CONFLICT`.
- Legacy: apps/server/src/app/api/projects/[id]/features/[featureId]/restore/route.js

### API-055 — Replace domain contributions
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-002
- Method/path: `PUT /api/projects/[id]/features/[featureId]/contributions` with `{ contributions[{domainId, responsibility}] }` (≤ 200).
- Legacy: apps/server/src/app/api/projects/[id]/features/[featureId]/contributions/route.js

### API-059 — Replace a Feature's WorkItem links
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-002
- Method/path: `PUT /api/projects/[id]/features/[featureId]/work-links` with `{ allocationMode, links[{workItemId, allocationBps|null}] }`.
- Legacy: apps/server/src/app/api/projects/[id]/features/[featureId]/work-links/route.js

### API-060 — Replace the Feature↔WorkItem graph
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-002
- Method/path: `PUT /api/projects/[id]/feature-work-links` with `{ allocationMode, affectedWorkItemIds[≤200], featureSets[≤50]{featureId, links[]} }`; `If-Match` = Project feature-graph ETag.
- Legacy: apps/server/src/app/api/projects/[id]/feature-work-links/route.js

### API-056 — Replace requirement bindings
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-002
- Method/path: `PUT /api/projects/[id]/features/[featureId]/requirement-bindings` with `{ bindings[{governanceSnapshotId, sourceNamespace, requirementKey, revisionHash, acceptanceRef}] }`.
- Legacy: apps/server/src/app/api/projects/[id]/features/[featureId]/requirement-bindings/route.js

### API-037 — List or capture governance snapshots
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-014-003
- Method/path: `GET /api/projects/[id]/governance-snapshots?cursor&limit` (owner only), `POST /api/projects/[id]/governance-snapshots` (capture for a ProjectRepository/checkout binding; mutation contract).
- Response: snapshot DTOs (commitSha, manifestHash, verifier, validationStatus, capturedAt/verifiedAt) / capture receipt with the committed snapshot.
- Legacy: apps/server/src/app/api/projects/[id]/governance-snapshots/route.js

## Projects dashboard & teams

### API-070 — Projects Dashboard
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-015-001, FR-015-002
- Method/path: `GET /api/projects/overview?businessId&workspaceId`
- Response: `{ band{ projects{total, byStatus, other}, work{total, byStatus, other}, teams, people }, items[{ id, code, name, size, space, streams, status, progress, targetAt, pic, priority }], topPriority{ items[≤5], reason? } }`.
- Auth/scope: `seesBusiness` for the Business (Workspace must belong to it).
- Errors: 400 invalid query; 401; 404 invisible scope.
- Legacy: apps/server/src/app/api/projects/overview/route.js

### API-080 — List or create Teams
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-015-005
- Method/path: `GET /api/teams?businessId=`, `POST /api/teams` with `{ businessId, name, code?, description? }`.
- Auth/scope: GET `seesBusiness` (+ `manageable`); POST `ownsBusiness`. Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/teams/route.js

### API-078 — Read, update or archive a Team
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-015-005
- Method/path: `GET|PATCH|DELETE /api/teams/[id]` (DELETE = soft archive; ProjectTeam rows kept for audit).
- Auth/scope: read `seesBusiness`; write `ownsBusiness`. Errors: 401; 404.
- Legacy: apps/server/src/app/api/teams/[id]/route.js

### API-079 — Add or remove Team members
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-015-005
- Method/path: `POST|DELETE /api/teams/[id]/members` with `{ personId }`.
- Auth/scope: `ownsBusiness`; Person must hold a Membership in the Business scope.
- Errors: 401; 404 Team/Person/member not found; 409 already a member.
- Legacy: apps/server/src/app/api/teams/[id]/members/route.js

### API-067 — Teams attached to a Project
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-015-005
- Method/path: `GET|POST|DELETE /api/projects/[id]/teams` (body `{ teamId }` for POST/DELETE).
- Auth/scope: read `seesBusiness`; attach/detach Project write authority + Team write authority, same Business.
- Errors: 400 cross-Business; 401; 404; 409 already attached.
- Legacy: apps/server/src/app/api/projects/[id]/teams/route.js

## Files

Common to this section: reads filter by the viewer's `visibleBusinessIds`; writes require
`ownsBusiness` over the asset's Business (FR-017-002).

### API-063 — Project files (compatibility)
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-001, FR-017-008
- Method/path: `GET|POST /api/projects/[id]/files`
- Request (POST): `{ name, mime, size, url? , blobRef?, workItemId? }` (url or blobRef required).
- Response: GET → legacy ProjectFiles merged with the Project's managed assets (legacy DTO shape); POST → created ProjectFile.
- Errors: 400; 401; 404 unknown/unowned Project.
- Legacy: apps/server/src/app/api/projects/[id]/files/route.js

### API-062 — Delete a Project file
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-001
- Method/path: `DELETE /api/projects/[id]/files/[fileId]`. Errors: 401; 404.
- Legacy: apps/server/src/app/api/projects/[id]/files/[fileId]/route.js

### API-030 — List or ingest managed assets
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-002, FR-017-003
- Method/path: `GET /api/files?businessId|projectId`, `POST /api/files`
- Request (POST): `{ businessId, projectId?, workItemId?, storageKind, name, mime, size, mountId?, relativePath?, contentBase64?, externalUrl?, blobRef?, sha256?, code? }`.
- Response: asset DTOs / created asset (ACTIVE, or QUARANTINED on filesystem failure).
- Errors: 400 validation / size mismatch / path security; 401; 404 not visible / not owned; 500 promotion failure.
- Legacy: apps/server/src/app/api/files/route.js

### API-026 — Delete a managed asset
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-002
- Method/path: `DELETE /api/files/[id]` (soft, audited). Errors: 401; 404.
- Legacy: apps/server/src/app/api/files/[id]/route.js

### API-027 — Stream asset content
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-004
- Method/path: `GET /api/files/[id]/content` → bytes with `Cache-Control: private, no-store` and `X-Content-Type-Options: nosniff`. Raster images and PDF are served inline; `text/*` as `text/plain`; every other type, SVG included, as an attachment. A restrictive sandboxing CSP applies to everything except PDF.
- Auth/scope: asset visible; ACTIVE LOCAL_FILE or MANAGED_BLOB only.
- Errors: 404 not found/invisible; 400 otherwise (see FEAT-017 §9).
- Legacy: apps/server/src/app/api/files/[id]/content/route.js

### API-028 — Relink a missing asset
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-005
- Method/path: `POST /api/files/[id]/relink` with `{ mountId, relativePath }` (contained path, explicit confirmation). Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/files/[id]/relink/route.js

### API-029 — Reveal in OS file explorer
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-006
- Method/path: `POST /api/files/[id]/reveal` with `{ intent: 'reveal' }`; loopback host and same-origin loopback `Origin` required; `ZURI_LOCAL_FILE_BRIDGE=1`.
- Response: `{ revealed: true, fileId }`. Errors: 400 capability/host/origin/state refusal; 401; 404.
- Legacy: apps/server/src/app/api/files/[id]/reveal/route.js

### API-031 — Rebuild disposable file cache
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-005
- Method/path: `POST /api/files/cache/rebuild` with `{ businessId, mountId }`; owner of the Business. Errors: 401; 404.
- Legacy: apps/server/src/app/api/files/cache/rebuild/route.js

### API-032 — Migrate ProjectFiles to managed assets
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-007
- Method/path: `POST /api/files/migrate` with `{ confirm?: boolean }` → report `{ migrated[], rejected[], conflicts[] }`.
- Auth/scope: installation operator only (non-operators get 404).
- Legacy: apps/server/src/app/api/files/migrate/route.js

### API-033 — Local workspace mounts
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-003
- Method/path: `GET /api/files/mounts?businessId=` (visible), `POST /api/files/mounts` with `{ businessId, deviceKey, rootPath, status? }` (owner; absolute root).
- Errors: 400 invalid root; 401; 404.
- Legacy: apps/server/src/app/api/files/mounts/route.js

### API-034 — Reconcile disk and database
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-005
- Method/path: `POST /api/files/reconcile` with `{ businessId, mountId, confirm? }` → dry-run report (missing, untracked) or applied changes; owner of the Business.
- Legacy: apps/server/src/app/api/files/reconcile/route.js

### API-007 — Business File Manager
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-017-008, FR-017-009
- Method/path: `GET /api/business/files?businessId=` → `{ assets[], groups[BUSINESS|PROJECT] }` with `createdAt/updatedAt`.
- Auth/scope: Business visible. Errors: 401; 404.
- Legacy: apps/server/src/app/api/business/files/route.js

## Business strategy

Common to this section: writes require `ownsBusiness` over the target Business (an unowned
Business is refused exactly like an unknown one) and are audited; declared codes
already in use → 409.

### API-017 — Business strategy read model
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-001
- Method/path: `GET /api/business/strategy?businessId=`
- Response: `{ business, roadmaps[{ …, horizons[{ key, label, position, goals[{ …, keyResults[], projects[] }] }] }], projects[] }`.
- Auth/scope: Business in the viewer's visible set. Errors: 400 missing id / not visible; 401; 404.
- Legacy: apps/server/src/app/api/business/strategy/route.js

### API-016 — Create a Roadmap
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-002
- Method/path: `POST /api/business/roadmaps` with `{ businessId, title, code?, description?, status?, startAt?, targetAt?, horizons[2..3]{ key, label, position, description?, targetAt? } }`.
- Errors: 400 cardinality/duplicate key or position; 401; 409 code taken.
- Legacy: apps/server/src/app/api/business/roadmaps/route.js

### API-015 — Update a Roadmap
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-002
- Method/path: `PATCH /api/business/roadmaps/[id]` (fields + optional `horizons` reconciled by key).
- Errors: 400 cardinality / horizon with goals removed; 401; 404.
- Legacy: apps/server/src/app/api/business/roadmaps/[id]/route.js

### API-012 — Create a Goal
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-003
- Method/path: `POST /api/business/goals` with `{ businessId, horizonId, roadmapId?, title, code?, description?, status?, priority?, progress?, perspective?, startAt?, targetAt? }`.
- Errors: 400; 401; 404; 409 code taken.
- Legacy: apps/server/src/app/api/business/goals/route.js

### API-008 — Update a Goal
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-003
- Method/path: `PATCH /api/business/goals/[id]`. Errors: 400 horizon/roadmap mismatch; 401; 404; 409 manual progress while Key Results exist.
- Legacy: apps/server/src/app/api/business/goals/[id]/route.js

### API-011 — Link a Project to a Goal
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-004
- Method/path: `POST /api/business/goals/[id]/projects` with `{ projectId }` (same Business). Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/business/goals/[id]/projects/route.js

### API-010 — Unlink a Project from a Goal
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-004
- Method/path: `DELETE /api/business/goals/[id]/projects/[projectId]`. Errors: 401; 404.
- Legacy: apps/server/src/app/api/business/goals/[id]/projects/[projectId]/route.js

### API-009 — Add a Key Result
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-005
- Method/path: `POST /api/business/goals/[id]/key-results` with `{ title, metric, unit, baseline, target, direction?, dueAt?, ownerPersonId?, confidence?, code? }`.
- Errors: 400 target = baseline; 401; 404; 409 code taken.
- Legacy: apps/server/src/app/api/business/goals/[id]/key-results/route.js

### API-013 — Update a Key Result
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-005
- Method/path: `PATCH /api/business/key-results/[id]`. Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/business/key-results/[id]/route.js

### API-014 — Weekly check-in
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-019-006
- Method/path: `POST /api/business/key-results/[id]/check-ins` with `{ value, confidence, note?, source? }` — upsert for the current Bangkok week; recomputes goal progress in the same transaction.
- Errors: 400; 401; 404.
- Legacy: apps/server/src/app/api/business/key-results/[id]/check-ins/route.js

## Audit & backup

### API-001 — Audit event browser
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-021-002
- Method/path: `GET /api/audit?entityType&entityId&limit` (limit ≤ 500)
- Response: `{ events[{ …, payload }], limit, truncated, entityTypes[] }`, newest first.
- Auth/scope: installation operator; the read itself is recorded as operator use.
- Errors: 401; 403 non-operator.
- Legacy: apps/server/src/app/api/audit/route.js

### API-002 — Export an installation snapshot
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-021-003
- Method/path: `GET /api/backup/export?includeBinaryContent=1?`
- Response: snapshot `{ schemaVersion: '1.0', exportedAt, models{…rows}, recovery manifests, binary content? }`.
- Auth/scope: installation operator (use recorded). Errors: 401; 403.
- Legacy: apps/server/src/app/api/backup/export/route.js

### API-003 — Preview or restore a snapshot
Owner: DOM-PRJ
Relations: owned_by: DOM-PRJ; implements: FR-021-004
- Method/path: `POST /api/backup/import` with `{ snapshot, remounts?[{ businessId, deviceKey, rootPath }], confirm?: true }`.
- Response: preview `{ valid, errors[], counts, gaps }`; without `confirm` → `needsConfirmation: true`; with `confirm` → `{ restored: true|false, … }`.
- Auth/scope: installation operator for both preview and restore.
- Errors: 400 invalid snapshot/remount; 401; 403; 500 rolled back.
- Legacy: apps/server/src/app/api/backup/import/route.js
