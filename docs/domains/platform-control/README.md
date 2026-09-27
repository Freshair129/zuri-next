---
id: DOM-PLT
title: Platform Control
status: approved
relations:
  decided_by: []
---

# DOM-PLT — Platform Control

## Purpose

Two historically separate concerns, unified under one new domain by this
migration's slicing (the coordinator's group assignment — brief:
"platform-control; also owns the console shell/navigation FRs"), because
neither has its own chartered home in the legacy tree:

1. **Installation-operator-only, removable operational projections** — the
   legacy `platform-control` module's actual charter: the programme roadmap
   board, delivery telemetry, agent usage detail, error tracking and
   feature-usage analytics, and Mission Control's DAG orchestration
   observability. Deliberately **not** a Business capability domain: it owns
   no Tenant, Business, Project, Workstream or Business-navigation entry, and
   every read here is gated on `isInstallationOperator`, never on role,
   Business ownership or domain visibility.
2. **Console shell chrome** — scope selection, the command palette, demo
   seed data, and the domain-bar/sidebar grouping and in-canvas module tabs
   that give the navigation registry (`src/config/domains.js`) its ERP
   taxonomy. This code has no `src/modules/<m>` home of its own in the legacy
   tree (it lives in `src/context/`, `src/components/layouts/` and
   `src/config/`) and is assigned to this domain by this blueprint's
   slicing rather than by a legacy charter.

## Ubiquitous language

| Term | Meaning |
|---|---|
| Operator | A Person holding an ACTIVE `PlatformGrant{capability: OPERATOR}` or `SUPERADMIN` (resolved by `DOM-IAM`). The sole authority for every `/control/**` read. |
| Plan snapshot | The programme roadmap board's framing: an immutable projection of the submitted delivery plan, never derived from Git activity or presented as completion. |
| Measured (vs. planned) | Real, sourced figures (tokens, active time, error counts, page views) shown beside — never blended into — the planned figures; unmeasured reads as "not measured", never zero. |
| Domain group | A navigation-only container (`scm`, `crm`) over existing sibling domain keys in `DOMAIN_GROUPS`; never itself a grantable domain key. |
| Module tabs | In-canvas tab navigation (`<ModuleTabs>`) for a sub-domain with more than one page, driven by `usePathname()`, not component state. |
| Domain map | The FR-022-001, FR-022-002, FR-022-003 Product Readiness snapshot (`runtime/domain-state.json`), projected read-only by this domain — it computes no status of its own. |
| Mission Control | The operator-only, read-only DAG orchestration observability surface over the Programme Orchestration Run Ledger (PORL). |

## Owned data

| Entity | One line |
|---|---|
| ProgrammeUsageReport | One session's usage for one programme task/lane, from the local meter or the deployment-bearer report endpoint; keyed `(source, sessionId, branch)`. |
| ErrorEvent | Deduplicated, fingerprinted error record (`name`, `message`, parsed stack frames, occurrence count); operator-resolvable. |
| UsageEvent | Route (`PAGE_VIEW`) or named-action (`ACTION`) usage, per person, retained 90 days raw. |
| UsageEventRollup | Daily, person-less aggregate a `UsageEvent` row becomes after 90 days: `(date, kind, target, count)`. |

The console-shell/navigation FRs (FEAT-034, FEAT-035) persist no
data of their own — `ScopeContext` is client-side view state, the domain
groups are a config-file constant, and the seed script writes rows owned by
other domains' models.

## Business rules

### BR-015 — Every `/control/**` read requires `isInstallationOperator`
Owner: DOM-PLT
`isPlatform`, role, Business/Tenant ownership and domain visibility grant
nothing here; the server route guard runs before any programme data is
rendered (`ADR-030` D2).

### BR-016 — A measured figure never feeds plan progress, a gate or a status
Owner: DOM-PLT
An unmeasured task, lane or phase reads as "not measured" — never zero and
never its planned prediction (`ADR-034` D1).

### BR-017 — A domain group is a navigation container, never a grant
Owner: DOM-PLT
`DOMAIN_GROUPS` entries (`scm`, `crm`) are absent from the permission
registry; they can never reach `Membership.domainKeysJson`, the permission
checkboxes or the route guard, which keeps resolving a path to the leaf
domain (`ADR-032` D2, `ADR-033` D5).

### BR-018 — Person-attributed usage rows are retained 90 days, then rolled up
Owner: DOM-PLT
Past 90 days a `UsageEvent` row is replaced by a `personId`-less daily
aggregate, never deleted outright and never retained indefinitely with a
person attached (`ADR-037` D3).

## Public contracts

- `API-101` — `POST /api/platform/programme-usage-reports`
- `API-097` — `/api/platform/error-events`, `/api/platform/error-events/[id]`
- `API-100` — `/api/platform/usage-events`, `/api/platform/usage-events/rollup`
- `API-099` — `/api/platform/task-usage-ledger`
- `API-098` — `GET /api/health` (deployment liveness probe)

Full method/path/auth/error detail: [contracts.md](contracts.md).

## Capabilities

| CAP | Meaning |
|---|---|
| `isInstallationOperator` | Delegated to `DOM-IAM`'s `isOperator`/`isSuperadmin`; the sole authority for every operator-only surface in this domain. |

## Depends on

- `DOM-IAM` `isOperator`/`isSuperadmin` capability (every operator-only
  guard in this domain).
- `DOM-IAM` harness-credential attribution for usage reports — **retired**
  (ADR-095); the deployment bearer remains the sole non-local reporting
  path.
- `DOM-PRJ` (project-manager) `getProductReadinessSnapshot()` (FR-022-001, FR-022-002, FR-022-003) — the
  Domain map (FEAT-036) projects it read-only and computes no status of
  its own.
- `src/config/domains.js` — the Business-only navigation registry this
  domain's `DOMAIN_GROUPS`/`ModuleTabs` config extends; this domain may not
  add itself to `DOMAINS`.

## Legacy sources

- `docs/domains/platform-control/CHARTER.md`
- `docs/PRD-SDD-v1.0.md` (FR-034-001, 015, 016, 105, 167, 170, 172, 211, 216–219,
  221, 239–241, 247–249, 260–264)
- `docs/FEATURES.md` (FEAT-037, 035 [retired], 039, 042, 044)
- `docs/decisions/ADR-{021,048,052,069,071,086,087,092,095}-*.md`
- `docs/decisions/ADR-110-RETIRE-EDGE-DEVICE-AND-HARNESS-SURFACES.md` (not
  assigned to this group, but read directly — it retires `legacy:FR-221` and
  amends `ADR-035` D5 back toward the deployment-bearer-only path)
- `apps/server/prisma/schema.prisma` (platform-control-owned models)
- `apps/server/src/config/domains.js`, `src/context/ScopeContext.jsx`,
  `src/components/layouts/{CommandPalette,DomainBar,Sidebar}.jsx`,
  `src/lib/module-tabs.js`

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (7)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-034](../../features/FEAT-034-console-shell-scope-navigation-and-seed-data/feature.md) | Console Shell: Scope, Navigation & Seed Data | live | 3 |
| [FEAT-035](../../features/FEAT-035-console-navigation-domain-grouping-and-module-tabs/feature.md) | Console Navigation: Domain Grouping & Module Tabs | live | 3 |
| [FEAT-036](../../features/FEAT-036-platform-programme-roadmap-and-domain-map/feature.md) | Platform Programme Roadmap & Domain Map | live | 4 |
| [FEAT-037](../../features/FEAT-037-programme-delivery-telemetry/feature.md) | Programme Delivery Telemetry | live | 5 |
| [FEAT-038](../../features/FEAT-038-agent-usage-detail/feature.md) | Agent Usage Detail | live | 3 |
| [FEAT-039](../../features/FEAT-039-observability-errors-and-usage-events/feature.md) | Observability: Errors & Usage Events | building | 4 |
| [FEAT-040](../../features/FEAT-040-mission-control-dag-orchestration-observability/feature.md) | Mission Control DAG Orchestration Observability | building | 6 |

### Participating in cross-domain features (1)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-097](../../features/FEAT-097-server-owned-self-hosted-inference-pool/feature.md) | FEAT-097-P04 | Inference pool operations projection (operator-only, removable) | DOM-AGT |

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

<!-- END GENERATED -->
