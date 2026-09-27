# Platform Control — decisions

All nine legacy ADRs assigned to this domain are still in force. None are
superseded or retired. (`ADR-095`, read for context though not
assigned to this group, retires part of `ADR-035`'s scope — see the
note under ADR-035.)

### ADR-029 — Zuri-branded entry landing
Owner: DOM-PLT

Legacy: ADR-021

**Status:** Beta, owner-approved, implemented.

**Context:** The entry-routing boundary (`FEAT-083`) needed a
product-specific first impression for `/` without weakening the boundary or
importing unrelated brand/commerce visual language.

**Decision:**
- `/` is a full-viewport, Zuri-branded composition inside `EntryShell`, with
  exactly one route-bearing action targeting `/login`; it does not mount
  BusinessShell chrome or resolve viewer data.
- The visual language reuses existing tokens only (white/graphite/neutral
  gray/Amber Citrus, existing fonts and iconography) — no new visual-system
  primitive or external font.
- Fashion/retail/commerce brand semantics are prohibited from the landing
  source, metadata and rendered copy.

**Consequences:** Login and Business Routing (`FEAT-083`) keep
their existing behavior unchanged; this decision owns only the landing
composition.

### ADR-030 — Platform Control is outside the Business Shell
Owner: DOM-PLT

Legacy: ADR-048

**Status:** Accepted, implemented (FEAT-036); amended by ADR-036.

**Context:** The 24-week delivery programme is a platform-management
concern, not a Business/Project/Workstream record; mounting it under the
Business Shell would bind it to an ambient Business it does not have.

**Decision:**
- A separate `PlatformControlShell` owns `/control/**` — no DomainBar,
  Business selector or `activeBusinessId` requirement; `/control/roadmap` is
  deliberately absent from the Business navigation registry.
- `isInstallationOperator(viewer)` is the sole authorization predicate;
  `isPlatform`, Business/Tenant ownership and domain visibility grant
  nothing. A trusted non-operator viewer receives a non-enumerating 404; a
  missing viewer redirects to `/login`.
- The first board is a read-only, self-identifying **plan snapshot** (six
  phases, twelve sprints, thirty tasks, its supplied baseline commit and
  document status) — it stores no progress and never derives completion
  from Git activity.

**Consequences:** Business users cannot mistake the programme board for
their operational work; programme removal is a contained deletion (its own
route group, shell and module).

### ADR-031 — Canonical plugin authorization-code and token boundary
Owner: DOM-PLT

Legacy: ADR-052

**Status:** Candidate implementation — live provider/device evidence
pending. (Content concern is `DOM-IAM`'s FR-028-001/FEAT-028; assigned to
this domain's ADR list per this migration's group slicing.)

**Context:** Codex, Claude Code and other harnesses need a first-party
plugin boundary distinct from a human password grant, a copied browser
cookie, or the MCP session-continuation header.

**Decision:**
- One canonical route family under `/api/plugin/auth`
  (`authorize`/`token`/`capabilities`/`revoke`); the plugin is a public
  client — no client secret is issued. The authorization code is single-use,
  hash-stored, PKCE S256-bound and expires in 60 seconds; the resulting
  session is a 15-minute opaque bearer, non-refreshable.
- Redirect matching is exact and stays exact (`localhost`/`127.0.0.1` are two
  registrations) — a normalization "fix" for a transport that rewrites one
  into the other was explicitly refused.
- A replayed code is refused **and** revokes every session it already
  minted (RFC 9700 §4.1.1).
- A plugin session never inherits a platform DEV grant (`getPluginCapabilities`
  resolves without `platformGrant`).
- `GET /authorize` renders only and mints nothing; only a POST from the
  rendered consent screen, carrying a session-bound anti-CSRF token and an
  HMAC-signed request token, mints a code.

**Consequences:** A browser login session and a plugin access session are
distinct credentials; capability discovery is advisory UX only — every
command still re-authorizes on its own path before mutating anything.

### ADR-032 — SCM is a parent domain over Warehouse, Inventory, Procurement and Order Management
Owner: DOM-PLT

Legacy: ADR-069

**Status:** Accepted, implemented (FEAT-035).

**Context:** The owner named a real ERP row — Supply Chain Management over
Warehouse, Inventory, Procurement, Order Management — but the navigation
registry showed the three built modules as unrelated peer tabs, and a domain
key is not a label: collapsing them would renumber a permission grant.

**Decision:**
- `DOMAINS` stays the flat, authoritative list every consumer already walks;
  a new `DOMAIN_GROUPS` array states the presentation shape only, naming
  children **by key**. Two derivations (`domainBarSlots()`,
  `sidebarDomainForPath()`) read it generically.
- Every child keeps its own key — no stored member grant moves.
- `warehouse` is declared as a `soon` (reserved, unbuilt) child, not folded
  into `inventory`; the built lane is relabelled from "Warehouse" to
  "Inventory" to resolve a screen-reader/Playwright label collision.
- SCM owns no models, routes or module — it is a pure navigation/authority-
  grouping concept.
- A viewer sees the SCM slot only when they hold any child's key.

**Consequences:** The owner's named ERP row is now visible in the product;
this decision is the precedent other ERP rows (ADR-033) reuse without
new derivation logic.

### ADR-033 — CRM is a parent domain over Customer and Market Intelligence
Owner: DOM-PLT

Legacy: ADR-071

**Status:** Accepted, implemented (FEAT-035).

**Context:** Extending ADR-032's test to the rest of the domain bar: is
each remaining slot one ERP-recognised function shown as more than one peer
tab? Only `customer`/`market` qualified; every other slot was already a
correctly standalone module or a non-ERP system/channel area (Business Home,
Platform, LINE OA Studio) the same way ADR-032 already carved out.

**Decision:**
- A second `DOMAIN_GROUPS` entry, `crm`, over `customer` and `market`,
  reusing the same generic derivations with no new logic.
- `customer`'s bar label changes from "CRM" to "Customer" (collision with
  the new group label); `market`'s label and key are unchanged.
- Marketing, Operations, HR/People, Development, Asset Management, LINE OA
  Studio and Platform are confirmed unchanged — each already satisfies the
  one-function-one-slot test.
- CRM owns no models, routes or module, identically to SCM.

**Consequences:** The bar reads one slot fewer (Customer + Market Intelligence
collapse into one); no permission data moves.

### ADR-034 — Programme delivery telemetry: measured beside planned, never as progress
Owner: DOM-PLT

Legacy: ADR-086

**Status:** Accepted, implemented (FEAT-037); D7 (usage detail)
implemented (FEAT-038); D5 amended by ADR-035.

**Context:** Every phase card's token figure was a copy of its own
prediction — nothing measured had ever been recorded, even though Claude
Code and Codex logs on the operator's machine already contain real,
per-request usage.

**Decision:**
- Planned (sprint/task counts, size, plan window, effort estimate) and
  measured (tokens, active time, first/last activity) are separate,
  always-labelled layers; a measurement never feeds plan progress, a gate or
  a status; an unmeasured item reads "not measured", never zero.
- Size/estimate come from a written sizing table in the programme document
  (`C-1`/`C-2`/`C-3` complexity points).
- A **lane** (a declared set of tasks sharing git branches) is the unit
  usage is measured and shown at — never split across tasks by estimate.
- `scripts/programme-usage-meter.mjs` reads local Claude Code/Codex logs,
  counts each billed request once, normalises to four token counts, computes
  active time (gaps capped at 15 minutes), and writes the result into the
  document's usage block by hand (CI only checks the generated module
  matches the document).
- `POST /api/platform/programme-usage-reports` accepts one session's usage
  from an agent with no local logs, authenticated by a deployment bearer,
  keyed `(source, sessionId)` idempotent-replay/409-conflict.
- Evidence badges (DOC/CODE/TEST/FR/NFR/FEAT/domain/complexity/priority) and
  subtask progress bars render on every task card, colour always paired with
  a word.
- **D7 (2026-09-14):** the meter and harness plugin additionally count usage
  *detail* — thinking tokens, cache lifetimes, web search/fetch, tool calls
  and their errors/denials, prompts, compactions, API errors, requests per
  model — names and numbers only, proven by a meter/plugin parity test.

**Consequences:** The board can answer "what did this phase really cost" for
work in declared lanes, and says "not measured" for everything else,
including all work predating the meter.

### ADR-035 — Harness usage plugin: browser-paired devices with a report-only credential
Owner: DOM-PLT
Relations: decided_by: legacy:DOM-IAM
Legacy: ADR-087

**Status:** Accepted, **retired 2026-09-24 by `ADR-095`** — recorded
here for historical completeness; not re-specified as a live feature (see
Consequences below).

**Context:** A connector (MCP tool) cannot report its own billed usage
truthfully; the owner asked for per-person, per-device attribution instead
of anonymous local-log measurement alone.

**Decision (as originally accepted):**
- An agent harness pairs with zuri-ai the same way a Zuri Edge Device does:
  an anonymous bounded start, approval by a signed-in person on
  `/harness/pair`, one redemption yielding a `HarnessCredential` scoped only
  to `PROGRAMME_USAGE_REPORT`.
- Attribution: person and installation from the credential, never the body;
  lane from the declared branch. A resumed session extends its report.
- The deployment bearer (ADR-034 D5) remains for unattended automation
  only.

**Retirement note (ADR-095, 2026-09-24):** The owner directed retirement of
the Edge Device connection model in favor of browser-provisioned PRP
LocalWorker keys, and retired the harness pairing/plugin surfaces in the
same decision. `HarnessCredential` and its historical `ProgrammeUsageReport`
rows are preserved (schema and data), but no route mints, pairs or reports
through them any longer. `legacy:FR-220`, `legacy:FR-221`, `legacy:FR-222`
and `legacy:FEAT-035` are crosswalked as `retired`, not re-specified as
features in this blueprint. The deployment-bearer path this decision's D5/D6
describe survives unchanged under FEAT-037 (`FR-037-003`).

### ADR-036 — A time-boxed member view of the programme roadmap
Owner: DOM-PLT

Legacy: ADR-092

**Status:** Accepted, implemented (FEAT-036).

**Context:** The owner asked for the programme roadmap to be open for 30
days to any signed-in person, not only the sole operator, while keeping
people/device/tool/model attribution operator-only.

**Decision:**
- `/roadmap`, outside `(control)` and outside BusinessShell, admits any
  signed-in session (no Business, role or grant consulted or conferred) for
  a window that is a **constant in code** — closes 2026-10-15 00:00
  Asia/Bangkok — after which it is a non-enumerating 404 for everyone,
  including operators, who keep `/control/roadmap` unchanged.
- The server-side projection removes usage by person/device, tool/model
  names, the Agent devices tab and any credential/report row before the
  client ever sees the payload — a test asserts the removed fields are
  absent from the projection's own output, not only hidden in a component.
- Extending or closing the window early is a reviewed code change and a
  deploy, deliberately never a runtime switch.

**Consequences:** For the window's duration, every account holder can read
the delivery plan without becoming an operator; `/control/roadmap`'s single
predicate is unchanged.

### ADR-037 — Observability: error tracking and per-person feature usage
Owner: DOM-PLT

Legacy: ADR-095

**Status:** Accepted, partially implemented (FEAT-039 — error tracking
merged/deployed; usage events implemented locally, not yet merged).

**Context:** A survey of every log surface found none that answer "where did
this error happen and how often" or "which page/action is actually used, by
whom." The owner chose to extend the existing structured logger rather than
adopt a third-party service, and chose **per-person** feature usage over the
aggregate-only safer default.

**Decision:**
- `logger.exception(error, fields)` fingerprints an error
  (`sha256(name:message:firstStackFrame)`) and returns a shape a caller
  persists via `recordErrorEvent` — one deduplicated `ErrorEvent` row per
  fingerprint, incrementing `occurrenceCount`/`lastSeenAt` on repeat.
- `UsageEvent` covers both `PAGE_VIEW` (a client hook mounted once per
  shell) and `ACTION` (`recordAction(name)`, a static label, instrumented
  incrementally — not a claim of complete coverage).
- Raw, person-attributed rows retain 90 days; a daily rollup
  (`UsageEventRollup`) then keeps only `(date, target, count)` with no
  `personId`.
- No consent gate — the same discipline `AuditEvent` and access history
  already apply to every signed-in account; a stated privacy note is shown
  on the operator-facing page instead.
- Both models are owned by `platform-control`, joining `ProgrammeUsageReport`.

**Consequences:** The system gains a queryable, operator-visible error log
for the first time; action-level coverage will be partial for a long time by
design, and the dashboard must state that explicitly rather than let an
absent action read as "nobody does this."
