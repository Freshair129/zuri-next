---
id: FR-089-001
title: "Strategy revision and decision"
delivery: building
legacy: [FR-159]
relations:
  specified_by: [SDD-089]
  decided_by: [none]
---

# FR-089-001 — Strategy revision and decision

The system SHALL let a Business OWNER draft a Business-scoped `MarketingPlan` whose
edits append immutable canonical title/payload `MarketingPlanVersion` rows, let an
independent reviewer record a PASS `MarketingReview`, and let an accountable decision
maker record an expiring, append-only `MarketingDecision` bound to the exact current
revision and its payload hash. Reads SHALL require `growth` visibility; writes SHALL
require Business ownership, with expected-version compare-and-swap and one atomic
audit event per mutation.

## Acceptance criteria

- AC-089-001-01 — Given a plan at revision 2, when a write targets revision 1, then it is refused (stale-version conflict).
- AC-089-001-02 — Given a decision bound to revision 2's hash, when revision 3 is later created, then the decision still reads as bound to revision 2 — it is never silently reinterpreted against the new revision.
- AC-089-001-03 — Given a decision that has expired, when it is read, then its expired state is explicit, never presented as still active.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-plan-service.js`, `apps/server/src/app/api/growth/plans/route.js`, `.../plans/[id]/route.js`

## Verification

- TC-089-001 — Strategy revision/review/decision compare-and-swap (see [verification.md](../verification.md))
- TC-089-007 — Console end-to-end flows (see [verification.md](../verification.md))
