---
id: FEAT-041
title: Customer and conversation record (LINE ingest seam)
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-023]
relations:
  depends_on: [FR-029-004, FR-029-001]
  decided_by: [ADR-038]
---

# FEAT-041 — Customer and conversation record (LINE ingest seam)

## Summary

Every inbound LINE message becomes a durable CRM record before any agent work happens:
a tenant-scoped Customer linked to the global Person, a Conversation per channel
account and thread, and the Message itself. The seam is an in-process contract
(`ingestLineMessage`) called by the LINE admission path (FEAT-093); there is no
public HTTP surface of its own.

## Scope

**In:** first-contact creation of Customer + Conversation + Message; per-message
idempotency; Business/tenant scope guards; transaction composition with the caller;
audit of each ingestion.
**Out:** identity resolution of the LINE user (DOM-IAM, FR-029-004/FR-094);
account-scoped thread identity rules (FEAT-093); non-text content (FEAT-095);
session assignment (FEAT-042); outbound replies (FEAT-092, FEAT-047).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-041-001](requirements/FR-041-001-first-contact-creates-customer-conversation-and-message.md) | First contact creates Customer, Conversation and Message atomically | — |
| [FR-041-002](requirements/FR-041-002-ingestion-is-idempotent-per-external-message-id.md) | Ingestion is idempotent per external message id | — |
| [FR-041-003](requirements/FR-041-003-business-scope-is-enforced-before-any-row.md) | Business scope is enforced before any row is returned | — |
| [FR-041-004](requirements/FR-041-004-ingestion-composes-with-the-callers-transaction-and.md) | Ingestion composes with the caller's transaction and is audited | — |
| [NFR-041-001](requirements/NFR-041-001-bounded-conflict-retry.md) | Bounded conflict retry | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
