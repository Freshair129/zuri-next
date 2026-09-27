# Agent — Architecture Decision Records

### ADR-059 — Agent vault: private epistemic memory, and why it is not the doc-graph
Owner: DOM-AGT
Status: Proposed (awaiting owner sign-off — carried over unchanged from legacy status)
Relations: decided_by: none; depends_on: none

**Context**

Agent-generated memory (hypotheses, dead ends, recovery patterns) lived only
in a tool-local directory (`.claude/projects/.../memory/`), invisible to any
other agent working the same repository, while the generated doc-graph is
stateless and CI-regenerated — it can hold *declarations* (`@req`, `@spec`)
but not *beliefs* (an owned, dated, revisable claim that might be wrong).
`RW-ADR-O-007` (an external operating-agreement document) defines a
three-tier vault taxonomy for exactly this gap; this ADR adopts it and draws
Zuri's own boundaries around it.

**Decision**

- Zuri implements only the two **private** vault tiers — the Shared Vault
  role is already filled by `docs/` + `.doc-graph.json`, so a second shared
  registry is not created.
- Global Private Vault stays the existing per-tool memory directory,
  unchanged; a new Workspace Private Vault (`<repo>/.brain/private/<agent-id>/`)
  holds per-agent, per-project belief.
- No MSP dependency: the human owner is the promotion mediator, and
  promotion means writing an ADR, feature note, requirement, or test — the
  promoted artefact stands alone and never cites the vault as its evidence.
- `.brain/private/` is gitignored; `.brain/rca/` (already-published shared
  findings) is untouched.
- A vault entry references a GKS node by id only — resolving it to actual
  content happens through the tenant-scoped read path or not at all, so a
  private notebook can never smuggle customer conversation content out of
  its tenant scope.
- Time (bitemporal `validFrom`/`validTo`/`recordedAt`/`supersededAt`) lives
  in the hand-authored vault, never in the derived, stateless doc-graph.
- Cross-repository ADR ids are cited with a namespace prefix
  (`GV-ADR-xxx`), never renumbered to resolve a collision with this
  repository's own ids.

**Consequences**

- An un-graduated hypothesis does not survive a machine change — the
  correct incentive, since anything worth keeping is meant to go through
  the promotion step.
- No new database, service or MSP dependency is introduced by this
  decision; it is a filesystem/gitignore convention plus a documented
  discipline.
- This decision remains **proposed**: nothing in the code inspected for
  this pass (agent module, tests) constructs or reads a
  `.brain/private/<agent-id>/` tree, so no implementation claim is made
  here beyond the decision text itself.

Legacy: ADR-023

### ADR-060 — Agent topology for the Visual Office: domain-based lanes
Owner: DOM-AGT
Status: Accepted
Relations: decided_by: none; depends_on: none

**Context**

The owner asked how agents should be arranged for a planned "Visual
Office" surface (watching zuri-ai's agents work like an office floor).
Three candidate topologies were on the table: role-based (permanent
dev/QA/PM desks), domain-based (a desk per business domain), and
hierarchical/adaptive scheduling (a manager agent assigning work
dynamically). The repository's own incident history — two sessions
claiming the same ADR number simultaneously, a session committing onto
another session's branch, plans built from already-retired documents —
supplied concrete evidence of exactly the collision/authority/staleness
failures a topology decision has to prevent.

**Decision**

- Domain-based lanes are the spine: domains are the slowest-moving axis and
  the one on which write ownership is already defined and already
  preflight-enforced by charters — the same reasoning ADR-103 already
  applied to documents.
- Role-based desks are rejected as the spine (a role needs write access
  everywhere its role applies, dissolving lane ownership — the "agent as
  database superuser" anti-pattern the architecture spec's §25 already
  forbids) but survive as costless **hats** worn within a domain lane.
- This topology governs *agents*, not the LINE/AI runtime domain itself —
  the agent domain (`docs/domains/agent/CHARTER.md`) is explicitly named as
  a different concern from this ADR's subject.

**Consequences**

- Any future Visual Office UI renders one desk per domain, never one desk
  per human-style role, as its floor plan's basic unit.
- A new domain lane gets a desk automatically once its charter exists; no
  separate agent-topology registration step is introduced.
- This decision constrains how future multi-agent work is organized; it
  makes no runtime or schema claim and has no code artifact of its own to
  verify against.

Legacy: ADR-026

### ADR-061 — Execution Trace & Replay v0.3
Owner: DOM-AGT
Status: Accepted (owner approval 2026-09-07; authorizes implementation
under its own phase gates — does not itself claim the journal, route,
adapters or external rollout already existed at approval time)
Relations: decided_by: none; depends_on: ADR-090, ADR-038, ADR-045

**Context**

The native SERVER LINE flow already had useful identities spread across
separate owners (`LineConversationJob`, CRM `Conversation`/`Message`, an
FR-092-004, FR-092-005, FR-092-006 reply-delivery receipt), but a single turn could still cross the
server answer adapter, a model provider, tools, retrieval, memory and
delivery with no common evidence chain — no way to say which exact input
was presented to which model/tool call, which execution/attempt it
belonged to, or that a stored "answer" cannot actually be replayed because
its snapshot expired, was policy-excluded, or was erased. The four-tier
boundary (MSP memory/session, GKS knowledge, Zuri runtime, optional Edge
execution) was already binding and had to stay that way — a trace design
must not become a second memory, knowledge or delivery authority, and must
never write a foreign MSP or GKS database directly.

**Decision**

- One local, scoped, append-only `AgentTraceEvent` model, one row per
  observable execution occurrence, against a closed event-kind vocabulary
  (`TURN_RECEIVED`, `MODEL_COMPLETED`/`MODEL_FAILED`, `TOOL_INVOKED`/
  `TOOL_RESULT`, `ACTION_STARTED`/`ACTION_RESULT`, `EVIDENCE_SELECTED`,
  `MEMORY_WRITTEN`, `SEND_STARTED`/`SEND_RESULT`/`OUTBOUND_RECORDED`),
  each with the exact evidence fields that kind requires (ids, hashes,
  usage, receipt state).
- Reconstruction (playback) is read-only and data-only: it never invokes an
  executor, tool handler, provider or callback, and any missing/invalid
  context, hash mismatch, failure or retention tombstone marks the
  affected unit `REPLAY_INCOMPLETE` rather than silently omitting or
  fabricating evidence.
- Native SERVER defaults to no private-memory adapter; a job's opt-in is
  immutable and set at admission time from server configuration, never
  retroactively or from a client/model.
- MSP Soul/session/memory authority, GKS retrieval and the optional Edge
  adapter remain separate external gates; this journal references them by
  id/hash and receives no direct foreign-database write.

**Consequences**

- One new Prisma model (`AgentTraceEvent`) and its two composite
  indexes/unique constraint — the agent domain's only owned persisted
  state.
- A read-only, owner-scoped playback route becomes possible
  (`GET /api/line-oa/jobs/{id}/trace`), hosted by the LINE OA Studio
  domain's route tree but backed by this domain's read/playback contract.
- PDPA erasure becomes a first-class operation (`redactTraceTurn`): a
  `RETENTION_TOMBSTONE` event redacts every prior payload for a turn while
  leaving metadata (ids, kinds, ordering, scope) queryable.
- This is the one requirement in the domain whose legacy caveats (MSP
  erasure API, live Postgres, deployed canary evidence pending) still
  match the code as read for this pass — see FEAT-068 §9.

Legacy: ADR-070

### ADR-062 — Server-owned self-hosted inference pool
Owner: DOM-AGT
Status: Design approved by the owner (recorded 2026-09-18); canonical id
allocation and repository integration were pending at the legacy baseline.
This approval is not evidence of implementation, test success, migration
application or production activation — every FR this decision governs
(`FR-097-001..005`) is `delivery: declared`.
Relations: decided_by: none; relates_to: ADR-045, ADR-103; relates_to: ADR-104

**Context**

The requested topology is two independently serving computers (nominally 12
GB and 16 GB VRAM), each loading a complete copy of one compatible ~9B
model; a shared replica serves several active requests per node, and new
requests spill from a preferred node to the other when admission or
response-deadline constraints require it — request distribution across
independent full replicas, never VRAM aggregation, tensor parallelism, KV
migration or a single distributed model. The owner wants the mandatory Edge
executor removable from this LINE inference path while Server retains
business/agent authority; node enrollment, authentication, health/capacity
observation and an operations view all need an explicit design; none of it
exists because vLLM happens to be installed. At the reviewed baseline,
`ADR-045` already separates LINE ownership from optional execution,
and the production provider gates do not yet admit a generic private vLLM
pool — a URL-only provider swap is insufficient because the Edge adapter
also composes tools and retrieval, which Server's answer path must gain
natively.

**Decision**

- **D1 — Placement.** `LINE → existing Zuri admission/worker → Server agent
  → pool router → independent vLLM nodes → existing Server delivery`; no
  Edge process required on either GPU; no Ray, Kubernetes, Redis/BullMQ,
  LiteLLM or new LINE gateway. First activation is a single Business-scoped
  pool with two nodes; a Business scope is never a deployment-wide grant.
- **D2 — Ownership stays split, nothing is moved wholesale.** LINE/job
  lifecycle stays `DOM-LOA`; identity/authorization stays `DOM-IAM`;
  provider connections, credentials, node enrollment and normalized
  observations are `DOM-INT` (new `InferencePool`, `InferencePoolMember`,
  `InferenceNodeObservation`, a self-hosted profile on the existing
  `IntegrationConnection` — no second credential table); orchestration,
  routing and capacity leases are `DOM-AGT` (new `InferenceCapacityLease`,
  single writer); Customer/Conversation/Message stay `DOM-CRM`; the
  operator-only removable monitoring projection is `DOM-PLT`; model weights,
  local scheduling and KV cache stay each vLLM process's own concern.
- **D3 — Explicit processing policy.** A new `SELF_HOSTED_ONLY` value is
  added to the LINE model-access contract alongside a versioned pool
  reference; existing `LOCAL_ONLY` keeps its deterministic Server/local-only
  meaning unchanged, and `EXTERNAL_MODEL_ALLOWED` may never be used as a
  shortcut around the local guard. A valid selected pool is necessary but
  not sufficient — job/context authorization must also permit processing at
  the pool's declared trust boundary; admission fails closed until the
  policy extension lands.
- **D4 — Enrollment is configuration plus qualification, not an Edge
  handshake.** An authorized manager registers a permitted origin and a
  write-only credential, chooses an exact model profile and requests
  qualification; Server validates the network target/TLS identity,
  validates the credential against a protected endpoint, lists models and
  runs a small synthetic generation test. Qualification receipts bind
  endpoint, credential version, model profile and configuration epoch —
  never hardware attestation or physical-location proof. The base contract
  is OpenAI-compatible Chat Completions; no custom handshake/callback/
  job-pull or LINE credential is added to vLLM.
- **D5 — One model profile, independent node capacities.** A pool profile
  pins the model artifact revision, tokenizer revision, quantization,
  context limit, chat template, reasoning controls, tool parser and
  capability evidence; a public model name is an alias, never proof two
  weights files match. Nodes may have different calibrated slot/token
  budgets but must satisfy the same profile.
- **D6 — Capacity admission before network dispatch.** The router selects
  only authorized, current, qualified nodes with fresh observations and a
  bounded local-engine queue; it prefers the node that can satisfy the job
  deadline and spills rather than waits; it never migrates active
  generation or KV state. Reservations for one physical engine identity are
  serialized across all worker processes through a database-backed lease,
  never process-local counters; KV metrics are pressure signals, not an
  exact allocatable-token count.
- **D7 — Monitoring is an operational input, never a new authority.** A
  supervised observer updates one latest normalized observation per node
  (timestamps, profile/configuration identity, evidence quality); unknown
  or stale values stay unknown, never zero; the router never blocks on the
  dashboard. No automatic reboot, process-kill or GPU-clock adjustment is
  authorized.
- **D8 — Preserve agent behavior at Server.** Only the provider-neutral
  tool loop and response validation are ported into Server's existing agent
  seam; deterministic catalogue/project commands, knowledge grounding,
  scoped MSP context, invocation receipts, cancellation and trace evidence
  are all preserved. vLLM receives only the minimum authorized prompt/tools
  and returns text/tool requests; it never receives database superuser
  credentials or shell access. The first rollout is bounded text
  conversation only — vision/document extraction, headless coding agents
  and local filesystem/LAN-only capabilities remain Edge-only, not
  implicitly migrated.
- **D9 — One attempt is not permission to repeat side effects.** Every
  model attempt records `jobId`/`executionId`/`invocationId`/`attemptId`,
  node and profile epoch; an ambiguous post-dispatch result is recorded and
  fenced, never blindly retried with tool replay; a client abort does not
  prove GPU compute stopped, so capacity is quarantined until a hard
  execution horizon or verified recovery. LINE sending is never performed
  by the inference adapter; existing delivery/reconciliation rules are
  unchanged, and this decision promises neither exactly-once provider
  computation nor exactly-once LINE delivery.
- **D10 — Security boundary.** Only Zuri's controlled private transport may
  reach approved inference/observation endpoints, over verified-identity
  HTTPS or an authenticated private tunnel; an operator-controlled host/IP/
  port allowlist, connection-time DNS resolution, no redirects, response/
  body limits and restricted egress apply; no registration request may
  reach cloud metadata, local management ports or arbitrary internal
  services. Prefix caching, if enabled, uses a release-verified secret cache
  salt scoped at least to the authorized conversation/audience boundary —
  salt never substitutes for authorization or implies zero retention.
- **D11 — Operations surface is removable.** The operator dashboard only
  reads `DOM-INT`'s/`DOM-AGT`'s redacted contracts and delegates approved
  drain/resume actions to the owning service; removing the dashboard,
  Prometheus or Grafana cannot disable inference correctness or delete
  business state; a Business owner sees only their own pool eligibility
  through normal authorized surfaces, never deployment-wide customer
  detail.
- **D12 — Activation is explicit, reversible, per account.** Requirements,
  policy/schema support, test evidence and release artifacts land before
  activation; activating an account quiesces its computation, settles or
  visibly holds old jobs, binds a qualified pool and runs one
  owner-authorized canary through the existing delivery path; Edge stays
  installed for other capabilities (never deleted); rollback never enables
  a second LINE sender, and database rollback stays additive/forward-safe
  (never drops an active lease or unsettled evidence).

**Consequences**

- `FEAT-097` is this decision's feature-level specification: five parts
  across `DOM-INT` (node registration/trust), `DOM-AGT` (execution,
  capacity routing), `DOM-PLT` (operations projection) and `DOM-LOA`
  (account policy/cutover) — every FR `delivery: declared`, none
  implemented.
- Server needs routed access to GPU APIs; removing Edge loses its
  outbound-only networking advantage; Server must host the required
  orchestration capability, not merely forward raw LINE text; capacity
  observations may be delayed, so calibration, reservation and failure
  fencing are required. GPU host/network/power failure still affects
  availability — this decision adds no fictional HA or throughput SLA.
- The quality bar this decision implies is declared once at system level as
  `NFR-023`, `NFR-024`, `SEC-033`, `SEC-034`
  (`architecture/requirements/non-functional.md`, `security.md`) rather than
  restated per feature.

**Alternatives rejected:** Edge + local inference on each GPU (keeps a full
device agent where only inference is needed); Server calling one vLLM
endpoint alone (a valid first proof step, not the two-node spillover this
decision requires); a LiteLLM gateway in front of nodes (an unneeded
ownership/routing layer before external keys/billing are needed); a
native distributed/tensor-parallel model (solves a different problem —
neither node needs half a model); generic round-robin (ignores unequal
capacities, readiness and LINE deadline); a new inference domain/
microservice (unnecessary while `DOM-INT`/`DOM-AGT` already cover the
boundaries).

Legacy: ADR-099
