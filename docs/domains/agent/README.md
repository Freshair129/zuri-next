---
id: DOM-AGT
title: Agent Runtime
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-059, ADR-060, ADR-061, ADR-062]
---

# DOM-AGT — Agent Runtime

## Purpose
The LINE/AI runtime: per-turn authorization (Gate E read-only context, Gate
F write/action), MSP vault-scoped memory access, evidence-grounded
answering over the Business's own knowledge, the Phase 1 activation path
that gates a LINE binding from PENDING to a real customer answer, and the
one local execution-evidence journal (`AgentTraceEvent`) for the native
SERVER LINE path. It is an orchestration layer that consumes other
domains' capabilities and is never a database superuser — it owns one
Prisma model, no others.

## Ubiquitous language
- **Gate E / Gate F** — the read-only tool boundary (Gate E: a descriptor
  must be `readOnly: true` or registration itself throws) and the separate
  write/action boundary (Gate F: `effect: 'WRITE'`, authorized by RBAC role
  or resource ownership, HIGH sensitivity requires a single-use step-up
  token, one transaction, one audit event).
- **AuthContext** — the immutable, server-derived record
  (`resolveAgentAuthorization`) of identity, Membership, transport
  verification and requested capability/sensitivity/consent a turn carries
  through every downstream authorization decision; the model, the client
  payload and a stale session can never widen it.
- **Authorized vault** — the one (or zero) private-memory scope
  (tenant/principal/agent/workspace/project) a turn's policy allows; API-010
  (`msp_vault_resolve`) is the canonical resolver and is called only after
  this scope is already fixed.
- **Binding** — the server-owned, hash-verified row
  (`zuri_core.line_channel_binding`) that is the *only* source of LINE
  Tenant/Business scope; a client can never select scope directly.
- **Execution trace / playback** — the append-only `AgentTraceEvent`
  journal and its read-only, effect-free reconstruction; a row that cannot
  be verified (hash mismatch, missing context, tombstone) is
  `REPLAY_INCOMPLETE`, never silently treated as a success.
- **Channel identity** — a LINE subject's server-owned
  `PENDING → ACTIVE → REVOKED` lifecycle; a valid signature proves
  transport origin only, never Person authority.

## Owned data
- `AgentTraceEvent` — the one local, scoped, append-only execution-evidence
  journal (ADR-061/FR-068-001). Composite unique key
  `(tenantId, businessId, idempotencyKey)`; indexed by
  `(tenantId, businessId, turnId, occurredAt|createdAt)`.

**Explicitly not owned**, though read/written under a scoped role or
consumed as a port: `zuri_core.line_channel_binding` and
`zuri_core.business_knowledge` (production Postgres, read-only scoped
role), `zuri_core.line_activation_event` (written only through the
compare-and-swap activation port), `ChannelIdentity`/`IdentityLinkToken`
(DOM-IAM), `Conversation`/`Customer`/`Message` (DOM-CRM), MSP vaults and
GKS knowledge (external authorities behind ports).

## Business rules
No rule found in this pass that is not already a legacy `BR-xxx`/`SEC-xxx`
row or already fully covered by the requirements above, **except** the
three below, which are genuine agent-domain invariants with no existing
legacy id:

### BR-036 — Gate E and Gate F are structurally separate registries
Owner: DOM-AGT
A tool descriptor reaches the read-only Gate E registry only if
`readOnly === true` (enforced at `register()`, not at call time); a write
descriptor exists only in the separate Gate F registry
(`effect === 'WRITE'`, a required `execute()`, `sensitivity` exactly
`LOW`/`HIGH`). A tool can never move between the two registries at
runtime.

### BR-037 — The agent is a capability consumer, never a data owner
Owner: DOM-AGT
MSP is episodic memory, GKS is canonical knowledge, ERP/CRM state is
operational truth — the agent domain conflates none of them, and
conversation content never becomes canonical knowledge without governance.
The one lawful chat-to-knowledge route is a locator-only candidate an
OWNER or `LINE_OA_PUBLISHER` approved, admitted through the knowledge
lane's own governance (ADR-067) — never a direct `gks_knowledge_promote`
call from this lane.

### BR-038 — A tool or action carries no authority beyond the caller's own
Owner: DOM-AGT
Every agent tool calls the same application service a human console
surface would call, with the same viewer and therefore the same authority
ladder; no tool queries a database directly for business data, and none
can reach a Business, resource or write path the caller has not already
proven through server-resolved AuthContext.

## Public contracts
- `API-173` (historical; route removed — see FEAT-062/004 §9)
- `API-168` (retired — ADR-095 D5)
- `API-170` (implementation removed)
- `API-166`
- `API-171`
- `API-167`
- `API-172`
- `API-169`

## Capabilities
Not used — nine features cover this pass's declared scope; no `CAP-AGT-*`
grouping was needed.

## Depends on
- `FR-003-009` — the 404-shaped scope-refusal pattern every tool/action
  reuses (identity domain).
- Identity's `resolveAuthorizationContext`/`authorizeScope`/
  `channelIdentityIsVerified`/`ChannelIdentity` lifecycle (`DOM-IAM`) — this
  domain's AuthContext resolution is built entirely on top of it.
- CRM's ingest seam (`ingestLineMessage`) and reply-record evidence
  (`FR-092-004, FR-092-005, FR-092-006`) (`DOM-CRM`).
- LINE OA Studio's `LineConversationJob` admission, account model and
  binding health consumer (`DOM-LOA`) — the domain this agent's binding
  status/execution-trace contracts are consumed by, and the domain whose
  native admission path now supplies scope in place of FR-064-003's
  binding resolver (see FEAT-064 §9).
- Inventory's and Commerce's application services (`FEAT-079`),
  called unmodified by the SmartGift agent tools (FEAT-063).
- Knowledge's tenant-isolated Postgres reader and runtime-isolation probe
  (`DOM-KNW`).
- External, non-domain authorities behind ports: GoVibe/MSP (API-009/API-010),
  GenesisBlockDB (graph knowledge reader).

## Legacy sources
- Charter: `docs/domains/agent/CHARTER.md`
- PRD rows: `docs/PRD-SDD-v1.0.md` FR-061-001, FR-061-002, FR-061-003, FR-062-001, FR-062-002,
  FR-063-001, FR-064-001, FR-064-002, FR-064-003, FR-065-001, FR-065-002, FR-065-003, FR-067-001, FR-066-001,
  FR-061-004, FR-063-002, FR-069-001, FR-069-002, FR-064-004, FR-068-001, FR-068-002, FR-068-003, FR-063-003
- `docs/FEATURES.md` rows FEAT-029, FEAT-087, FEAT-048, FEAT-049, FEAT-079 (all
  cross-domain bundles this domain only partially owns — see
  `registry/crosswalk/AGT.csv`)
- Legacy feature notes: `docs/domains/agent/features/FR-026-*.md`,
  `FR-051-*.md`, `FR-052-*.md`, `FR-053-*.md`, `FR-054-*.md`,
  `FR-055-*.md`, `FR-057-*.md`, `FR-132-*.md`, `FR-141-*.md`,
  `FR-171-execution-trace-and-replay.md`, `PHASE-FR-171-P1-*.md`,
  `PHASE-FR-171-P2-*.md`
- ADRs: ADR-059, ADR-060, ADR-061 (converted here); ADR-083, ADR-022,
  ADR-045, ADR-046, ADR-041 (read-only cross-domain context, referenced as
  `legacy:ADR-xxx`); ADR-095 (2026-09-24, retires the Edge Device/harness
  surfaces this pass found removed from the tree — read-only context, not
  converted; `ADR-095`)

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (10)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-061](../../features/FEAT-061-gate-e-f-core/feature.md) | Gate E/F core — read context, write/action gate, end-to-end turn, tool authorization | implemented | 4 |
| [FEAT-062](../../features/FEAT-062-runtime-wiring-and-webhook-ingress/feature.md) | Runtime wiring and webhook ingress | building | 2 |
| [FEAT-063](../../features/FEAT-063-evidence-grounded-answering-and-tools/feature.md) | Evidence-grounded answering and supply-chain tools | implemented | 3 |
| [FEAT-064](../../features/FEAT-064-line-delivery-and-scope-binding/feature.md) | LINE delivery and scope binding | building | 4 |
| [FEAT-065](../../features/FEAT-065-phase1-activation-path/feature.md) | Phase 1 activation path — golden evaluation, canary readiness, activation receipt | building | 3 |
| [FEAT-066](../../features/FEAT-066-channel-onboarding-and-authorization/feature.md) | Verified channel onboarding | implemented | 1 |
| [FEAT-067](../../features/FEAT-067-authorized-context-and-vault-resolution/feature.md) | Authorized agent context and vault resolution | implemented | 1 |
| [FEAT-068](../../features/FEAT-068-execution-trace-and-replay/feature.md) | Execution trace and replay | implemented | 3 |
| [FEAT-069](../../features/FEAT-069-device-and-handoff-operations/feature.md) | Device and handoff operations (retired Edge Device surfaces) | retired | 2 |
| [FEAT-097](../../features/FEAT-097-server-owned-self-hosted-inference-pool/feature.md) | Server-owned self-hosted inference pool | declared | 5 |

### Participating in cross-domain features (5)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-091](../../features/FEAT-091-phase1-line-runtime-connections/feature.md) | FEAT-091-P01 | Model provider port and allow-lists | DOM-INT |
| [FEAT-091](../../features/FEAT-091-phase1-line-runtime-connections/feature.md) | FEAT-091-P03 | Runtime model selection order | DOM-INT |
| [FEAT-093](../../features/FEAT-093-server-owned-line-conversation-transport/feature.md) | FEAT-093-P05 | Server answer execution | DOM-LOA |
| [FEAT-095](../../features/FEAT-095-chat-record-memory-tiers-and-retention/feature.md) | FEAT-095-P06 | Memory projection receipts (declared) | DOM-CRM |
| [FEAT-095](../../features/FEAT-095-chat-record-memory-tiers-and-retention/feature.md) | FEAT-095-P08 | Context Composer | DOM-CRM |

### Hosted by services (3)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)
- [SRV-002](../../services/SRV-002-line-worker/SERVICE.md)
- [SRV-003](../../services/SRV-003-conversation-runtime/SERVICE.md)

### Classification (ADR-107)

Subdomain: **core** · Role: **platform** — declared in `registry/domains.yaml`.

### Context map (8)

| Direction | Context | Pattern | Evidence | Note |
|---|---|---|---|---|
| downstream of | DOM-IAM | open-host-service | BR-002, ADR-100, ARCH-001 | The one policy-enforcement point; every web, API, agent and tool path resolves its viewer here. |
| downstream of | DOM-PRJ | open-host-service | BR-001, BR-002, BR-003, ARCH-001 | Scope chain (Portfolio → Tenant → Business → Workspace → Project) and the audited-write seam every record hangs from. |
| downstream of | DOM-LOA | partnership | FEAT-093, FEAT-096, FEAT-097 | Admission, job ledger and server answer execution are one path. |
| downstream of | DOM-CRM | customer-supplier | FEAT-095, ADR-100 | The agent reads the conversation record and memory tiers through the read-only context contract. |
| downstream of | DOM-KNW | customer-supplier | FEAT-096, ADR-090 | Only a published corpus generation is read for LINE answers. |
| downstream of | DOM-INT | customer-supplier | FEAT-091, FEAT-097 | Model provider connections, allow-lists and inference node registration. |
| upstream of | DOM-PLT | conformist | ARCH-001 | Operator-only projections read every domain as is and own nothing. |
| downstream of | ext:msp | anticorruption-layer | ARCH-001, ADR-090 |  |

<!-- END GENERATED -->
