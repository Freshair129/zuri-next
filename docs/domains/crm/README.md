---
id: DOM-CRM
title: Customer & Conversation
status: draft
legacy: [crm, line-crm]
relations:
  decided_by: [ADR-038, ADR-039, ADR-040, ADR-041, ADR-042, ADR-043]
---

# DOM-CRM — Customer & Conversation

## Purpose
Who the business talks to and what was said. CRM owns the tenant-scoped Customer, the
Conversation/Message business record every LINE turn is written into before any agent
work happens, the evidence kept of that record (sessions, retention, cold archive), and
the sales activities attached to customers. It does not decide identity or permissions
(DOM-IAM) and does not execute LINE transport (DOM-LOA / DOM-INT).

## Ubiquitous language
| Term | Meaning |
|---|---|
| Person | Global human identity (created by DOM-IAM's resolver); CRM links to it. |
| Customer | A Person as seen by one Tenant (unique per Tenant+Person); shared across the Tenant's Businesses (BR-046), optionally bound to one Business. |
| Conversation | One thread on one channel account: `(tenant, channel, channelAccountId, externalThreadId)`. `LEGACY:LINE` marks pre-account rows. |
| Message | One INBOUND or OUTBOUND item of a Conversation with a content kind (`TEXT`, `STICKER`, `LOCATION`, `MEDIA_REF`). |
| Conversation session (sitting) | An idle-bounded run of messages (default 30 min idle). |
| Conversation event | A non-message LINE event (follow, unfollow, join, leave, member joined/left, postback, unsend). |
| Reply source | `STACK`, `TRANSPORT_FALLBACK` or `STAFF` — recorded on the audit event, not on the Message. |
| Tombstone | A fixed replacement body that keeps ids, direction and timestamps (PDPA, unsend and retention each have their own string). |
| Consent status | `PENDING`, `GRANTED`, `DECLINED`, `GRANDFATHERED` on Customer. |
| Chat evidence archive | Encrypted, hash-chained files holding swept message bodies for 10 years. |
| Sales task (งานขาย) | A follow-up a salesperson owes a customer. |

## Owned data
| Entity | One line |
|---|---|
| Customer | Tenant-scoped customer with code `CUS…`, Person link, optional Business, lifecycle stage, consent fields, version. |
| Conversation | Thread per channel account; last-message time, 120-char preview, retention class, status. |
| Message | Direction, body, external id (unique per conversation), content kind, session id. |
| MessageAttachment | Media reference without bytes: kind, provider content id, `fetchState` (PENDING/STORED/EXPIRED_AT_PROVIDER/ERASED). |
| ConversationEvent | Non-message event with bounded id-only payload, unique per `(conversation, externalEventId)`. |
| ConversationSession | Sitting record with code `S-YYYYMMDD-XXXXXX`, counts, timeout in force, optional MSP session id. |
| ConversationAnalysis | Derived per-run classification of a conversation (FEAT-046). |
| SalesTask | Sales follow-up with status machine and CAS version. |
| TenantRetentionOverride | A Tenant's shortened window per retention data class. |
| CustomerArchiveKey | Per-Customer archive data key wrapped by the archive KEK. |
| ArchiveManifest | Per-Tenant hash-chained record of each archive file. |
| CustomerLegalHold | Owner-recorded hold (reason, end date) deferring archive key destruction. |
| CustomerImportBatch / CustomerImportProvenance / CustomerImportReviewCase / CustomerImportReviewDecision | Historical backfill batches, per-source-row provenance and the append-only duplicate review queue (FEAT-044). |
| Person (shared) | Listed in the CRM charter, but created/erased by DOM-IAM flows (see §Business rules, known exception). |
| CustomerProfile, DailyBrief | Declared, not in schema (FEAT-046). |

## Business rules

### BR-019 — Customers are tenant-scoped and never collapsed
Owner: DOM-CRM
The same LINE user in two Tenants is two Customers; CRM never merges Customers across
Tenants or by phone/name, and never uses an external id as a key.
Relations: derived_from: BR-046, BR-047

### BR-020 — Each CRM table has named narrow writers
Owner: DOM-CRM
Inbound messages become rows only through the ingest seam; outbound messages only
through the automatic reply writer (after provider acceptance) or the staff reply
writer; consent only through the consent writer; content erasure only through the
redaction writer. Read models export no writer.

### BR-021 — Consent never gates recording
Owner: DOM-CRM
An inbound message is always recorded; consent gates derived intelligence reads,
memory projection beyond the session tier, knowledge candidates and marketing — not
the business record.
Relations: derived_from: SEC-004

### BR-022 — Placeholder bodies carry no provider values
Owner: DOM-CRM
Stickers, locations and media are recorded with fixed placeholder bodies; sticker
package ids and coordinates never reach `Message.body` (and therefore never reach
previews, search or prompts).

### BR-023 — Tombstones keep the envelope
Owner: DOM-CRM
Erasure, unsend and retention replace content with a cause-specific fixed string and
keep ids, direction and timestamps, so a thread reads as honoured erasure rather than
data loss.

### BR-024 — No verified archive, no tombstone
Owner: DOM-CRM
A retention-swept message body is tombstoned only in the transaction that commits a
verified archive manifest containing it.

### BR-025 — Derived intelligence is advisory and recomputable
Owner: DOM-CRM
Analyses, profiles and briefs are regenerable from Messages, never identity, and
removed with the Customer on PDPA erasure.

Legacy rules referenced (converted by the system group): BR-046, BR-047,
BR-056, SEC-001, SEC-004, SEC-029, SEC-032, NFR-016.

## Public contracts
API-116 · API-106 · API-117 ·
API-104 · API-103 · API-111 ·
API-118 · API-107 · API-108 ·
API-109 · API-110 · API-105 ·
API-112 · API-113 · API-115 ·
API-102 · EVT-001 · API-120 ·
API-119 · API-114 (see [contracts.md](contracts.md)).

## Depends on
- DOM-IAM: `resolveLineIdentity` (FR-029-004/FR-094), viewer authority (`assertDomainVisible`, `ownsBusiness`, `seesBusiness`, `hasPermission`), AAL2 gate (FR-094-004), principal erasure (FR-029-005).
- DOM-LOA: API-136 (staff reply push); account idle timeout and server-enabled flag (FEAT-051, FEAT-048).
- DOM-PRJ: audit recorder and snapshot backup/restore service.
- UI note: `apps/server/src/modules/line-crm/**` (page `/customer/line-crm`) is a prototype suite of 12 screens driven mostly by `mockData.js`; only its multi-OA and live-chat views read real APIs. It is not specified as a feature.

## Legacy sources
docs/domains/crm/CHARTER.md; docs/domains/crm/features/*.md; docs/decisions/ADR-044, ADR-039, ADR-040, ADR-041, ADR-042, ADR-043;
docs/PRD-SDD-v1.0.md rows FR-041-001, FR-041-002, FR-041-003, FR-041-004, FR-044-001, FR-044-002, FR-044-003, FR-044-004, FR-044-005, FR-043-001, FR-043-002, FR-043-003, FR-046-003..128, FR-045-001, FR-045-002, FR-045-003, FR-045-004, FR-042-001, FR-042-002, FR-042-003, FR-042-004, FR-042-005, FR-042-006, FR-051-001, FR-051-002, FR-047-003, FR-047-004, FR-047-005, FR-047-006, FR-047-001, FR-047-002; docs/FEATURES.md FEAT-044, 014, 022, 040, 041;
apps/server/src/modules/crm/**, apps/server/src/modules/line-crm/**, apps/server/src/app/api/crm/**, apps/server/src/app/(pm)/customer/**.

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (9)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-041](../../features/FEAT-041-customer-and-conversation-record/feature.md) | Customer and conversation record (LINE ingest seam) | live | 5 |
| [FEAT-042](../../features/FEAT-042-conversation-sessions/feature.md) | Conversation sessions | implemented | 7 |
| [FEAT-043](../../features/FEAT-043-pdpa-consent-attestation/feature.md) | PDPA consent attestation | live | 3 |
| [FEAT-044](../../features/FEAT-044-customer-data-backfill-and-review/feature.md) | Customer data backfill and import review | live | 6 |
| [FEAT-045](../../features/FEAT-045-sales-tasks/feature.md) | Sales tasks (งานขาย) | implemented | 4 |
| [FEAT-046](../../features/FEAT-046-conversation-intelligence/feature.md) | Conversation intelligence | building | 4 |
| [FEAT-047](../../features/FEAT-047-chat-evidence/feature.md) | Chat evidence (staff replies, cold archive, legal hold) | building | 8 |
| [FEAT-092](../../features/FEAT-092-crm-conversation-inbox/feature.md) | CRM conversation inbox | live | 8 |
| [FEAT-095](../../features/FEAT-095-chat-record-memory-tiers-and-retention/feature.md) | Chat record, memory tiers and retention | building | 16 |

### Participating in cross-domain features (1)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-093](../../features/FEAT-093-server-owned-line-conversation-transport/feature.md) | FEAT-093-P01 | Account-scoped CRM conversations | DOM-LOA |

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

<!-- END GENERATED -->
