---
id: FR-085-003
title: "Scoped, allowlisted sell-side Knowledge admission"
delivery: building
legacy: [FR-253 (split 3/3 — Knowledge admission), FR-187]
relations:
  specified_by: [SDD-085]
  decided_by: [ADR-077]

---

# FR-085-003 — Scoped, allowlisted sell-side Knowledge admission

The system SHALL admit only deliberately approved, allowlisted sell-side computed
price records into Knowledge, through the existing pre-Stage-1 admission contract
(`FR-075-001`) — never a direct substrate write, a fake stage success or automatic
publication on rule approval. A computed price's Knowledge visibility SHALL be
governed by its pinned policy checked against the *latest* effective approval at
admission, publication, query and citation-disclosure time; a revoked, expired or
superseded price SHALL fail closed, including a policy change discovered during
retrieval. A user-entered trial-input simulation SHALL NOT be treated as an
automatically verified catalog price.

## Acceptance criteria

- AC-085-003-01 — Given a rule-set revocation after a price was published to Knowledge, when that price is next queried or cited, then it fails closed (not served as still-valid).
- AC-085-003-02 — Given a simulation run with user-entered trial inputs, when results are produced, then they are never admitted to Knowledge as a catalog price without a separate deliberate approval step.
- AC-085-003-03 — Given an approved computed price, when it is admitted, then no cost, floor or margin value is exposed in the published sell-side record.

## Implementation

- `apps/server/src/modules/commerce/application/pricing-catalog-service.js`, `domain/pricing-source.js`, `apps/server/src/app/api/commerce/pricing-rules/catalog/route.js`

## Verification

- TC-085-003 — Scoped catalog admission and fail-closed revocation (see [verification.md](../verification.md))
