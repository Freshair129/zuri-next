---
title: Projects & Work — decisions
owner: DOM-PRJ
status: draft
---

# Decisions — DOM-PRJ
Converted from legacy ADRs still in force. Not converted: legacy legacy:ADR-006 (retired — the V1
shell lift it planned never happened; legacy ADR-101 retired the lift with zero modules lifted)
and legacy ADR-058 (the Codex-mediated SmartGift pipeline bridge governs the data-pipeline
tracking lane owned by DOM-INT, not this domain). See `registry/crosswalk/PRJ.csv`.
### ADR-001 — Business-centric shell with a dual ERP/PM lens
Owner: DOM-PRJ
Status: approved
Context: Comparable PM tools make "Workspace" the top container and ERPs make the company the
root; Project/Campaign is always a module, never the app root. Zuri's schema used "Workspace"
for a level below Business, which made navigation incoherent. Zuri is ERP-shaped (legal
entities, branches, several businesses per owner) yet ships a project module.
Decision:
- Business is the operational anchor; the app root is a Business Overview, and project
  management is one domain among the Business's domains.
- One schema, two presentation lenses (ERP default, PM alternative) that change labels only;
  Portfolio/Group is consolidation, Legal Entity/Branch are the financial/operational anchors.
- No persistent topbar scope dropdowns; scope is chosen before the shell and shown in context.
- Project (Projects & Work domain) and Campaign (Marketing domain) are different domains.
Consequences:
- Shell mode, topbar, breadcrumb and domain bar are Business-scoped (FEAT-002).
- The lens is per-user client state and never an authorization input.
Legacy: ADR-008

### ADR-002 — Context bar with a Business scope ceiling
Owner: DOM-PRJ
Status: approved
Context: Two meanings of "Workspace" and Project behaving like a shell level made a Project
look like the parent of its own module sidebar.
Decision:
- The context bar has exactly three levels: Group (Portfolio) › Organization (Tenant, a label
  only — `tenantId` stays the isolation boundary) › Business.
- The shell stops at Business. Schema Workspace ("Space") and Project are resources inside the
  Projects & Work domain, never shell scope, topbar controls, breadcrumb switchers or sidebar parents.
- ERP domains are Business-bound; route keys and grants are unchanged by display labels.
- Profile is identity, not a context level.
Consequences:
- A Business is selected before the Business shell mounts (entry routing is DOM-IAM).
- Writes on Workspaces above Business have no declared authority (BR-002).
Legacy: ADR-011

### ADR-003 — Project work views and the dependency boundary
Owner: DOM-PRJ
Status: approved (legacy status "Proposed"; implemented)
Context: Projects need a WBS and a dependency graph without adding Development sidebar entries
or making Project a shell parent; the model already has the hierarchy and typed, cycle-checked edges.
Decision:
- Structure Plan and Dependency Map are sub-views of the Project's Work area.
- Structure Plan renders Project → Workstream → WorkContainer → WorkItem; no sub-project model.
- The Project Dependency Map shows only edges whose two endpoints belong to that Project;
  cross-project edges stay in the Business-wide register.
- No new model, migration or dependency type; the existing self/cycle guard stays the mutation authority.
- Every visualisation has an accessible non-canvas equivalent.
Consequences:
- FEAT-006 views are read-only projections; editing arrives only through FEAT-016.
Legacy: ADR-012

### ADR-004 — Business-first Overview and Business strategy
Owner: DOM-PRJ
Status: approved
Context: `/overview` rendered a group roll-up with one card per Business, violating the Business
shell boundary and leaving no place for Business-level direction above projects.
Decision:
- `/overview` is always one Business; without a selection it shows a Business-required state,
  never a group card grid. Portfolio roll-up remains a reporting API only.
- Strategy is Business-owned: Roadmaps with two or three ordered horizons, Goals under horizons,
  Goals linked to many Projects through ProjectGoal.
- HR/People is a peer domain (route key `people`), not part of Projects & Work.
- No new Organization entity; all reads filter by visible Business ids.
Consequences:
- Business Home (FEAT-018) absorbed `/overview` as its Dashboard (legacy FR-018-002, FR-018-003 decision 1).
- Horizon cardinality is enforced in the service (FEAT-019).
Legacy: ADR-013

### ADR-005 — Project Business ownership and Space context
Owner: DOM-PRJ
Status: approved
Context: Projects stored only `workspaceId`, inferring Business ownership through a lower-level
resource and letting shared Spaces look like parents of Business projects.
Decision:
- `Project.businessId` is the direct owner; `workspaceId` is the Space grouping.
- Ordinary projects satisfy `project.businessId = workspace.businessId` with a BUSINESS Space;
  a null owner is allowed only in PORTFOLIO/TENANT Spaces and is never attributed to a Business.
- Create/update/import derive the owner from the Space and reject divergence; cross-Business moves fail closed.
- Inside a Project page Business is the primary context; Space is secondary metadata.
Consequences:
- BR-003; the governing Business for authorization is the Project owner (BR-002).
Legacy: ADR-014

### ADR-006 — Relational authority and the managed local file workspace
Owner: DOM-PRJ
Status: approved
Context: Users need real files in ordinary folders and Business/Project File Manager views,
without the filesystem or a JSON mock becoming a second writable source of truth.
Decision:
- The relational database is the only authority for file identity, ownership, links, status,
  versions and audit (legacy text: SQLite; production runs PostgreSQL with identical semantics).
- The filesystem holds real content plus disposable cache/temp under `.zuri/`; relative paths are
  portable, absolute roots are device-local.
- One asset, many views, never a copied file; cache is non-authoritative and rebuildable.
- File mutations are staged and reconciled; paths fail closed; OS access (reveal) is an explicit
  local capability, never assumed by a web route.
- Legacy ProjectFile rows migrate, never silently erased; backup separates metadata from content.
Consequences:
- FEAT-017; legacy BR-055, SEC-006, NFR-009 apply.
Legacy: ADR-016

### ADR-007 — Human-visible execution roadmap
Owner: DOM-PRJ
Status: approved
Context: Humans must answer, from an opened Project, which phase is active, what is blocked and why,
and whether a phase closed — seeing the same execution structure agents produce.
Decision:
- Execution Roadmap is a Project Work view composed over the existing model, not an agent console or aggregate.
- One hierarchy with mode-specific labels; Workstream is displayed as "Execution Plan".
- Humans and agents share the read contract, assignment contract and one intake pipeline;
  a Blueprint is optional after the objective and never a first-step template picker.
- Progress and closure are evidence-based; unavailable data is shown as unavailable.
Consequences:
- FEAT-010 FR-010-001; owners for Risk, Tag, criteria and closure decisions remain undeclared.
Legacy: ADR-028

### ADR-008 — Stable identity bindings for execution plans
Owner: DOM-PRJ
Status: approved (legacy status "Proposed"; the identity slice is implemented)
Context: Mode names, tag labels, "Execution Plan" and domain labels were at risk of being used as
identity, creating duplicates and cross-domain confusion.
Decision:
- Separate identity axes: product domain ids (primary/supporting), technical owner domain,
  `executionModeId`, versioned `executionContractId`, `planId` = Workstream UUID, goal/risk/tag ids,
  and typed supporting references — each distinct from execution-trace ids.
- Domain ids are stable catalogue ids, not labels or route keys; every plan carries a domain binding.
- Ids are resolved before authorization and commit; unknown ids fail closed; labels never create identities.
- Supporting identities are typed references, not a second graph.
Consequences:
- FR-010-006; references whose owner does not exist are refused rather than stored as free text.
Legacy: ADR-029

### ADR-009 — Project inventory read model
Owner: DOM-PRJ
Status: approved
Context: One Project needs a single operational read surface; existing routes have different
contracts that must not break, and source models have different scope properties.
Decision:
- Add one versioned outer DTO (`PROJECT_INVENTORY` 1.0) with independently bounded sections.
- No new aggregate; compose existing services and pure calculators; read-only, no external sync.
- Authorize before composition; failures do not reveal existence.
- Existing list and compatibility views stay unchanged.
Consequences:
- FEAT-012.
Legacy: ADR-034

### ADR-010 — Direct-manipulation pipeline canvas
Owner: DOM-PRJ
Status: proposed (design only; implementation not authorized)
Context: Users want to build structure and sequencing by dragging on one canvas, but a bare edge
promises nothing and a drag must not become a second write path.
Decision:
- Every dependency edge carries a Handoff Contract (deliverable + acceptance); no bare edge (legacy BR-062).
- Acceptance references an existing Gate when one expresses it, otherwise an explicit mark with provenance.
- Layout stays derived; no node positions are persisted.
- The canvas is the preview stage of the one intake pipeline (optimistic pending state = preview).
- Every drag has a single-pointer, keyboard-reachable equivalent (WCAG 2.2 SC 2.5.7).
- Existing edges without contract are legacy: shown "undeclared", never blocking.
Consequences:
- `Dependency` gains one nullable JSON column; the Board gains a release rule (FEAT-016).
Legacy: ADR-035

### ADR-011 — Projects dashboard and the fields it needs
Owner: DOM-PRJ
Status: approved (legacy status "Proposed"; implemented)
Context: The Projects page was asked to become a dashboard with size, priority, PIC and team
counts that the model could not honestly derive.
Decision:
- `/projects` becomes the domain Dashboard; the route keeps its name; "Overview" keeps meaning Business Home.
- Project size is defined as the count of non-deleted WorkItems.
- Priority is a first-class nullable field; Top 5 never substitutes deadline ordering.
- PIC is one accountable Person, distinct from team membership and assignees.
- Team count needs a real Team model (see ADR-012); one request serves the whole page.
Consequences:
- FEAT-015.
Legacy: ADR-036

### ADR-012 — Team is an organisational grouping, not an authority
Owner: DOM-PRJ
Status: approved (legacy status "Proposed"; implemented)
Context: The product had no Team; "project team" meant every Membership of the Business.
Merging grouping into Membership once let an unauthenticated POST mint owner authority.
Decision:
- Team records who works together and grants nothing: the identity resolver and route guards never read it (legacy BR-063).
- Team is Business-scoped; Team↔Project is many-to-many; TeamMembership is separate from Membership.
- Work is assigned to Persons, never Teams.
- The existing Project Team tab over Memberships keeps its meaning for now.
Consequences:
- A test asserts the identity resolver does not reference Team models; reconciliation with the Project Team tab is deferred.
Legacy: ADR-037

### ADR-013 — ExecutionPlanBundle import orchestration
Owner: DOM-PRJ
Status: approved
Context: PlanEnvelope is right for one Project but a programme plan must carry strategy, many
Projects and cross-Project dependencies in one artifact without a second writer.
Decision:
- `ExecutionPlanBundle` is a transport/package contract, not a persisted model and not a WorkContainer.
- PlanEnvelope remains the canonical per-Project unit; one orchestrator coordinates existing services.
- Bundle-local references are symbols, never authority; authorization precedes sensitive parsing or preview.
- Bundles are data only; dry run is bundle-wide with a single confirmation.
- Commit is atomic when one transaction can own all writes; idempotency and audit are first-class.
Consequences:
- FEAT-009; BR-006.
Legacy: ADR-049

### ADR-014 — Projects & Work hierarchical navigation
Owner: DOM-PRJ
Status: approved
Context: The owner defined navigation as domain bar → sidebar module → view tabs; the Projects
domain had duplicated rows of sections and views.
Decision:
- The domain displays "Projects & Work"; key, grant, root route and identities are unchanged.
- Six logical sidebar modules; planned modules show named capabilities without links.
- Existing destinations are placed in modules at their existing URLs; Import is one persistent Project action.
- Project context is a route resource, never a global selector; navigation is never authorization.
- Segment-boundary path matching; accessible, keyboard-operable navigation.
Consequences:
- FR-002-007; later Delivery Design tabs (Execution Domains, Features) activate inside this structure.
Legacy: ADR-096

### ADR-015 — Project Feature authority and write contract
Owner: DOM-PRJ
Status: approved (production gates open)
Context: Execution-domain projection cannot supply explicit Features with outcomes, domains,
WorkItem relationships and immutable requirement pins; tags or labels would create false identity.
Decision:
- DOM-PRJ owns six records: ProjectFeature, FeatureContribution, FeatureWorkLink, RequirementBinding,
  GovernanceSnapshot, ProjectFeatureMutationReceipt; DOM-IAM owns the API-write CSRF issuer/verifier.
- Every read, write and replay validates the full Tenant/Business/Workspace/Project chain; invalid scope is a redacted refusal.
- Mutations require live session, CSRF, exact Origin, scoped idempotency, Project lock, aggregate CAS and one atomic AuditEvent.
- Allocation is per WorkItem across Features; Feature data never changes weighted progress; restore refuses overflow.
- Requirement evidence only from a verified server-local Git checkout bound to a scoped ProjectRepository; Features are never synthesized.
Consequences:
- FEAT-014; production requires the runtime-role isolation gate.
Legacy: ADR-097

### ADR-016 — Business goals become OKR, SMART, Balanced Scorecard and 4DX
Owner: DOM-PRJ
Status: approved (phased; Phase 1 implemented, Phases 2–3 declared)
Context: The owner asked for OKR, SMART, KPI, Balanced Scorecard and 4DX goal tracking; Zuri
already owns BusinessRoadmap/Goal/ProjectGoal in this domain, so no second system of record is needed.
Decision:
- Extend BusinessGoal (as the Objective) with nullable `perspective` and `isWig`; add Business-prefixed
  child models (Key Results + check-ins, KPIs + observations, lead measures + values, weekly commitments, WIG sessions).
- Goal progress becomes a write-through cache derived from Key Results once any exist; manual patches are refused (legacy BR-089).
- SMART: Specific/Measurable/Time-bound are deterministic booleans; Achievable/Relevant are `null`.
- Phase 1 writes are OWNER-only; weeks start Monday 00:00 Asia/Bangkok; no Cycle model; at most two WIGs per Business (legacy BR-088).
- The standalone prototype stack is retired as a system of record.
Consequences:
- FEAT-019 (Phase 1) and FEAT-020 (Phases 2–3).
Legacy: ADR-101

### ADR-017 — PM execution trace and replay
Owner: DOM-PRJ
Status: proposed (legacy "Candidate"; implemented)
Context: PlanImportReceipt is an idempotency receipt, not a step/attempt authority; intake failures
could not be localized or replayed.
Decision:
- DOM-PRJ owns ProjectExecutionRun and ProjectExecutionStep (run → step + stepKey → attempt → audit event).
- Stable step keys: `plan.validate`, `plan.dry_run`, `plan.authorize`, `plan.commit`, `bundle.*`, `meeting.*`;
  failed runs record the failed step and mark the remainder explicitly.
- Snapshots are bounded and hold no transcripts, credentials or raw imported payloads.
- Existing receipts and transaction boundaries are preserved.
- Replay is append-only and revalidated; one read contract and one replay command.
Consequences:
- FR-010-004/005; AgentTraceEvent and PipelineRun remain outside DOM-PRJ.
Legacy: ADR-102

### ADR-018 — PM approval gateway admission
Owner: DOM-PRJ
Status: proposed (legacy "Candidate"; implemented locally, not deployed)
Context: Effectful agent/fleet steps need a human approval bound to the exact intent, without
reusing Gates, pipeline gate decisions or the agent journal.
Decision:
- DOM-PRJ owns the admission intent (one ProjectApprovalRequest projection); DOM-IAM owns reviewer capability; executors own leases and effect receipts.
- Approval binds one canonical SHA-256 digest over scope, run/step, action, hashes, effects, capability, policy and expiry.
- Admission is fail-closed and two-party (no self-approval), re-verified at decision and admission.
- State transitions are explicit, compare-and-set and append-only audited; replays never inherit approval.
- Read-only steps create no request.
Consequences:
- FEAT-011.
Legacy: ADR-103
