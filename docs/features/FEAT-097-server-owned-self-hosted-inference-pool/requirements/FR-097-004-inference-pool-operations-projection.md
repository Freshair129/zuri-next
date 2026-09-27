---
id: FR-097-004
title: "Inference pool operations projection"
part: FEAT-097-P04
owner: DOM-PLT
delivery: declared
legacy: [FR-258]
relations:
  decided_by: [ADR-062]
  depends_on: [FEAT-097-P01, FEAT-097-P03]
---

# FR-097-004 — Inference pool operations projection

The system SHALL expose an installation-operator-only, removable operational
projection of self-hosted node readiness, capacity, observation age and
bounded failure state, with safe delegated drain/resume controls and
truthful labeling of unavailable data.

## Acceptance criteria

- AC-097-004-01 — Given a viewer without installation-operator authority, when they attempt to read pool/node data, then access SHALL be refused; a Business-level role SHALL NOT substitute for `isInstallationOperator`.
- AC-097-004-02 — Given an unknown, stale or unverified metric, when it is displayed, then it SHALL be labeled with its sample age and provenance rather than shown as zero or as healthy.
- AC-097-004-03 — Given the operations projection is removed or unavailable, when the underlying router/observer keep running, then pool scheduling correctness SHALL be unaffected.
- AC-097-004-04 — Given an operator issues a drain/resume action from the projection, when it is applied, then it SHALL delegate to Integration's or Agent's owning audited service with a fresh permission/version check, and SHALL never bypass a revoked node or profile.

## Implementation

- Not implemented — approved design only (legacy `FR-097-004`, `code: []`, `tests: []`)
