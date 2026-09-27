# Decisions — DOM-LOA
### ADR-044 — LINE OA Studio is a first-class domain: the multi-account command center for LINE Official Accounts
Owner: DOM-LOA
Status: approved (superseded in part by ADR-045/ADR-047 for conversation transport)

Context: Four lanes (integration, agent, crm, identity) each held a slice of
LINE behavior but none owned "what does this account look like and do." The
owner's request was a multi-account command center: several LINE Official
Accounts per Business, each with its own rich menus, flows, LIFF apps and
dispatch. `IntegrationConnection` and `line_channel_binding` already expressed
N-per-Business; `Conversation` did not yet carry an account, which the CRM
domain closes separately.

Decision:
- Add domain `DOM-LOA` (route key `line-oa`) as a peer business-capability
  domain in the modular monolith, not a separate deployment.
- `LineOaAccount` is the aggregate: one Business, N accounts; LINE identifiers
  (channel id, basic id, bot user id, `richMenuId`, `liffId`) are external
  attributes, never keys.
- The domain owns design/publication/operating state (rich menu, Flex, flow,
  LIFF, templates, dispatch, transport job, insight snapshot) but holds no LINE
  secret and calls no LINE API directly; a queued job is claimed by a
  transport owner.
- Cross-account sharing exists only through templates with an explicit scope;
  everything else is per-account.
- Authorization ladder: view = Business visibility + domain grant; edit =
  active Membership; publish/dispatch/connect = Business OWNER or
  `LINE_OA_PUBLISHER`.

Consequences:
- One operating record and one owner per LINE Official Account; a Business
  runs several without any lane inventing a second connection or binding model.
- The original two-transport-owner design (`EDGE`/`CLOUD`, a device-claimed job
  lane) is superseded for conversation transport by ADR-045 and finally
  retired by ADR-047; this ADR's account aggregate, ownership boundary and
  multi-account rules remain in force.
- Rich menu, Flex, flow and dispatch model ownership above is the *target*; only
  rich menu, LIFF and the account aggregate have shipped code (`FEAT-048`,
  `FEAT-049`). Flex, flow, templates, dispatch, scheduler and insight
  snapshot are declared, not built — crosswalked as `dropped` (no implementing
  code exists to specify against).

Legacy: ADR-060

### ADR-045 — Server-owned LINE and optional Edge execution
Owner: DOM-LOA
Status: approved (D1 conversation-transport ownership approved; the optional
Edge-execution half is withdrawn by ADR-047; serves cross-domain
`FEAT-093`)

Context: LINE availability could not depend on a customer's edge device.
Signature verification, LINE calls and durable job state needed one owner
regardless of whether a Business also runs an edge worker.

Decision:
- The server (Integration lane) verifies raw LINE signatures and calls LINE;
  this domain owns account routing configuration and the durable
  `LineConversationJob` ledger; CRM owns conversations and messages; the agent
  lane supplies the server answer adapter.
- Admission is durable-first: every inbound event is captured as sanitized
  evidence and marked `ADMITTING` before the webhook's 2xx; that write, not a
  later step, is what the response acknowledges.
- A worker claims durable work with compare-and-set versions and bounded
  leases; a Reply falls back to Push only on a confirmed-dead token, never on
  an ambiguous outcome, which stays `UNKNOWN` for operator reconciliation.
- Conversation identity became account-aware: uniqueness is
  Tenant + channel + channelAccountId + externalThreadId.

Consequences:
- This decision originally kept an *optional* Edge execution path (a paired
  device could compute an answer under strict fencing). That option is
  withdrawn by `ADR-047`: `transportMode` now admits `CLOUD` only and
  `executionMode` is always `SERVER`. The admission, durability, leasing and
  truthful-acceptance rules above are otherwise unchanged and remain in force.
- BR-056 (single-reply-owner) and the reply/Push fallback rule described here
  are still the active design, verified in code
  (`line-conversation-jobs.js`).

Legacy: ADR-061

### ADR-046 — Browser write-only credential vault and self-serve LINE OA onboarding
Owner: DOM-LOA
Status: approved (serves cross-domain `FEAT-094`; the model-provider-key
generalisation is consumed here by `FEAT-050`)

Context: Only an operator with shell access could connect a LINE OA channel;
there was no browser write path into a secret store for LINE OA connections,
and no rate limit or step-up gate protected a credential write.

Decision:
- One `SecretStorePort` in the Integration lane with two writable stores
  (Supabase Vault primary, an envelope store for self-host) plus a read-only
  operator mount; a reference names its store by prefix and cross-store
  resolution is refused.
- Browser entry is write-only: a credential exists only in the request, the
  store, and the short-lived process resolving it for one call; no response,
  log, audit payload or Prisma column ever carries it.
- Every credential write requires AAL2 step-up and a rate limit; credentials
  are versioned so rotation never leaves an account unresolvable.
- A LINE bot is claimed once across the installation (`ChannelAccountClaim`)
  before any secret is stored.
- The onboarding wizard sets the webhook automatically and tests it through
  LINE's own API; a vault-backed account derives legacy quiescence instead of
  a typed confirmation.

Consequences:
- Onboarding a CLOUD-mode account no longer needs an operator.
- This domain's account aggregate gained `REGISTER_WEBHOOK` and
  `webhookStateJson` (webhook health only LINE can report) — specified under
  cross-domain `FEAT-094` (FR-094-008, FR-094-009, FR-094-010),
  not re-specified here.
- The same `SecretStorePort` is the store `FEAT-050` (`FR-054-003, FR-054-004, FR-054-006, FR-050-003`) writes a
  Business's model-provider key through, generalised by that later
  implementation.

Legacy: ADR-089

### ADR-047 — LINE OA runs server-executed, on browser-provisioned API keys
Owner: DOM-LOA
Status: approved

Context: `modelAccess: 'LOCAL_ONLY'` never called a local model — it substituted
a canned, non-inference answerer, so an account left on it replied to real
customers with no inference at all. Edge execution's honest failure mode was
silence (a third of early production jobs ended `FAILED` with
`LOCAL_POLICY_UNAVAILABLE`). The API-key path Integration had already built had
no caller for LINE OA's own model credential.

Decision:
- `EDGE` leaves the account's transport/execution vocabulary entirely:
  `transportMode` admits `CLOUD` alone, `executionMode` is always `SERVER`,
  `SWITCH_TRANSPORT_MODE` is withdrawn as an action.
- The edge conversation-job surface (claim/context/tools/complete/fail) and
  `GET /api/edge/model-residency` are withdrawn as routes.
  `LineConversationJob.executionMode` keeps `EDGE` as readable history only;
  nothing writes it again.
- `modelAccess`'s `LOCAL_ONLY` branch is removed; every server answer resolves
  the Business's own model-provider credential and calls a real model.
- A Business owner posts a provider code and API key to the Integration lane
  write-only; the key is proved live against the provider (reading the chosen
  model, not just listing models) before it is stored as a `MODEL_PROVIDER_KEY`
  credential.
- Resolution order: the Business's own credential first, falling back to the
  installation's Phase-1 resolver only when no Business credential exists —
  never on a resolution failure (fail closed).

Consequences:
- Existing `EDGE`-mode rows are normalised to `CLOUD`/`SERVER` by a migration
  that is not self-applying; `LineConversationJob.executionMode` history is
  never rewritten.
- A job already queued under `EDGE` at cutover is never claimed again; it
  expires `FAILED`/`EXECUTION_EXPIRED`, visible on this domain's job-failures
  read model.
- Verified in code: `LINE_OA_TRANSPORT_MODES = ['CLOUD']`,
  `LINE_OA_ACCOUNT_ACTIONS` has no `SWITCH_TRANSPORT_MODE` entry
  (`src/lib/validation/enums.js`); no `/api/edge/**` route tree exists.

Legacy: ADR-100

### ADR-048 — LINE OA Studio stateless application tier with stateful domain persistence
Owner: DOM-LOA
Status: approved (local implementation)

Context: Server-only execution (ADR-047) does not by itself make the
domain's application and worker processes disposable; a restarted instance
must recover from durable state, not process memory.

Decision:
- Web/API and worker instances are stateless and interchangeable: no
  instance-local memory, timer, queue or filesystem is an authority; a cache
  miss resolves from the authoritative contract.
- All execution that can outlive one HTTP request uses durable state: leased,
  versioned, idempotent job claims; durable schedules; a restart or scale
  event never loses an accepted webhook, queued job, audit event or receipt.
- Secrets stay outside the domain's own state: the browser submits a
  credential only through Integration's write-only path; this domain and its
  worker receive a reference and a validation result, never reusable material.
- Journals stay purpose-specific (`Session`, `UsageEvent`, `AuditEvent`,
  `IntegrationCredentialVersion`, `LineConversationJob`/`LineOaRichMenuJob`,
  `AgentTraceEvent`, `IngestionRun`/`RawExternalRecord`) rather than one
  undifferentiated activity log.
- The preferred future extraction seam is the runtime worker alone
  (`line-runtime`), not the whole domain.

Consequences:
- `LineOaWorkerCheckpoint` (durable compare-and-set scheduling checkpoint) is
  the concrete artifact of this decision for the transport-health sweep
  (`FEAT-052`).
- A future independent worker service is justified only by a real operational
  trigger; this decision does not itself split any process.

Legacy: ADR-105

### ADR-049 — Conversation Runtime service extraction
Owner: DOM-LOA
Status: approved (local implementation)

Context: The user authorized an independently buildable Conversation Runtime
as the first service extraction ahead of Work Management. The existing
implementation mixed webhook admission, job claiming, context assembly, model
calls and LINE sending inside Next.js modules; moving only a worker folder
would not move runtime ownership.

Decision:
- `services/conversation-runtime/` claims eligible conversation work through a
  versioned core contract (`conversation-runtime.v1`), checks authority,
  assembles turn context, routes bounded tools, invokes the model, coordinates
  delivery and reports completion/trace — with no Next.js dependency, Prisma
  client or direct table access.
- This domain (`Core`) remains the only owner of `LineConversationJob` writes
  and claim/lease state; `LineOaAccount.executionMode` and
  `LineConversationJob.executionMode` stay `SERVER`. A separate
  `LineOaAccount.runtimeOwner` (`SERVER` | `CONVERSATION_RUNTIME`) records
  which durable executor cohort a job is snapshotted to at admission, set
  through the versioned `CONFIGURE_EXECUTION` action.
- Claims are atomic (claimant, execution id, lease, version, transport epoch);
  every complete/tool/model-grant/delivery operation revalidates the claim and
  current account/consent authority.
- The signed webhook URL and admission stay in Core; the internal contract is
  not public and never accepts an LLM-supplied viewer or scope.

Consequences:
- `POST/GET /api/internal/conversation-runtime/v1/{operation}` is the private
  boundary this domain exposes to the extracted runtime
  (`API-124`); verified in code
  (`conversation-runtime-core.js`, `SRV-003`).
- The legacy `/api/line-oa/worker` route remains as a bounded
  maintenance/compatibility route for the `SERVER` cohort only.
- No production cutover, database migration or live LINE/model call is
  authorized by this decision alone.

Legacy: ADR-106
