---
id: FR-085-002
title: "Deterministic preview and persisted calculation lineage"
delivery: building
legacy: [FR-253 (split 2/3 — evaluator and lineage)]
relations:
  specified_by: [SDD-085]
  decided_by: [ADR-077]
---

# FR-085-002 — Deterministic preview and persisted calculation lineage

The system SHALL evaluate every price — console preview, persisted calculation, and
any migrated agent caller — through the same evaluator, producing integer-satang
results via exact decimal/rational arithmetic, and SHALL pin the rule/input/evaluator
version lineage on every persisted `PricingCalculation`. Mandatory floor and rounding
SHALL stay outside the editable candidate-price expression. A trusted, already-landed
cost path SHALL NOT add factory/freight a second time.

## Acceptance criteria

- AC-085-002-01 — Given identical rule set, inputs and evaluator version, when evaluated twice, then the result is byte-identical both times (deterministic).
- AC-085-002-02 — Given a persisted `PricingCalculation`, when read back, then its rule id/version, input snapshot and evaluator identity are all reconstructable.
- AC-085-002-03 — Given a division-by-zero or overflow condition in a formula, when evaluated, then it is refused rather than producing an incorrect satang value.

## Implementation

- `apps/server/src/modules/commerce/domain/pricing-engine.js`, `domain/pricing-formula.js`, `apps/server/src/app/api/commerce/pricing-rules/preview/route.js`, `.../calculate/route.js`

## Verification

- TC-085-002 — Deterministic evaluation and lineage pinning (see [verification.md](../verification.md))
- TC-085-004 — Console end-to-end pricing-rules flow (see [verification.md](../verification.md))
