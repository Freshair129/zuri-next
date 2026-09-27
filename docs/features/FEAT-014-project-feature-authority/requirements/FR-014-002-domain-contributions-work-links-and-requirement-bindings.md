---
id: FR-014-002
title: "Domain contributions, work links and requirement bindings"
delivery: building
legacy: [FR-252 (split 2/7 — relationships)]
relations:
  specified_by: [API-055, API-059, API-060, API-056]
---

# FR-014-002 — Domain contributions, work links and requirement bindings

The system SHALL replace, as whole sets (≤ 200 rows each), a Feature's domain contributions
(`domainId` + responsibility; no duplicate of the primary domain), its WorkItem links (items of
the same Project only; `allocationMode` UNALLOCATED with null allocations, or COMPLETE_SPLIT
where every link carries basis points and the item's total across Features is exactly 10000),
and its requirement bindings (`sourceNamespace`, `requirementKey`, 64-hex `revisionHash`,
`acceptanceRef`) each pinned to a verified GovernanceSnapshot of the same Project whose manifest
contains that revision. It SHALL also replace the Feature↔WorkItem graph for a set of affected
items across up to 50 Features in one command, refusing a submitted graph whose membership differs
from the affected items (422 `GRAPH_MEMBERSHIP_MISMATCH`).

## Acceptance criteria

- AC-014-002-01 — Given a WorkItem of another Project, then 422 `CROSS_PROJECT_WORK_LINK`.
- AC-014-002-02 — Given COMPLETE_SPLIT allocations summing to 9000, then 422 `INVALID_ALLOCATION`.
- AC-014-002-03 — Given a binding whose revision is not in the snapshot manifest, then 422 `REQUIREMENT_REVISION_MISMATCH`.

## Verification

- TC-014-001 — Feature mutations, CAS, idempotency, audit (see [verification.md](../verification.md))
