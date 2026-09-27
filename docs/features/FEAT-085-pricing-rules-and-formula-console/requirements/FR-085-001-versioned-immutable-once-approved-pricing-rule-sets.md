---
id: FR-085-001
title: "Versioned, immutable-once-approved pricing rule sets"
delivery: building
legacy: [FR-253 (split 1/3 — rule set lifecycle)]
relations:
  specified_by: [SDD-085]
  decided_by: [ADR-077]
---

# FR-085-001 — Versioned, immutable-once-approved pricing rule sets

The system SHALL let a Business OWNER author a `PricingRuleSet` as a bounded, parsed
arithmetic expression over declared typed variables and an allowed function set, with
an acyclic dependency graph — never JavaScript/Python `eval`. A draft rule set SHALL
require its current revision to write further; approval SHALL record actor, reason
and effective date and make the rule set immutable; expiry or revocation SHALL
preclude new calculations from that version while existing pinned results are
unaffected; a future-effective version SHALL NOT activate early; a missing active
rule set SHALL fail closed (no default/fallback price).

## Acceptance criteria

- AC-085-001-01 — Given a draft rule set at revision 3, when a write targets revision 2, then it is refused (stale-revision conflict).
- AC-085-001-02 — Given an approved rule set, when any edit is attempted, then it is refused — approved rule sets are immutable; a correction requires a new version.
- AC-085-001-03 — Given a rule set with a self-referencing (cyclic) variable dependency, when it is submitted, then it is rejected before approval.
- AC-085-001-04 — Given no active rule set for a product/category at evaluation time, when a price is requested, then the request fails closed rather than returning a stale or default price.
- AC-085-001-05 — Given a revoked rule set, when a new calculation is attempted against it, then it is refused, while a previously persisted calculation using it remains readable unchanged.

## Implementation

- `apps/server/src/modules/commerce/application/pricing-rules-service.js`, `domain/pricing-rules.js`, `apps/server/src/app/api/commerce/pricing-rules/route.js`, `.../pricing-rules/[id]/route.js`, `.../pricing-rules/[id]/actions/route.js`

## Verification

- TC-085-001 — Rule-set lifecycle, revision CAS, cyclic-dependency rejection (see [verification.md](../verification.md))
- TC-085-004 — Console end-to-end pricing-rules flow (see [verification.md](../verification.md))
