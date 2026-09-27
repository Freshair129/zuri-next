---
id: FR-089-003
title: "Campaign initiatives bound to a Strategy revision"
delivery: building
legacy: [FR-160, FR-159]
relations:
  specified_by: [SDD-089]
  decided_by: [none]

---

# FR-089-003 — Campaign initiatives bound to a Strategy revision

The system SHALL let a Business OWNER create a `MarketingInitiative` with a distinct
UUID and one versioned Strategy brief, whose calendar dates/offer/conditions are
included in its reviewed hash; revise, explicitly bind a valid same-plan PM handoff,
and close or cancel with rationale, all through audited optimistic transactions.
Metrics SHALL remain unavailable without approved evidence — never fabricated or
defaulted to zero.

## Acceptance criteria

- AC-089-003-01 — Given an initiative bound to Strategy plan P, when a PM handoff from a different plan is bound to it, then the bind is refused (same-plan requirement).
- AC-089-003-02 — Given an initiative with no approved metrics evidence, when its Results view is read, then metrics show explicitly unavailable, not zero.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-campaign-service.js`, `marketing-campaign-execution.js`, `apps/server/src/app/api/growth/campaigns/route.js`, `.../campaigns/[id]/route.js`

## Verification

- TC-089-003 — Campaign initiative lifecycle and same-plan binding (see [verification.md](../verification.md))
- TC-089-007 — Console end-to-end flows (see [verification.md](../verification.md))
