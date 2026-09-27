---
id: FR-016-003
title: "Handoff Contract on a dependency edge"
delivery: declared
legacy: [FR-084]
relations:
  decided_by: [ADR-010]
  derived_from: [BR-062]
---

# FR-016-003 — Handoff Contract on a dependency edge

The system SHALL store on each Dependency one nullable JSON Handoff Contract (validated by a schema
at the boundary) stating the deliverable the predecessor owes and the acceptance condition: either a
reference to an existing Gate (whose status is then the single source of truth) or an explicit
satisfied/unsatisfied mark with provenance. No new edge SHALL be created without a contract; legacy
edges without one SHALL render as "contract undeclared" and be listed for backfill.

## Acceptance criteria

- AC-016-003-01 — Given a contract referencing Gate G, when G becomes PASSED, then the contract reads satisfied without any edge update.
- AC-016-003-02 — Given a legacy edge, then it shows "contract undeclared".
