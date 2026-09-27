---
id: FEAT-047
title: Chat evidence (staff replies, cold archive, legal hold)
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: building
legacy: [FEAT-041, FR-245, FR-246]
relations:
  depends_on: [FEAT-095, FEAT-042, API-136, FR-094-004]
  decided_by: [ADR-042]
---

# FEAT-047 — Chat evidence (staff replies, cold archive, legal hold)

## Summary

What a customer and the business said stays provable. Staff replies sent from the web
inbox are delivered through LINE and recorded as part of the conversation; message
bodies past their retention window are moved to an encrypted, hash-chained archive on
a local disk and kept for 10 years; an owner at AAL2 can retrieve one Customer's
archived messages for a case; a legal hold defers destroying a Customer's archive key
on erasure.

## Scope

**In:** staff reply send+record; archive-before-tombstone in the retention sweep;
per-Customer archive keys; chained manifests; retrieval export; legal hold; 10-year
expiry logic.
**Out:** the retention sweep itself and retention windows (FEAT-095); raw LINE
payloads, agent traces and MSP content (delete-only, never archived); offline copy
procedure (operational).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 (routes, nightly sweep worker script) |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-047-001](requirements/FR-047-001-a-business-owner-can-send-a-text.md) | A Business owner can send a text reply from the inbox | — |
| [FR-047-002](requirements/FR-047-002-a-staff-reply-is-recorded-only-after.md) | A staff reply is recorded only after LINE accepts it | — |
| [FR-047-003](requirements/FR-047-003-no-verified-archive-no-tombstone.md) | No verified archive, no tombstone | — |
| [FR-047-004](requirements/FR-047-004-archive-segments-are-encrypted-per-customer.md) | Archive segments are encrypted per Customer | — |
| [FR-047-005](requirements/FR-047-005-owner-retrieval-at-aal2-with-a-case.md) | Owner retrieval at AAL2 with a case reference | — |
| [FR-047-006](requirements/FR-047-006-legal-hold-and-10-year-destruction.md) | Legal hold and 10-year destruction | — |
| [NFR-047-001](requirements/NFR-047-001-archive-retention-period.md) | Archive retention period | — |
| [NFR-047-002](requirements/NFR-047-002-staff-reply-size.md) | Staff reply size | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
