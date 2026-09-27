---
id: FR-089-002
title: "Execution handoff to Project Manager"
delivery: building
legacy: [FR-158, FR-159]
relations:
  specified_by: [SDD-089]
  decided_by: [none]

---

# FR-089-002 — Execution handoff to Project Manager

The system SHALL generate a deterministic `PlanEnvelope` from one exact approved
Strategy revision for a same-Business Workspace, preview the PM diff, and commit
through the existing authorized PM importer with the reviewed hash, a concurrency
guard, an audit event and a Marketing receipt — all in one transaction. A replay
SHALL reconcile to exactly one receipt per revision/Workspace pair; a revoked or
expired decision, stale content, or a scope mismatch SHALL prevent new execution.
Delivery progress reported back from PM SHALL never be presented as marketing KPI
attainment.

## Acceptance criteria

- AC-089-002-01 — Given an approved revision with no prior handoff to a Workspace, when handoff commit is called, then exactly one `MarketingHandoff` receipt exists afterward, in the same transaction as the PM import.
- AC-089-002-02 — Given the identical revision/Workspace committed twice, when the second commit is attempted, then it reconciles to the existing receipt rather than creating a second one.
- AC-089-002-03 — Given a decision that has since expired or been revoked, when handoff commit is attempted against it, then it is refused.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-pm-handoff-service.js`, `apps/server/src/app/api/growth/plans/[id]/handoff/route.js`

## Verification

- TC-089-002 — PM handoff generation, replay reconciliation, refusal states (see [verification.md](../verification.md))
