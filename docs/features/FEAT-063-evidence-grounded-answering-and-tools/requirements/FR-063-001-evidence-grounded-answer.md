---
id: FR-063-001
title: "Evidence-grounded answer"
delivery: implemented
legacy: [FR-049]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-063-001 — Evidence-grounded answer

The system SHALL classify a business question into exactly one registered
knowledge query (`selectRegisteredQuery`: a comparison of ≥2 product codes ⇒
`product_compare`; ≥1 product code ⇒ `product_detail`; otherwise
`product_search`), send only the resulting bounded evidence packet to the
configured model, and verify the model's candidate text before returning
it: any number in the candidate not present (after normalization) in the
question or the evidence records, any product-like code not present in the
evidence, or a high-risk claim phrase (free shipping, in-stock, warranty,
delivery-within-N-days) absent from the evidence itself SHALL be treated as
unsupported. An unsupported candidate, an empty evidence set, or a
provider failure SHALL all resolve to a deterministic fallback string built
only from the evidence records — never to an unverified model answer.

## Acceptance criteria

- AC-063-001-01 — Given a question naming two product codes and containing "เปรียบเทียบ", when `selectRegisteredQuery` runs, then it returns `{ queryId: 'product_compare', params: { productCodes: [...] }, limit: 3 }`.
- AC-063-001-02 — Given evidence with zero records, when `answerBusinessQuestion` runs, then it returns `grounded: false` and the fixed Thai "not found" message without ever calling `model.generate`.
- AC-063-001-03 — Given a model candidate that states a price not present in the evidence, when `verifyCandidate` runs, then `supported` is `false` and `answerBusinessQuestion` substitutes `deterministicFallback(evidence)` while still marking the answer `grounded: true` (the *evidence* is grounded even though the *model's wording* was rejected).
- AC-063-001-04 — Given `model.provider === 'ollama'` and the provider call throws, when `answerBusinessQuestion` runs, then it re-throws `OLLAMA_PROVIDER_NOT_READY` rather than silently falling back (local Ollama is an explicit evaluation provider, never an implicit fallback source — legacy FR-091-003, FR-091-004, FR-091-005).

## Implementation

- `apps/server/src/modules/agent/grounded-business-answer.js`, `apps/server/src/modules/agent/index.js`
