---
id: FR-089-004
title: "Content and Creative"
delivery: building
legacy: [FR-157]
relations:
  specified_by: [SDD-089]
  decided_by: [none]
---

# FR-089-004 — Content and Creative

The system SHALL let a Business-scoped brief persist immutable creative versions
with exact Files references and declared rights, subject to an independent review
and a revocable, time-bounded decision; every read (brief, PM production reference,
approved Library projection, creative/asset detail) SHALL revalidate owner scope,
file fingerprint and rights eligibility without duplicating file bytes or PM's own
data.

## Acceptance criteria

- AC-089-004-01 — Given a creative version referencing a Files asset the viewer's Business does not own, when read, then it is refused rather than served.
- AC-089-004-02 — Given a rights decision that has been revoked, when the creative is requested for use, then rights eligibility reads as ineligible, not the original grant.

## Implementation

- `apps/server/src/modules/marketing/application/marketing-content-service.js`, `marketing-content-references.js`, `apps/server/src/app/api/growth/content/**`

## Verification

- TC-089-004 — Content brief/version/review/rights revocation (see [verification.md](../verification.md))
- TC-089-007 — Console end-to-end flows (see [verification.md](../verification.md))
