---
id: DOM-LOA
title: LINE OA Studio
legacy: [DOM-LINE-OA-STUDIO]
---

# DOM-LOA — LINE OA Studio

## Purpose

The Business-scoped authority for **designing, publishing and operating LINE
Official Accounts — several per Business**: the account record, rich menus,
the LIFF app registry, transport health, and the durable job ledgers through
which server code — never the Studio itself — reaches LINE. It is the command
center that answers, for every account a Business runs: what does it look like
and do right now, is it healthy, and (via the durable conversation job ledger)
is it able to answer at all.

Conversation execution is server-only (`ADR-047`, amending `ADR-045`):
there is no edge/device transport or execution path left in this domain. The
domain queues durable work and reports truthful acceptance, never delivery or
reading.

## Ubiquitous language

- **LineOaAccount** — one LINE Official Account operated by one Business; the
  aggregate root of the domain.
- **transportMode** — who owns the account's LINE wire transport. Admits
  `CLOUD` only; `EDGE` is retired vocabulary (`FR-050-001`).
- **executionMode / runtimeOwner** — `executionMode` is always `SERVER`;
  `runtimeOwner` (`SERVER` | `CONVERSATION_RUNTIME`) names which durable
  executor cohort claims a job (`ADR-049`).
- **effectiveStatus** — the account's displayed status; `LIVE` is *derived*
  from the agent lane's binding read model and can never be set directly.
- **Rich menu / version** — a rich menu is an identity (code, alias, default
  flag); every edit is a numbered, freeze-once-immutable `LineOaRichMenuVersion`.
- **Rich menu job / conversation job** — a durable, leased, compare-and-set
  unit of work a server worker claims to reach LINE; acceptance by LINE is an
  acceptance class, never proof of delivery or reading.
- **LIFF app** — a per-account registry entry resolving a `LIFF` tap action to
  `https://liff.line.me/{liffId}{path}` once ACTIVE.
- **Transport health** — read-only classification of inbound silence (OK /
  QUIET / SILENT) and webhook endpoint match (MATCHED / MISMATCHED / DISABLED /
  UNKNOWN); never a write, never a provider change.
- **Model provider key** — a Business's own API key to the model provider that
  answers its LINE conversations; owned and stored by Integration, read here
  only as validation status.

## Owned data

| Entity | One line |
|---|---|
| `LineOaAccount` | the aggregate: identity, scope, status machine, transport/execution mode, session-timeout and business-hours configuration, knowledge-grounding mode |
| `LineOaRichMenu` | a rich menu's identity, alias and default flag, N per account |
| `LineOaRichMenuVersion` | one numbered, freeze-immutable body of a rich menu: layout, chat-bar text, tap areas, image reference, external `richMenuId` once deployed |
| `LineOaRichMenuJob` | the durable, leased publish/set-default/set-alias job ledger for a rich menu version |
| `LineOaLiffApp` | the per-account LIFF registry entry: view size, endpoint, scopes, external `liffId` |
| `LineOaWorkerCheckpoint` | a durable compare-and-set scheduling checkpoint for a stateless worker sweep (transport-health) |
| `LineConversationJob` | the durable conversation execution and delivery-acceptance ledger, one row per admitted inbound event; carries the CRM-owned session id as a reference, never as an authority |

## Business rules

### BR-026 — `LIVE` is always derived, never client-set
Owner: DOM-LOA
An account's effective status of `LIVE` is computed from the agent lane's
binding read model at read time; no write path accepts or stores it. Every
stored status is one of `DRAFT | CONNECTED | PAUSED | ARCHIVED`.

### BR-027 — At most one default account per Business
Owner: DOM-LOA
`isDefaultForBusiness` is exclusive within a Business; setting it on one
account clears it on every other account of that Business in the same
transaction.

### BR-028 — Provider acceptance is not delivery
Owner: DOM-LOA
A job's terminal `COMPLETED`/`ACCEPTED` state records what LINE's API accepted
(an HTTP acceptance), never that a message was delivered or read.
`DISPLAYED_UNKNOWN` / `UNKNOWN` states are explicit and are never promoted to a
stronger claim by any later process.

### BR-029 — Every write is a compare-and-swap on `version`
Owner: DOM-LOA
Every account, rich menu, rich-menu-job and LIFF-app mutation names the
version the caller read; a stale version is a conflict, never a silent
last-writer-wins.

## Public contracts

See `contracts.md` for full definitions. Summary: `API-123`,
`API-121`, `API-132`, `API-122`,
`API-137`, `API-127`,
`API-126`, `API-128`,
`EVT-002`, `EVT-003`,
`API-135`, `API-133`, `API-134`,
`API-130`, `API-129`, `API-125`,
`API-124`, `API-136`,
`API-131`.

## Depends on

- `API-147`, `API-141`,
  `API-149`, `API-161` — Integration resolves
  and never returns LINE channel material or the model provider key.
- `API-151` — Integration owns the Business's
  `MODEL_PROVIDER` credential; this domain reads only its non-secret status.
- `FR-064-003` (agent binding resolution), `FR-067-001` (the AI turn) —
  the agent lane's server answer adapter, called through this domain's
  worker.
- `API-111`, FR-041-001 — CRM owns
  `Conversation`/`Message`/`ConversationSession`; this domain's job carries a
  session id as a reference only.
- `FR-024-003` (domain visibility grant `line-oa`), `BR-057`
  (viewer-derived scope) — Identity.

## Legacy sources

- `docs/domains/line-oa-studio/CHARTER.md`, `CONTEXT-MAP.md`, `SRS.md` (skim)
- `docs/domains/line-oa-studio/features/FR-146-line-oa-account.md`,
  `FR-151-line-oa-rich-menu.md`, `FR-152-line-oa-rich-menu-publish-jobs.md`,
  `FR-153-line-oa-liff-app-registry.md`, `FR-190-line-transport-health.md`,
  `REVIEW-LINE-OA-RELIABILITY-2026-09-10.md`
- `docs/decisions/ADR-060,061,089,100,105,106,110-*.md`
- `docs/PRD-SDD-v1.0.md` rows FR-052-001, FR-052-002, 146, 151, 152, 153, 190, 243, 244, 265, 266
- `docs/FEATURES.md` rows FEAT-048, FEAT-049, 040, 045
- `apps/server/src/modules/line-oa-studio/**`, `apps/server/src/app/api/line-oa/**`,
  `apps/server/src/app/api/health/route.js`, `apps/server/src/app/api/internal/conversation-runtime/**`,
  `apps/server/src/lib/public-base-url.js`, `apps/server/prisma/schema.prisma`

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (7)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-048](../../features/FEAT-048-line-oa-accounts/feature.md) | LINE OA accounts | implemented | 5 |
| [FEAT-049](../../features/FEAT-049-rich-menus-and-liff-app-registry/feature.md) | Rich menus and LIFF app registry | implemented | 7 |
| [FEAT-050](../../features/FEAT-050-server-executed-answers-on-business-api-keys/feature.md) | Server-executed answers on Business API keys | building | 5 |
| [FEAT-051](../../features/FEAT-051-account-conversation-timing/feature.md) | Account conversation timing | building | 4 |
| [FEAT-052](../../features/FEAT-052-transport-health-and-deployment-liveness/feature.md) | Transport health and deployment liveness | live | 7 |
| [FEAT-093](../../features/FEAT-093-server-owned-line-conversation-transport/feature.md) | Server-owned LINE conversation transport | implemented | 14 |
| [FEAT-094](../../features/FEAT-094-connect-line-oa-yourself/feature.md) | Connect LINE OA yourself | implemented | 13 |

### Participating in cross-domain features (6)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-092](../../features/FEAT-092-crm-conversation-inbox/feature.md) | FEAT-092-P03 | Job ledger records accepted answers | DOM-CRM |
| [FEAT-095](../../features/FEAT-095-chat-record-memory-tiers-and-retention/feature.md) | FEAT-095-P02 | Admission routes non-text events | DOM-CRM |
| [FEAT-095](../../features/FEAT-095-chat-record-memory-tiers-and-retention/feature.md) | FEAT-095-P05 | Memory projection policy (declared) | DOM-CRM |
| [FEAT-096](../../features/FEAT-096-line-grounding-and-knowledge-candidates/feature.md) | FEAT-096-P01 | LINE answer grounding mode | DOM-KNW |
| [FEAT-096](../../features/FEAT-096-line-grounding-and-knowledge-candidates/feature.md) | FEAT-096-P04 | LINE Studio description admission | DOM-KNW |
| [FEAT-097](../../features/FEAT-097-server-owned-self-hosted-inference-pool/feature.md) | FEAT-097-P05 | Self-hosted inference policy and cutover | DOM-AGT |

### Hosted by services (3)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)
- [SRV-002](../../services/SRV-002-line-worker/SERVICE.md)
- [SRV-003](../../services/SRV-003-conversation-runtime/SERVICE.md)

### Classification (ADR-107)

Subdomain: **core** · Role: **business** — declared in `registry/domains.yaml`.

### Context map (7)

| Direction | Context | Pattern | Evidence | Note |
|---|---|---|---|---|
| downstream of | DOM-IAM | open-host-service | BR-002, ADR-100, ARCH-001 | The one policy-enforcement point; every web, API, agent and tool path resolves its viewer here. |
| downstream of | DOM-PRJ | open-host-service | BR-001, BR-002, BR-003, ARCH-001 | Scope chain (Portfolio → Tenant → Business → Workspace → Project) and the audited-write seam every record hangs from. |
| upstream of | DOM-CRM | partnership | FEAT-092, FEAT-093, FEAT-095 | Transport and record evolve together; every LINE turn is written to the CRM record before any agent work. |
| upstream of | DOM-AGT | partnership | FEAT-093, FEAT-096, FEAT-097 | Admission, job ledger and server answer execution are one path. |
| downstream of | DOM-KNW | customer-supplier | FEAT-096 | LINE answer grounding mode and description admission. |
| downstream of | DOM-INT | customer-supplier | FEAT-093, FEAT-094 | Credential vault, channel validation and the LINE messaging port. |
| upstream of | DOM-PLT | conformist | ARCH-001 | Operator-only projections read every domain as is and own nothing. |

<!-- END GENERATED -->
