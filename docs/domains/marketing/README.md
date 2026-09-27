---
id: DOM-MKT
title: Marketing
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: []
---

# DOM-MKT — Marketing

## Purpose
Turns Business objectives and evidence into reviewed, immutable Strategy plans,
coordinates channel execution (Campaigns, Content, Operations, LINE broadcast
planning) without duplicating Project Manager's work/stock system or another
domain's authority, and — newer than this pass's slice — exposes a read-only
Marketing Insights reporting surface over brand performance metrics. Route/
permission key `growth`.

## Ubiquitous language
- **MarketingPlan / MarketingPlanVersion** — Business-scoped Strategy identity with
  immutable, hashed canonical payload revisions.
- **MarketingReview / MarketingDecision** — an independent human PASS review and an
  expiring, append-only decision bound to an exact plan revision/hash.
- **PlanEnvelope handoff** — a deterministic envelope generated from an approved
  Strategy revision, committed through Project Manager's existing importer with a
  Marketing receipt in the same transaction; delivery progress never claims
  marketing KPI attainment.
- **MarketingInitiative** (Campaign) — a Business-scoped initiative bound to one
  versioned Strategy brief and an authorized PM execution projection.
- **MarketingContentBrief** — an immutable creative version with exact Files
  references and declared rights; Files remains the binary owner.
- **MarketingOperationsIntake** — an intake request (capability, objective,
  required date, evidence, accountable owner) composed with PM/Approvals/Handoffs
  read projections into one Operations aggregate.
- **MarketingBroadcastIntent / …Version** — a Business-scoped LINE broadcast
  planning identity with append-only immutable revisions; the payload stores only
  LINE OA account and Marketing content references — never a message body,
  recipients or provider credentials; dispatch is always unavailable in this slice.
- **Marketing Insights** — a read-only reporting surface (brands, metric summary,
  metric daily series + CSV export, content performance) sourced from a snapshot so
  a chart and its export always agree; an unknown value is never shown as 0.

## Owned data
- `MarketingPlan`, `MarketingPlanVersion`, `MarketingReview`, `MarketingDecision`,
  `MarketingHandoff` — Strategy plan lifecycle and PM handoff receipt.
- `MarketingInitiative` — Campaign aggregate.
- `MarketingContentBrief`, `MarketingContentVersion`, `MarketingContentReview`,
  `MarketingContentDecision` — Content/Creative lifecycle.
- `MarketingOperationsIntake` — Operations intake request.
- `MarketingBroadcastIntent`, `MarketingBroadcastIntentVersion` — LINE broadcast
  planning identity and append-only revisions.
- Marketing Insights snapshot/sync-run state (persistence deferred to a later
  iteration — see FEAT-090 §9; fixture-only today).

## Business rules
No rule found here that is not already covered by a legacy `BR-xxx` PRD row or by the
requirements below; the domain's aggregate invariants (expected-version
compare-and-swap on every write, one audit event per mutation, scope derived from
the server-loaded Business never a payload tenant id, append-only broadcast
revisions) are folded into the FR ACs rather than re-declared as separate
`BR-MKT-*` rows.

## Public contracts
- `API-260`, `API-261`
- `API-247`
- `API-248`, `API-249`
- `API-257`, `API-258`
- `API-246`
- `API-245`, `API-259`
- `API-250`, `API-256`, `API-252`,
  `API-253`, `API-251`
- `API-254`, `API-255` (declared, not
  implemented — see FEAT-090 §9)

## Capabilities
Not used — two features cover this pass's declared scope.

## Depends on
- `legacy:` Business Strategy's `BusinessRoadmap`/`BusinessGoal` read projection
  (reused, never cloned).
- `legacy:` Project Manager's `PlanEnvelope` importer and protected roadmap read
  (Marketing calls it; PM owns Project/Workstream/work/progress).
- `legacy:` Integration's credential/provider adapters — a selected channel
  (Meta Ads, TikTok Ads, GA4, SEO) in a draft is planning intent only; it never
  connects an account or claims available measurements by itself.
- `legacy:` LINE OA Studio's account configuration and any future delivery
  contract — broadcast planning references it but owns no send path.
- `legacy:` file-management authority (Files) — Content references exact Files
  assets and never duplicates bytes.
- `legacy:` Identity's Business grant/`growth` visibility gate — the first write
  policy is Business OWNER plus `growth` visibility; no new privileged role.

## Legacy sources
- Charter: `docs/domains/marketing/CHARTER.md`
- Feature notes: `docs/domains/marketing/features/FR-159-strategy-plans.md`,
  `FR-160-campaign-initiatives.md`, `FR-157-content-creative.md`,
  `FR-162-operations-coordination.md`, `FR-185-broadcast-planning-intent.md`
- `docs/PRD-SDD-v1.0.md` rows FR-089-004, FR-089-002, FR-089-001, FR-089-003, FR-089-005, FR-089-006,
  FR-090-001, FR-090-002
- `docs/FEATURES.md` row FEAT-089
- No domain-specific ADR is assigned to Marketing in this pass.

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (2)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-089](../../features/FEAT-089-marketing-planning-and-execution/feature.md) | Marketing planning and accountable execution | building | 7 |
| [FEAT-090](../../features/FEAT-090-marketing-insights/feature.md) | Marketing Insights | building | 3 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

<!-- END GENERATED -->
