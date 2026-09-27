---
id: FR-044-002
title: "Entity resolution never merges on weak evidence"
delivery: live
legacy: [FR-078 (split 2/5)]
relations:
  specified_by: [SDD-044]
---

# FR-044-002 — Entity resolution never merges on weak evidence

The system SHALL resolve each candidate to `AUTO_MATCH`, `NEW_CANDIDATE`,
`REVIEW_REQUIRED`, `UNRESOLVED` or `REJECTED`: exact source-key dedupe within a
snapshot; tax-id match only when one-to-one and corroborated; exact normalized-name
match only with one corroborating attribute (email, phone or postcode) and exactly one
candidate; name-only, conflicting, duplicate and cross-Business candidates go to review;
an existing Person/Customer is linked only by explicit mapping or approved decision.

## Acceptance criteria

- AC-044-002-01 — Given two source rows sharing only a normalized name, when resolved, then both are `REVIEW_REQUIRED` and neither is written.
- AC-044-002-02 — Given a tax id shared by two different names, when resolved, then the rows go to review.

## Verification

- TC-044-001 — Contract envelope, resolution and exclusions (see [verification.md](../verification.md))
