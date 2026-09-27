---
id: FEAT-045
title: Sales tasks (งานขาย)
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-022, FR-161]
relations:
  depends_on: [FEAT-041, FR-024-003, FR-003-009]
  decided_by: [ADR-040]
---

# FEAT-045 — Sales tasks (งานขาย)

## Summary

The follow-ups a Business's sales team owes customers — call, LINE message, email,
meeting, demo, quote — with a due day or date range, an assignee, a status machine
and an outcome, optionally linked to a CRM Customer and Conversation. Used from the
web console at `/customer/sales-tasks`. Deliberately a CRM activity record, not a
project `WorkItem` (no milestones, progress or children).

## Scope

**In:** create, list, read, and act on sales tasks; computed due state and summary.
**Out:** reminders/notifications; recurring tasks; project work items (DOM-PRJ).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-045-001](requirements/FR-045-001-a-sales-task-is-a-business-scoped.md) | A sales task is a Business-scoped record with a human code | — |
| [FR-045-002](requirements/FR-045-002-links-stay-inside-the-businesss-tenant-and.md) | Links stay inside the Business's tenant and the viewer's sight | — |
| [FR-045-003](requirements/FR-045-003-status-machine-with-compare-and-swap-and.md) | Status machine with compare-and-swap and no deletion | — |
| [FR-045-004](requirements/FR-045-004-due-state-and-summary-are-computed-on.md) | Due state and summary are computed on read; access is gated | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
