---
id: FR-019-001
title: "Business strategy read model"
delivery: implemented
legacy: [FR-041]
relations:
  specified_by: [SDD-019, API-017]
  decided_by: [ADR-004]
---

# FR-019-001 — Business strategy read model

The system SHALL return, for one Business visible to the viewer, its Roadmaps with horizons ordered by
position, Goals nested under their horizon (status, priority, progress, perspective, dates, linked
Projects, Key Results with computed progress/status), and the Business's Projects; a Business not
visible SHALL be refused before any lookup. Goals SHALL always be reachable through a horizon.

## Acceptance criteria

- AC-019-001-01 — Given a Roadmap with horizons at positions 2 and 1, then they are returned 1, 2.
- AC-019-001-02 — Given an invisible Business, then the strategy read is refused and no data is returned.

Delivery: live

## Implementation

- apps/server/src/modules/business/application/business-strategy-service.js; apps/server/src/app/api/business/strategy/route.js

## Verification

- TC-019-001 — Strategy read model (see [verification.md](../verification.md))
- TC-019-004 — Strategy calculators (see [verification.md](../verification.md))
