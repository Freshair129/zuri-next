---
id: FEAT-089
title: Marketing planning and accountable execution
type: domain-feature
owner: DOM-MKT
runtime: SRV-001
status: approved
delivery: building
legacy: [FEAT-021]
relations:
  depends_on: [legacy:PM-plan-envelope-importer, legacy:LINE-OA-Studio-account-config]
  decided_by: []
---

# FEAT-089 — Marketing planning and accountable execution

## Summary

Turns Business objectives into immutable, independently reviewed Strategy evidence;
generates a deterministic execution handoff into Project Manager without ever
claiming PM delivery progress as marketing KPI attainment; runs Campaign initiatives
and Content/Creative under the same review/decision discipline; composes Operations
intake with PM/Approvals/Handoffs into one read-safe aggregate; and plans (never
sends) LINE OA broadcasts as a Business-scoped, append-only revision history.

## Scope

**In:** Strategy plan draft/revision/review/decision; PM handoff generation and
commit; Campaign initiative CRUD bound to a Strategy revision; Content brief/
version/review/decision; Operations intake and its composed Calendar/Approvals/
Handoffs projections; Business-scoped LINE broadcast planning identity and
append-only revisions.

**Out:** Marketing Insights reporting (FEAT-090); connecting a real ad/GA4/SEO
account (Integration's future contract); CRM audience/consent resolution; LINE send/
dispatch (always unavailable in this slice); creating a second PM task/work system,
CRM conversation, Commerce stock record or provider action.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-MKT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-089-001](requirements/FR-089-001-strategy-revision-and-decision.md) | Strategy revision and decision | — |
| [FR-089-002](requirements/FR-089-002-execution-handoff-to-project-manager.md) | Execution handoff to Project Manager | — |
| [FR-089-003](requirements/FR-089-003-campaign-initiatives-bound-to-a-strategy-revision.md) | Campaign initiatives bound to a Strategy revision | — |
| [FR-089-004](requirements/FR-089-004-content-and-creative.md) | Content and Creative | — |
| [FR-089-005](requirements/FR-089-005-operations-coordination.md) | Operations coordination | — |
| [FR-089-006](requirements/FR-089-006-line-broadcast-planning-intent.md) | LINE broadcast planning intent | — |
| [NFR-089-001](requirements/NFR-089-001-server-loaded-scope-never-a-payload-tenant.md) | Server-loaded scope, never a payload tenant id | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
