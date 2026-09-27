---
id: FR-065-001
title: "Phase 1 golden question evaluation"
delivery: building
legacy: [FR-053]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-065-001 — Phase 1 golden question evaluation

The system SHALL validate a versioned corpus of at least 20 approved
business questions (each carrying an expected registered query, expected
evidence codes, an expected policy outcome, and allowed numeric claims),
reject a corpus carrying a forbidden field pattern (password, cost, margin,
invoice, email, phone, reply-token-like text), and evaluate the corpus
through injected fake ports by default or an environment-only real-provider
mode, emitting a redacted per-case report (no raw evidence body, only a
SHA-256 and pass/fail/unsupported-claim counts) that requires 20/20 with
zero unsupported numeric claims to pass.

## Acceptance criteria

- AC-065-001-01 — Given a corpus containing the field name `cost` or `margin` anywhere in its JSON, when `validateGoldenQuestionCorpus` runs, then it throws `GOLDEN_CORPUS_FORBIDDEN_DATA`.
- AC-065-001-02 — Given a corpus with fewer than 20 cases, when `parseGoldenQuestionCorpus` runs, then Zod validation fails (`cases: z.array(...).min(20)`).
- AC-065-001-03 — Given a real-provider environment missing `ZURI_GOLDEN_PROVIDER`, `ZURI_GOLDEN_MODEL` or `ZURI_GOLDEN_PROVIDER_API_KEY`, when `readRealProviderConfiguration` runs, then it throws `REAL_PROVIDER_ENV_REQUIRED` rather than silently falling back to the fake evaluator.

## Implementation

- `apps/server/src/modules/agent/golden-evaluation.js`, `apps/server/src/modules/agent/activation-readiness-contract.js`
