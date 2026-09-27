---
id: FR-036-002
title: "Domain map projects the FR-022-001, FR-022-002, FR-022-003 Product Readiness snapshot, computing nothing itself"
delivery: live
legacy: [FR-211]
relations:
  specified_by: [SDD-036]
  decided_by: [ADR-030]
---

# FR-036-002 — Domain map projects the FR-022-001, FR-022-002, FR-022-003 Product Readiness snapshot, computing nothing itself

`/control/roadmap` SHALL carry a second, operator-only tab (`?view=domains`)
listing every chartered domain with its generated status, requirement
progress, feature/FR/NFR counts and open gaps, and, for the selected domain,
its feature/FR inventory. The tab SHALL be a server-side projection of the
FR-022-001, FR-022-002, FR-022-003 snapshot (`runtime/domain-state.json`) with no fetch beyond a search/
filter box, no persistence and no write.

## Acceptance criteria

- AC-036-002-01 — Given the domain-state snapshot changes upstream, when the tab is next rendered, then it reflects the new snapshot without this domain recomputing any status itself.

## Implementation

- `apps/server/src/modules/platform-control/{program-domain-map.js,components/DomainMapView.jsx}`

## Verification

- TC-036-002 — Domain map is a pure projection of the FR-022-001, FR-022-002, FR-022-003 snapshot (see [verification.md](../verification.md))
