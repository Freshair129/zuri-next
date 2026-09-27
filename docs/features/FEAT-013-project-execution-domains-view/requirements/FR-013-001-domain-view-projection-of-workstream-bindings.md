---
id: FR-013-001
title: "Domain-view projection of Workstream bindings"
delivery: live
legacy: [FR-251 (split 1/2 — projection)]
relations:
  specified_by: [SDD-013, API-053]
  decided_by: [ADR-008]
  derived_from: [BR-004]
---

# FR-013-001 — Domain-view projection of Workstream bindings

The system SHALL return, for an authorized Project reader, a versioned `ProjectDomainView`
DTO listing each domain id bound by an active Workstream (sorted, immutable ids with display
labels from the product-domain catalogue), with primary and supporting Workstream counts,
technical owners as a separate list, and active WorkItem counts deduplicated within each domain;
the root SHALL carry the Project's unique active WorkItem total including unbound work and the
count of unbound Workstreams. Overlapping domain counts SHALL never be summed into the total or
into progress; existing strategy-weighted Project progress SHALL be reported unchanged. Unknown
domain ids SHALL be retained as `UNMAPPED`; a Project without bindings SHALL return 200 with
`domains: []`. Feature, snapshot, blocker, contract and gap fields SHALL be explicit
`UNAVAILABLE`/`NOT_BOUND`, never zero.

## Acceptance criteria

- AC-013-001-01 — Given one item in a Workstream bound primary DOM-COMMERCE and supporting DOM-CRM, then each domain counts it once and the root total is 1.
- AC-013-001-02 — Given a binding `DOM-UNKNOWN`, then it appears with state `UNMAPPED`.
- AC-013-001-03 — Given soft-deleted items or an item whose container belongs to another Workstream, then they are excluded.

## Implementation

- apps/server/src/modules/project-manager/application/project-domain-read-model.js; apps/server/src/modules/project-manager/project-domain-catalog.js

## Verification

- TC-013-001 — Domain read model (see [verification.md](../verification.md))
- TC-013-003 — Browser behaviour (see [verification.md](../verification.md))
