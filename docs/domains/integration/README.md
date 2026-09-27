---
id: DOM-INT
title: Integrations
status: draft
legacy: [integration]
relations:
  decided_by: [ADR-050, ADR-051, ADR-052, ADR-053, ADR-054, ADR-055, ADR-056, ADR-057, ADR-058]
---

# DOM-INT — Integrations

## Purpose
Integration owns everything about talking to external providers: provider metadata,
Business-scoped connection state, credential custody (the vault), provider ports (LINE
Messaging/admin/rich menu, model providers, Notion), the raw record of everything that
arrived through a connection, and pipeline execution evidence. It is not a
business-truth owner: it never writes Customer, Conversation, Message, LINE reply or
accounting state. Its human surface is a Platform sub-domain (`/platform/integrations`,
`/platform/sot-pipeline`), not a Business domain.

## Ubiquitous language
| Term | Meaning |
|---|---|
| Provider | An external system type (`LINE_OA`, `anthropic`, `prp`, Notion…), `IntegrationProvider`. |
| Connection | A Business's configured link to a provider with a purpose (`PHASE1_LINE_LLM`, `MODEL_PROVIDER`, LINE channel…), role (PRIMARY/SECONDARY) and status. |
| Credential / credential version | The opaque reference to a secret and its versioned lifecycle (`PENDING_VALIDATION` → `ACTIVE` → superseded/revoked/purged; `REENTRY_REQUIRED` after restore). |
| Secret store | Where secret material actually lives: Supabase Vault, the app-level envelope store, or the read-only deployment mount. |
| Secret kind | `LINE_CHANNEL`, `OAUTH_CLIENT`, `MODEL_PROVIDER_KEY`, `NOTION_OAUTH_TOKEN`. |
| Channel account claim | Installation-wide lock of one LINE bot (hash of destination) to one live connection. |
| Ingestion envelope / raw record | The normalized acquisition wrapper and the verbatim evidence row it produces. |
| Lane | Semantic class of raw data (ACCOUNTING, SALES, PRODUCTION_SUPPLY, MARKETING, CUSTOMER, BUSINESS, MARKET_INTELLIGENCE). |
| Pipeline run / step / gate | Execution ledger of a data pipeline definition, its stage occurrences and human gate decisions. |
| SoT decision | A fact submitted by the SoT data plane for human approval (PRICE_ROW, ENTITY, FILE_CLASSIFICATION, PHASE_GATE). |
| Computed health | CONNECTED / DEGRADED / ERROR / DISABLED / MISCONFIGURED derived from evidence, never stored. |

## Owned data
| Entity | One line |
|---|---|
| IntegrationProvider | Provider code, name, status, capabilities. |
| IntegrationConnection | Business-scoped connection: provider, purpose, role, status, external account id, metadata, sync times, version. |
| IntegrationCredential | Current credential reference, store, kind, status, non-secret display hint, validation outcome, token expiries. |
| IntegrationCredentialVersion | Append-style version history of a credential (created via, activated/superseded/revoked/purged times). |
| IntegrationSecretEnvelope | AES-256-GCM sealed secret for the envelope store (wrapped DEK, IV, tag, ciphertext). |
| ChannelAccountClaim | Live claim of a provider account hash by one connection. |
| IngestionRun | Acquisition run with counts and terminal state. |
| RawExternalRecord | Verbatim payload with identity hashes and processing status. |
| SyncCursor | Per connection/resource watermark. |
| ExternalEntityRef | External id ↔ internal entity mapping. |
| DeadLetterRecord | Preserved failure naming stage and owner. |
| SotDecision | Versioned SoT approval item. |
| PipelineRun, PipelineStep, PipelineEventReceipt, PipelineRecordEvent, PipelineReconciliation, PipelineGateDecision | Data pipeline execution ledger (FEAT-060, FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 lineage). |
| KnowledgeEvidenceCursor | Cursor for knowledge evidence import (used by DOM-KNW pipelines). |
| NotionOAuthState, NotionWebhookVerificationToken, NotionWebhookReceipt | Notion installation state, sealed verification token, event receipts. |

## Business rules

### BR-030 — Integration never writes business truth
Owner: DOM-INT
Raw ingestion, provider ports and credential services never create or change
business entities (Customer, Message, orders, accounting); translation belongs to the
owning domain.
Relations: derived_from: BR-047

### BR-031 — Secrets are write-only and never leave the server
Owner: DOM-INT
Secret material never appears in Prisma rows, browser responses, URLs, logs or audit
payloads; only references, store, kind, status and a non-secret display hint are kept.
Relations: derived_from: SEC-028, SEC-031

### BR-032 — A credential resolves only as its own kind and scope
Owner: DOM-INT
A credential written under one kind never resolves as another, and every resolution
re-checks Tenant, Business, connection and destination from stored rows.

### BR-033 — Prove, claim, then store
Owner: DOM-INT
A provider secret is validated live with the provider and (for LINE) the channel claim
taken before anything is stored; a refusal at any step stores nothing.

### BR-034 — Health is computed from evidence
Owner: DOM-INT
Connection and connector state is derived at read time from credential, connection and
arrival evidence; no stored "CONNECTED" status is ever shown as truth.

### BR-035 — Provider acceptance is not delivery
Owner: DOM-INT
A provider's HTTP acceptance is recorded as acceptance only; display/read states remain
unknown unless separately evidenced.

Legacy rules referenced: BR-047, SEC-001, SEC-015, SEC-028, SEC-031, SEC-035.

## Public contracts
API-161 · API-160 · API-147 · API-146 ·
API-141 · API-149 · API-138 ·
API-150 · API-159 · API-142 ·
API-143 · API-144 · API-145 ·
API-151 · API-152 · API-153 ·
API-140 · API-148 · API-154 · API-155 ·
API-156 · API-158 · API-157 ·
API-165 · API-163 · API-162 · API-164 ·
API-139
(see [contracts.md](contracts.md)).

## Depends on
- DOM-IAM: viewer authority, installation-operator check, credential-write gate and rate limits (FR-094-004), SoT data-plane key (FR-027-001).
- DOM-PRJ: audit recorder; Repository metadata (FR-004-001/FR-073) for FEAT-057.
- DOM-LOA: LineOaAccount reads for fencing and webhook URL derivation (API-123).

## Legacy sources
docs/domains/integration/CHARTER.md; docs/domains/integration/features/FR-079, 080, 081, 099, 100, 101, 125, 129, 130, 273 notes and PHASE-FR-149-P1/P4;
docs/decisions/ADR-020, 030, 031, 032, 040, 046, 047, 053, 109; docs/PRD-SDD-v1.0.md rows FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005, 081, 099–101, 125, 129, 130, 242, 266, 267, 273, 274;
docs/FEATURES.md FEAT-055, 045, 046; apps/server/src/modules/integration/**, apps/server/src/platform/integrations/**.

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (9)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-053](../../features/FEAT-053-raw-external-ingestion/feature.md) | Raw external ingestion substrate | implemented | 5 |
| [FEAT-054](../../features/FEAT-054-model-provider-credentials/feature.md) | Model provider credentials (API keys, Private Runtime Platform) | implemented | 7 |
| [FEAT-055](../../features/FEAT-055-sot-pipeline-console/feature.md) | SoT pipeline console | live | 7 |
| [FEAT-056](../../features/FEAT-056-catalog-publication-gate/feature.md) | Catalog publication approval gate | implemented | 2 |
| [FEAT-057](../../features/FEAT-057-connector-catalog-and-github-projection/feature.md) | Connector catalog and GitHub repository projection | building | 2 |
| [FEAT-058](../../features/FEAT-058-notion-connection/feature.md) | Notion connection | building | 7 |
| [FEAT-059](../../features/FEAT-059-flowaccount-read-only-pull/feature.md) | FlowAccount read-only pull pipeline | declared | 4 |
| [FEAT-060](../../features/FEAT-060-pipeline-execution-ledger-and-replay/feature.md) | Pipeline execution ledger, replay and worker bridge | implemented | 5 |
| [FEAT-091](../../features/FEAT-091-phase1-line-runtime-connections/feature.md) | Phase 1 LINE runtime connections | building | 9 |

### Participating in cross-domain features (4)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-093](../../features/FEAT-093-server-owned-line-conversation-transport/feature.md) | FEAT-093-P02 | Evidence capture and LINE messaging port | DOM-LOA |
| [FEAT-094](../../features/FEAT-094-connect-line-oa-yourself/feature.md) | FEAT-094-P01 | Credential vault for LINE channels | DOM-LOA |
| [FEAT-094](../../features/FEAT-094-connect-line-oa-yourself/feature.md) | FEAT-094-P03 | Channel validation and installation-wide claim | DOM-LOA |
| [FEAT-097](../../features/FEAT-097-server-owned-self-hosted-inference-pool/feature.md) | FEAT-097-P01 | Inference node/pool registration, credential resolution and qualification | DOM-AGT |

### Hosted by services (2)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)
- [SRV-006](../../services/SRV-006-knowledge-storage/SERVICE.md)

### Classification (ADR-107)

Subdomain: **generic** · Role: **platform** — declared in `registry/domains.yaml`.

### Context map (10)

| Direction | Context | Pattern | Evidence | Note |
|---|---|---|---|---|
| downstream of | DOM-IAM | open-host-service | BR-002, ADR-100, ARCH-001 | The one policy-enforcement point; every web, API, agent and tool path resolves its viewer here. |
| downstream of | DOM-PRJ | open-host-service | BR-001, BR-002, BR-003, ARCH-001 | Scope chain (Portfolio → Tenant → Business → Workspace → Project) and the audited-write seam every record hangs from. |
| upstream of | DOM-LOA | customer-supplier | FEAT-093, FEAT-094 | Credential vault, channel validation and the LINE messaging port. |
| upstream of | DOM-AGT | customer-supplier | FEAT-091, FEAT-097 | Model provider connections, allow-lists and inference node registration. |
| upstream of | DOM-MKI | customer-supplier | ARCH-001 | Raw external evidence is acquired by Integration and translated by Market Intelligence. |
| upstream of | DOM-PLT | conformist | ARCH-001 | Operator-only projections read every domain as is and own nothing. |
| downstream of | ext:line-platform | anticorruption-layer | ARCH-001, FEAT-093 |  |
| downstream of | ext:model-providers | anticorruption-layer | ARCH-001, FEAT-091 |  |
| downstream of | ext:notion | anticorruption-layer | ARCH-001 |  |
| downstream of | ext:flowaccount | anticorruption-layer | ARCH-001 |  |

<!-- END GENERATED -->
