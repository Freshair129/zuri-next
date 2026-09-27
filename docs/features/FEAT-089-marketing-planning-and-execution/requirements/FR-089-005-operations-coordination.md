---
id: FR-089-005
title: "Operations coordination"
delivery: building
legacy: [FR-162]
relations:
  specified_by: [SDD-089]
  decided_by: [none]
---

# FR-089-005 — Operations coordination

The system SHALL let Marketing persist `MarketingOperationsIntake` requests
(responsible capability, objective, required date, evidence reference, accountable
owner) through expected-version compare-and-swap with one audit event per mutation,
and SHALL expose one scope-checked Operations DTO composing Intake, Calendar (reads
the protected PM roadmap), Approvals (reads Marketing-owned review/decision
evidence) and Handoffs (reads only validated owner-domain receipts) — never creating
a duplicate PM task, CRM conversation, Commerce stock record or provider action.
Missing or stale source evidence SHALL be explicit.

## Acceptance criteria

- AC-089-005-01 — Given a PM roadmap read failure, when the Operations DTO is composed, then the Calendar section reads as explicitly stale/unavailable rather than silently omitted or stale-but-unlabeled.
- AC-089-005-02 — Given an intake at an expected version, when two concurrent updates race, then only one succeeds and the other is refused with a version conflict.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-operations-service.js`, `apps/server/src/app/api/growth/operations/**`

## Verification

- TC-089-005 — Operations composed DTO and staleness surfacing (see [verification.md](../verification.md))
