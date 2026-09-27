---
id: FR-016-004
title: "Contract-gated release on the Board"
delivery: declared
legacy: [FR-085]
relations:
  decided_by: [ADR-010]
---

# FR-016-004 — Contract-gated release on the Board

The system SHALL mark a WorkItem as held on its Board card — naming, as a link, the predecessor it
waits for — while any inbound edge carries a declared, unsatisfied contract, before the user tries
to move it; an edge whose contract is undeclared SHALL NOT hold anything.

## Acceptance criteria

- AC-016-004-01 — Given an inbound edge with an unsatisfied declared contract, then the card shows "held — waiting for <predecessor>".
- AC-016-004-02 — Given only undeclared inbound contracts, then the card is not held.
