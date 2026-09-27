---
id: FEAT-092
title: CRM conversation inbox
type: cross-domain-feature
owner: DOM-CRM
runtime: SRV-001
participants:
  - domain: DOM-CRM
    part: FEAT-092-P01
    role: "Inbox and thread readers"
  - domain: DOM-CRM
    part: FEAT-092-P02
    role: "Automatic outbound reply record"
  - domain: DOM-LOA
    part: FEAT-092-P03
    role: "Job ledger records accepted answers"
  - domain: DOM-PRJ
    part: FEAT-092-P04
    role: "Customer navigation slot"
status: draft
delivery: live
legacy: [FEAT-009, FR-091, FR-093]
relations:
  depends_on: [FEAT-041, FEAT-093, FR-024-003, FR-003-009]
  decided_by: [ADR-038, ADR-041]
---

# FEAT-092 — CRM conversation inbox

## Summary

The web console's reader over the LINE record: an inbox of a Business's conversations
and a thread view showing both sides — what the customer said and what the business's
LINE answer actually sent. The outbound half exists because the server transport
records every provider-accepted answer as an OUTBOUND Message. Operators use it at
`/customer/conversations` (Inbox) under the `customer` navigation slot.

## Scope

**In:** inbox list and thread read; the automatic outbound reply record; recording of
accepted answers by the LINE job ledger; the navigation slot.
**Out:** staff replies typed in the inbox (FEAT-047); sessions (FEAT-042);
previews/unread/search/event counts (FEAT-095); consent actions (FEAT-043).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 |

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-092-P01 | Inbox and thread readers | DOM-CRM | SRV-001 | FR-092-001, FR-092-002, FR-092-003 |
| FEAT-092-P02 | Automatic outbound reply record | DOM-CRM | SRV-001 | FR-092-004, FR-092-005 |
| FEAT-092-P03 | Job ledger records accepted answers | DOM-LOA | SRV-001 | FR-092-006 |
| FEAT-092-P04 | Customer navigation slot | DOM-PRJ | SRV-001 | FR-092-007 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-092-001](requirements/FR-092-001-inbox-list-scoped-to-the-selected-businesss.md) | Inbox list scoped to the selected Business's tenant | FEAT-092-P01 |
| [FR-092-002](requirements/FR-092-002-thread-read-shows-both-directions-oldest-first.md) | Thread read shows both directions oldest-first | FEAT-092-P01 |
| [FR-092-003](requirements/FR-092-003-the-readers-are-read-only-by-construction.md) | The readers are read-only by construction | FEAT-092-P01 |
| [FR-092-004](requirements/FR-092-004-one-recorded-reply-per-inbound-message-in.md) | One recorded reply per inbound message, in scope | FEAT-092-P02 |
| [FR-092-005](requirements/FR-092-005-acceptance-is-recorded-as-acceptance-never-delivery.md) | Acceptance is recorded as acceptance, never delivery | FEAT-092-P02 |
| [FR-092-006](requirements/FR-092-006-an-accepted-answer-reaches-crm-in-the.md) | An accepted answer reaches CRM in the job's own transaction | FEAT-092-P03 |
| [FR-092-007](requirements/FR-092-007-the-customer-domain-slot-opens-dashboard-and.md) | The customer domain slot opens Dashboard and Inbox | FEAT-092-P04 |
| [NFR-092-001](requirements/NFR-092-001-inbox-size-bound.md) | Inbox size bound | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
