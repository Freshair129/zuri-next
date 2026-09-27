---
id: DOM-PRJ
title: Projects & Work
owner: DOM-PRJ
status: draft
legacy: [project-manager, business]
---

# DOM-PRJ — Projects & Work

## Purpose
Owns the scope chain every record in the product hangs from (Portfolio → Tenant → Business →
Workspace/Space → Project) and everything that plans and delivers work inside it: workstreams,
work containers and items, milestones, gates, dependencies, progress, plan intake, execution trace
and approvals, project features, files, the Business shell and navigation, Business Home and
Business strategy (roadmaps, goals, key results), and the installation's audit trail and snapshot
backup. It is the core of the back-office web console.

## Ubiquitous language
| Term | Meaning |
|---|---|
| Group (Portfolio) | Top container; consolidation level, never an operational scope |
| Organization (Tenant) | UI label for Tenant — the isolation boundary |
| Business | The operational anchor and shell-scope ceiling; governs authority for everything below it |
| Space (schema `Workspace`) | A grouping of Projects inside a Business (or a shared PORTFOLIO/TENANT Space) |
| Project | A unit of delivery with a direct Business owner (null only in shared Spaces) |
| Workstream / Execution Plan | One execution mode, progress strategy and weight inside a Project; `planId` = Workstream id |
| Execution mode | One of seven canonical modes (SOFTWARE_SPRINT, DATA_MIGRATION, B2B_SALES, B2C_CAMPAIGN, PRODUCT_LAUNCH, OPERATIONS, BUSINESS_EXPANSION) |
| WorkContainer | Mode-specific grouping (sprint, stage, pipeline, wave, phase, period, site) |
| WorkItem | A unit of work (task, deal, dataset, deliverable…) assigned to a Person |
| Gate | A checkpoint; a required open gate caps progress at 99 % |
| PlanEnvelope | The canonical per-Project intake document |
| ExecutionPlanBundle | Transport package of strategy + N PlanEnvelopes + cross-Project dependencies; never persisted |
| Governing Business | The Business whose owner may write a target (see BR-002) |
| Installation operator | Holder of a server-held platform grant; the only authority above Business |
| Handoff Contract | Declared deliverable + acceptance on a dependency edge (declared feature) |
| Business Home | Non-owning cross-domain dashboard of the selected Business (`/overview`) |
| Key Result (KR) | Measurable child of a Business Goal with weekly check-ins |
| Project Feature | Explicit, owner-declared Project outcome bound to domains, work and requirement pins |

## Owned data
| Entity | Summary |
|---|---|
| Portfolio | Top scope container (code, name) |
| Tenant | Isolation boundary under a Portfolio |
| LegalEntity | Legal/tax anchor under a Tenant (created by operators; field semantics specified by DOM-IAM legacy FR-031-002) |
| Business | Operating scope under a Tenant; `capabilitiesJson` feature flags; `version` |
| Branch | Operating site of a Business; optional tax registration branch |
| Workspace | Space with `scopeType` PORTFOLIO / TENANT / BUSINESS; `status` (ARCHIVED soft) |
| Project | `businessId?`, `workspaceId`, type, status, priority, PIC, dates, soft delete |
| Workstream | Mode, strategy, weight, advisory `progressCache`, identity bindings (mode/contract/domain ids) |
| WorkContainer | Nestable per-Workstream grouping with subtype and status |
| WorkItem | Subtype, status, assignee, weight, value, probability, metrics, soft delete, version |
| Milestone, Gate | Weighted milestones; gates with `required` and evidence |
| Dependency | Typed edge between two work endpoints (no scope column; derived from endpoints) |
| Repository, ProjectRepository | Business-owned source repositories and their Project links |
| Team, TeamMembership, ProjectTeam | Organisational grouping (grants nothing) |
| BusinessRoadmap, BusinessRoadmapHorizon, BusinessGoal, ProjectGoal | Business strategy |
| BusinessKeyResult, BusinessKeyResultCheckIn | OKR Key Results and weekly check-ins |
| ProjectFile | Legacy Project file reference (url/blobRef) |
| LocalWorkspaceMount, FileAsset, FileLink | Managed file workspace |
| PlanImportReceipt | Import idempotency/compatibility receipt |
| ProjectExecutionRun, ProjectExecutionStep | Intake trace and replay ledger |
| ProjectApprovalRequest | Approval gateway projection for effectful agent steps |
| ProjectFeature, FeatureContribution, FeatureWorkLink, RequirementBinding, GovernanceSnapshot, ProjectFeatureMutationReceipt | Project Feature authority |
| AuditEvent | Append-only audit log; DOM-PRJ defines shape and retention, every domain appends through its writer |

Declared but not yet in schema: BusinessKpi, BusinessKpiObservation, BusinessLeadMeasure,
BusinessLeadMeasureValue, BusinessWeeklyCommitment, BusinessWigSession (FEAT-020).
Listed in the legacy charter but specified by DOM-IAM: Employment, LegalEntityIdentifier,
TaxRegistrationBranch (legacy FR-031-001/FR-194); Membership is IAM-owned and written only through its grant contract.

## Business rules

### BR-001 — Writes go through audited application services
Owner: DOM-PRJ
Every DOM-PRJ write goes through a service in the application layer that records an AuditEvent
for the change (intended in the same transaction); route handlers stay thin and never write tables.
Relations: derived_from: SEC-003

### BR-002 — Authority is decided at the governing Business
Owner: DOM-PRJ
The governing Business of a target is derived from its Space (`workspace.businessId`), a Project via
its direct owner (else its Space), Workstream/Container/Item/Milestone/Gate via their Project, a
Dependency via BOTH endpoints, a Repository via its own `businessId`. Writes require
`ownsBusiness(viewer, governingBusiness)`. No authority above Business exists except the named
installation-operator capability; a target governed above Business is refused for every other
principal with the missing authority named; an unowned Business-governed target answers exactly like a
nonexistent one.
Relations: derived_from: SEC-001, SEC-007, BR-061

### BR-003 — Project owner matches its Space
Owner: DOM-PRJ
A Business-scoped Project's `businessId` equals its Space's `businessId`; PORTFOLIO/TENANT-shared
Projects keep a null owner and are never attributed to a Business; Projects never move across Businesses.
Relations: decided_by: ADR-005

### BR-004 — Views and dashboards are non-owning projections
Owner: DOM-PRJ
Read views and dashboards persist nothing (no column, order, card position or layout), recompute
every figure from the owning read model or pure calculators, never fall back to a wider scope, and
render an unavailable source explicitly — never as zero or an invented figure.
Relations: derived_from: NFR-005

### BR-005 — One source for enumerations
Owner: DOM-PRJ
Enumerated values have one source (`validation/enums`); every dropdown, board column, validator,
template and OpenAPI enum derives from it.

### BR-006 — PlanEnvelope is the canonical intake unit
Owner: DOM-PRJ
PlanEnvelope is the canonical per-Project import unit; ExecutionPlanBundle is transport only (never
persisted; its symbols grant no authority); PlanImportReceipt is the compatibility receipt; the
execution run/step ledger is the trace authority.
Relations: decided_by: ADR-013, ADR-017; derived_from: BR-054

### BR-007 — Capability is not a grant
Owner: DOM-PRJ
A Business capability (does a module apply to this Business) is distinct from a Membership grant
(who may open it) and never derives from it.

### BR-008 — Import matches are scope-constrained
Owner: DOM-PRJ
During intake an entity is matched by external reference, then by code, only within the plan's target
scope; a match outside that scope is a conflict — never an insert, an update or a silent skip.
Relations: derived_from: BR-047

### BR-009 — References without an owner are refused, not stored
Owner: DOM-PRJ
An identity reference whose owning model does not exist (risk, tag, supporting identities) is refused
at intake rather than stored as free text or JSON; read models show it as unavailable.
Relations: decided_by: ADR-008

### BR-010 — Project-local views contain only Project data
Owner: DOM-PRJ
Project-scoped views and read models (dependency map, inventory, domain and feature views) include
only records anchored to the authorized Project; cross-Project relations stay in Business-wide
registers.
Relations: decided_by: ADR-003, ADR-009

Legacy rules applying to this domain (converted by the system group): BR-046, BR-047,
BR-048, BR-049, BR-050, BR-051, BR-052, BR-053, BR-054, BR-055, BR-061, BR-062, BR-063, BR-081,
BR-088, BR-089; SEC-001, SEC-002, SEC-003, SEC-005, SEC-006, SEC-007; NFR-003,
NFR-005, NFR-008, NFR-009.

## Public contracts
Declared in [contracts.md](contracts.md):
API-077 · API-076 · API-083 · API-006 ·
API-069 · API-051 · API-068 · API-085 · API-084 ·
API-019 · API-018 · API-082 · API-081 · API-046 ·
API-045 · API-036 · API-035 · API-020 · API-021 ·
API-052 · API-071 · API-072 · API-074 ·
API-073 · API-066 · API-050 · API-049 ·
API-048 · API-039 · API-038 · API-041 ·
API-040 · API-075 · API-047 · API-005 ·
API-004 · API-065 · API-042 · API-044 ·
API-043 · API-024 · API-025 ·
API-023 · API-022 · API-064 ·
API-053 · API-058 · API-061 ·
API-054 · API-057 · API-055 ·
API-059 · API-060 ·
API-056 · API-037 · API-070 ·
API-080 · API-078 · API-079 · API-067 · API-063 ·
API-062 · API-030 · API-026 · API-027 · API-028 ·
API-029 · API-031 · API-032 · API-033 ·
API-034 · API-007 · API-017 · API-016 ·
API-015 · API-012 · API-008 · API-011 ·
API-010 · API-009 · API-013 ·
API-014 · API-001 · API-002 · API-003.

In-process contracts other domains call (no HTTP): scope creation (`scope-service`), the audit writer
(`recordAudit`), managed blob file assets (`createManagedBlobFileAsset`, used by Asset Management and
others), approval request/admission (`requestApproval`, `admitApprovedStep`), and the normative schemas
`contracts/plan-envelope.schema.json`, `contracts/execution-plan-bundle.schema.json`,
`meeting-action-intake.schema.json`. No asynchronous events (EVT) are published by this domain.

## Depends on
- DOM-IAM — trusted viewer contract (`resolveRequestViewer`, `seesBusiness`, `ownsBusiness`,
  `ownsTenant`, `isInstallationOperator`, `hasPermission`, domain visibility; FR-023-001, FR-002-005,
  FR-024-003), Membership grant/revoke contract (FR-030-001), operator-use recording (FR-032-003),
  API access keys (FR-008-002), API-write CSRF (legacy:FR-252-P2), ExternalRef mapping (BR-047),
  provider-subject bindings for meeting intake (FR-029-004), erasure transaction (FR-029-005),
  `/api/entry` and `/businesses` entry routing (FR-023-002/FR-046), People directory (FR-031-003).
- DOM-CRM — `Person` records referenced as PIC, team member, assignee and Key Result owner.
- DOM-INT — pipeline tracking tools sharing the MCP transport (FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005); object storage port for managed blobs.

## Legacy sources
- Charter: docs/domains/project-manager/CHARTER.md; modules apps/server/src/modules/project-manager, apps/server/src/modules/business.
- Feature notes: docs/domains/project-manager/features/*.md; docs/domains/project-manager/EXECUTION-PLAN-BUNDLE.md.
- Registries: docs/PRD-SDD-v1.0.md (FR rows), docs/FEATURES.md (FEAT-017, 002, 003, 005, 007, 008, 012).
- Decisions: legacy legacy:ADR-006, 008, 011, 012, 013, 014, 016, 028, 029, 034, 035, 036, 037, 040, 049, 096, 097, 101, 102, 103.
- Crosswalk: registry/crosswalk/PRJ.csv.

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (22)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-001](../../features/FEAT-001-scope-hierarchy/feature.md) | Scope hierarchy & scope administration | live | 9 |
| [FEAT-002](../../features/FEAT-002-business-shell-navigation/feature.md) | Business shell, entry & navigation | live | 8 |
| [FEAT-003](../../features/FEAT-003-project-execution-structure/feature.md) | Project execution structure & write authorization | live | 10 |
| [FEAT-004](../../features/FEAT-004-repositories-and-project-team/feature.md) | Project repositories & project team | live | 4 |
| [FEAT-005](../../features/FEAT-005-progress-calculation/feature.md) | Progress calculation & explain | live | 5 |
| [FEAT-006](../../features/FEAT-006-project-work-views/feature.md) | Project work views | live | 6 |
| [FEAT-007](../../features/FEAT-007-plan-intake-pipeline/feature.md) | Plan intake pipeline | live | 8 |
| [FEAT-008](../../features/FEAT-008-enterprise-api/feature.md) | Enterprise API | live | 5 |
| [FEAT-009](../../features/FEAT-009-execution-plan-bundle/feature.md) | ExecutionPlanBundle import | implemented | 5 |
| [FEAT-010](../../features/FEAT-010-execution-roadmap-and-trace/feature.md) | Execution roadmap, agent/meeting intake, stable identities & trace | live | 7 |
| [FEAT-011](../../features/FEAT-011-agent-step-approval-gateway/feature.md) | Approval gateway for effectful agent steps | implemented | 4 |
| [FEAT-012](../../features/FEAT-012-project-inventory/feature.md) | Project inventory snapshot | live | 3 |
| [FEAT-013](../../features/FEAT-013-project-execution-domains-view/feature.md) | Project execution domains view | live | 3 |
| [FEAT-014](../../features/FEAT-014-project-feature-authority/feature.md) | Project feature authority | building | 8 |
| [FEAT-015](../../features/FEAT-015-projects-dashboard/feature.md) | Projects dashboard, priority, PIC & teams | live | 6 |
| [FEAT-016](../../features/FEAT-016-pipeline-builder-canvas/feature.md) | Pipeline builder canvas | declared | 5 |
| [FEAT-017](../../features/FEAT-017-managed-file-workspace/feature.md) | Managed file workspace & File Manager | live | 10 |
| [FEAT-018](../../features/FEAT-018-business-home-dashboard/feature.md) | Business Home dashboard | live | 3 |
| [FEAT-019](../../features/FEAT-019-business-strategy-and-key-results/feature.md) | Business strategy, goals & key results | implemented | 8 |
| [FEAT-020](../../features/FEAT-020-scorecard-kpis-and-4dx/feature.md) | Balanced scorecard KPIs & 4DX weekly execution | declared | 2 |
| [FEAT-021](../../features/FEAT-021-audit-and-snapshot-backup/feature.md) | Audit trail & snapshot backup/restore | live | 5 |
| [FEAT-022](../../features/FEAT-022-product-readiness-dashboard/feature.md) | Product readiness dashboard | live | 3 |

### Participating in cross-domain features (1)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-092](../../features/FEAT-092-crm-conversation-inbox/feature.md) | FEAT-092-P04 | Customer navigation slot | DOM-CRM |

### Hosted by services (2)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)
- [SRV-006](../../services/SRV-006-knowledge-storage/SERVICE.md)

<!-- END GENERATED -->
