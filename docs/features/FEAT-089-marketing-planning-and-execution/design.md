---
id: SDD-089
title: "Marketing planning and accountable execution — design"
---

# SDD-089 — Marketing planning and accountable execution design

- **Components:**
  - `CMP-287` — `application/marketing-plan-service.js`: plan/version/
    review/decision writer.
  - `CMP-286` — `application/marketing-pm-handoff-service.js`:
    PlanEnvelope generation and PM importer commit.
  - `CMP-281` — `application/marketing-campaign-service.js` +
    `marketing-campaign-execution.js`: initiative lifecycle and PM execution
    projection.
  - `CMP-282` — `application/marketing-content-service.js` +
    `marketing-content-references.js`: brief/version/review/decision, Files
    reference validation.
  - `CMP-285` — `application/marketing-operations-service.js`: intake
    writer and composed Operations DTO.
  - `CMP-280` — `application/marketing-broadcast-service.js`: intent/
    revision append-only writer.
  - `CMP-279` — `application/marketing-authority.js`: the `growth`
    visibility/ownership ladder.
- **Data owned:** `MarketingPlan`, `MarketingPlanVersion`, `MarketingReview`,
  `MarketingDecision`, `MarketingHandoff`, `MarketingInitiative`,
  `MarketingContentBrief/Version/Review/Decision`, `MarketingOperationsIntake`,
  `MarketingBroadcastIntent`, `MarketingBroadcastIntentVersion`.
- **Contracts exposed:** `API-260`, `API-261`,
  `API-247`, `API-248`, `API-249`,
  `API-257`, `API-258`, `API-246`,
  `API-245`, `API-259`.
- **Contracts consumed:** `legacy:` PM's `PlanEnvelope` importer and protected
  roadmap read; `legacy:` Business Strategy's roadmap/goal projection; `legacy:`
  Files' asset service; `legacy:` LINE OA Studio's account configuration.
- **Main sequence** (strategize → decide → hand off → execute):
  1. Owner drafts/revises a `MarketingPlan` (`POST/PATCH /api/growth/plans`).
  2. A reviewer PASSes; an accountable decision maker records a decision bound to
     the exact revision hash.
  3. `POST /api/growth/plans/[id]/handoff` generates the `PlanEnvelope`, previews the
     PM diff, commits through PM's importer, writes one Marketing receipt.
  4. A Campaign initiative binds that handoff and tracks Brief/Plan/Timeline/
     Results/Decisions views.
  5. Operations composes Intake/Calendar/Approvals/Handoffs into one DTO for the
     `/growth/operations` console.
  6. A broadcast intent is drafted/revised/archived independently; dispatch stays
     unavailable.
- **Failure modes:** stale-version writes refused across every aggregate; handoff
  refused on expired/revoked decision, stale content or scope mismatch; a replayed
  handoff reconciles rather than duplicating; PM roadmap read failure surfaces as
  explicit staleness in Operations, not silent omission; a broadcast payload
  carrying a message body/recipient/credential is rejected by schema, not filtered
  after the fact.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-089-001 | `apps/server/src/modules/marketing/application/marketing-plan-service.js`, `apps/server/src/app/api/growth/plans/route.js`, `.../plans/[id]/route.js` |
| FR-089-002 | `apps/server/src/modules/marketing/application/marketing-pm-handoff-service.js`, `apps/server/src/app/api/growth/plans/[id]/handoff/route.js` |
| FR-089-003 | `apps/server/src/modules/marketing/application/marketing-campaign-service.js`, `marketing-campaign-execution.js`, `apps/server/src/app/api/growth/campaigns/route.js`, `.../campaigns/[id]/route.js` |
| FR-089-004 | `apps/server/src/modules/marketing/application/marketing-content-service.js`, `marketing-content-references.js`, `apps/server/src/app/api/growth/content/**` |
| FR-089-005 | `apps/server/src/modules/marketing/application/marketing-operations-service.js`, `apps/server/src/app/api/growth/operations/**` |
| FR-089-006 | `apps/server/src/modules/marketing/application/marketing-broadcast-service.js`, `apps/server/src/app/api/growth/broadcast-intents/**` |
