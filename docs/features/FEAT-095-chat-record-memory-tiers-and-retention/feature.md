---
id: FEAT-095
title: Chat record, memory tiers and retention
type: cross-domain-feature
owner: DOM-CRM
runtime: SRV-001
participants:
  - domain: DOM-CRM
    part: FEAT-095-P01
    role: "Non-text content in the CRM record"
  - domain: DOM-LOA
    part: FEAT-095-P02
    role: "Admission routes non-text events"
  - domain: DOM-CRM
    part: FEAT-095-P03
    role: "Retention classes and CRM sweep"
  - domain: DOM-CRM
    part: FEAT-095-P04
    role: "Inbox read models and search"
  - domain: DOM-LOA
    part: FEAT-095-P05
    role: "Memory projection policy (declared)"
  - domain: DOM-AGT
    part: FEAT-095-P06
    role: "Memory projection receipts (declared)"
  - domain: DOM-IAM
    part: FEAT-095-P07
    role: "Erasure propagation beyond Tier 1 (declared)"
  - domain: DOM-AGT
    part: FEAT-095-P08
    role: "Context Composer"
status: draft
delivery: building
legacy: [FEAT-037, FR-229, FR-230, FR-231, FR-232, FR-233, FR-234]
relations:
  depends_on: [FEAT-093, FEAT-041, FEAT-043, API-106, API-104, API-118, EVT-001, API-131]
  decided_by: [ADR-041, ADR-042]
---

# FEAT-095 — Chat record, memory tiers and retention

## Summary

Every LINE conversation is kept in the right place for its role: the complete business
record in CRM (text, stickers, locations, media references and events, searchable in the
inbox); the agent's conversation ledger and consolidated memory in MSP only under a
per-account policy and per-tier consent; declared retention windows a Tenant can only
shorten; erasure that reaches every tier; and one Context Composer that decides what a
model may see and leaves a receipt of it. The CRM record, retention sweep, inbox read
models and composer are built; memory projection and erasure beyond Tier 1 are declared.

## Scope

**In:** non-text content admission; the CRM retention class and sweep; Tenant retention
overrides; inbox read models and search; memory policy and projection receipts
(declared); erasure propagation to MSP and knowledge (declared); the Context Composer.
**Out:** fetching media bytes into files (later phase); the cold archive of swept bodies
(FEAT-047); MSP itself (separate repository).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 (admission, routes, composer) · SRV-002 (answers) |

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-095-P01 | Non-text content in the CRM record | DOM-CRM | SRV-001 | FR-095-001, FR-095-002 |
| FEAT-095-P02 | Admission routes non-text events | DOM-LOA | SRV-001 | FR-095-003 |
| FEAT-095-P03 | Retention classes and CRM sweep | DOM-CRM | SRV-001 | FR-095-004, FR-095-005, FR-095-006 |
| FEAT-095-P04 | Inbox read models and search | DOM-CRM | SRV-001 | FR-095-007, FR-095-008 |
| FEAT-095-P05 | Memory projection policy (declared) | DOM-LOA | SRV-001 | FR-095-009 |
| FEAT-095-P06 | Memory projection receipts (declared) | DOM-AGT | SRV-002 | FR-095-010 |
| FEAT-095-P07 | Erasure propagation beyond Tier 1 (declared) | DOM-IAM | SRV-001 | FR-095-011 |
| FEAT-095-P08 | Context Composer | DOM-AGT | SRV-002 | FR-095-012, FR-095-013 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-095-001](requirements/FR-095-001-stickers-locations-and-media-become-messages-with.md) | Stickers, locations and media become Messages with fixed placeholders | FEAT-095-P01 |
| [FR-095-002](requirements/FR-095-002-line-events-become-conversationevents-unsend-tombstones.md) | LINE events become ConversationEvents; unsend tombstones | FEAT-095-P01 |
| [FR-095-003](requirements/FR-095-003-the-server-admission-seam-stops-skipping-non.md) | The server admission seam stops skipping non-text events | FEAT-095-P02 |
| [FR-095-004](requirements/FR-095-004-retention-is-declared-per-data-class-and.md) | Retention is declared per data class and may only be shortened | FEAT-095-P03 |
| [FR-095-005](requirements/FR-095-005-a-nightly-sweep-tombstones-crm-content-past.md) | A nightly sweep tombstones CRM content past its window | FEAT-095-P03 |
| [FR-095-006](requirements/FR-095-006-the-crm-record-is-the-business-record.md) | The CRM record is the business record; memory is not | FEAT-095-P03 |
| [FR-095-007](requirements/FR-095-007-conversation-carries-last-message-time-preview-and.md) | Conversation carries last-message time, preview and unread count | FEAT-095-P04 |
| [FR-095-008](requirements/FR-095-008-message-search-and-event-counts-through-the.md) | Message search and event counts through the inbox scope | FEAT-095-P04 |
| [FR-095-009](requirements/FR-095-009-per-account-memory-policy-captured-per-job.md) | Per-account memory policy captured per job (declared) | FEAT-095-P05 |
| [FR-095-010](requirements/FR-095-010-projections-are-receipted-and-stay-off-until.md) | Projections are receipted and stay off until MSP can erase (declared) | FEAT-095-P06 |
| [FR-095-011](requirements/FR-095-011-erasure-reaches-every-tier-and-shows-what.md) | Erasure reaches every tier and shows what is pending (declared) | FEAT-095-P07 |
| [FR-095-012](requirements/FR-095-012-one-composer-builds-every-prompt-context-authorization.md) | One composer builds every prompt context, authorization first | FEAT-095-P08 |
| [FR-095-013](requirements/FR-095-013-each-model-invocation-leaves-one-references-only.md) | Each model invocation leaves one references-only ContextReceipt | FEAT-095-P08 |
| [NFR-095-001](requirements/NFR-095-001-retention-windows.md) | Retention windows | — |
| [NFR-095-002](requirements/NFR-095-002-preview-and-search-bounds.md) | Preview and search bounds | — |
| [NFR-095-003](requirements/NFR-095-003-prompt-context-budget.md) | Prompt context budget | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
