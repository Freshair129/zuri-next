---
id: FEAT-044
title: Customer data backfill and import review
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-006, FR-078]
relations:
  depends_on: [FEAT-041, FR-024-003]
  decided_by: [ADR-086, ADR-021]
---

# FEAT-044 — Customer data backfill and import review

## Summary

Historical customers of one Business (SmartGift) are loaded from a read-only source
snapshot into Person/Customer under a machine-validated, provenance-preserving,
idempotent and rollbackable contract. Rows that cannot be resolved safely are held in
a redacted duplicate-review queue where a Business-scoped reviewer appends decisions
in the web console (`/platform/customer-import-reviews`). A decision never publishes a
Customer; a separate apply gate does.

## Scope

**In:** the backfill contract (scope, record envelope, resolution rules, privacy
exclusions, idempotency, batch rollback); provenance/receipt tables; the review queue,
its target lookup and append-only decisions; the reviewer role.
**Out:** applying review decisions (a later gated phase); orders, quotes, financial
fields, documents, LINE identifiers, consent/erasure history; any other Business or
snapshot.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 (review queue); the batch importer runs as operator scripts against SRV-009 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-044-001](requirements/FR-044-001-backfill-scope-and-envelope-are-fixed-by.md) | Backfill scope and envelope are fixed by contract | — |
| [FR-044-002](requirements/FR-044-002-entity-resolution-never-merges-on-weak-evidence.md) | Entity resolution never merges on weak evidence | — |
| [FR-044-003](requirements/FR-044-003-restricted-fields-are-excluded-and-no-raw.md) | Restricted fields are excluded and no raw PII leaks | — |
| [FR-044-004](requirements/FR-044-004-batch-write-is-server-owned-transactional-and.md) | Batch write is server-owned, transactional and rollbackable | — |
| [FR-044-005](requirements/FR-044-005-redacted-duplicate-review-queue-with-append-only.md) | Redacted duplicate review queue with append-only decisions | — |
| [NFR-044-001](requirements/NFR-044-001-privacy-of-queue-responses.md) | Privacy of queue responses | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
