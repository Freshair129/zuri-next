---
id: FEAT-043
title: PDPA consent attestation
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-103]
relations:
  depends_on: [FEAT-041, FR-024-003, FR-003-009]
  decided_by: []
---

# FEAT-043 — PDPA consent attestation

## Summary

A Business owner records, in the CRM console, that a Customer's PDPA consent was
captured (`GRANTED`) or refused (`DECLINED`), with timestamp and attesting Person.
Consent status is then read by the inbox, by conversation-intelligence reads
(FEAT-046), by the knowledge candidate decision (DOM-KNW) and by marketing
broadcast eligibility (DOM-MKT). Consent never gates recording an inbound message.

## Scope

**In:** the consent attestation writer and route; default and backfill statuses;
display of status in the inbox; a narrow internal consent reader for other lanes.
**Out:** PDPA erasure itself (DOM-IAM, FR-029-005 — CRM only exposes the redaction
writer and the route shell, see contracts); gating of agent memory (FEAT-095).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-043-001](requirements/FR-043-001-consent-status-lifecycle-on-customer.md) | Consent status lifecycle on Customer | — |
| [FR-043-002](requirements/FR-043-002-only-a-business-owner-may-attest-consent.md) | Only a Business owner may attest consent | — |
| [FR-043-003](requirements/FR-043-003-consent-is-readable-where-decisions-depend-on.md) | Consent is readable where decisions depend on it | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
