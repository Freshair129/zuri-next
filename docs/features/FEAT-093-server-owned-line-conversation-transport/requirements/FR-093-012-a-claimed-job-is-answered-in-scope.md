---
id: FR-093-012
title: "A claimed job is answered in scope with a bounded reply"
part: FEAT-093-P05
owner: DOM-AGT
delivery: implemented
legacy: [FR-149 (split 10/10)]
relations:
  specified_by: [SDD-093]
  depends_on: [FEAT-091]
  decided_by: [ADR-047]
---

# FR-093-012 — A claimed job is answered in scope with a bounded reply

The system SHALL answer a claimed job only for the job's own Tenant/Business/account
scope (`LINE_ANSWER_SCOPE_MISMATCH` otherwise) through the server answer adapter using
the Business's model credential (FEAT-091 order) over a bounded evidence packet from
business knowledge: with no evidence the model SHALL NOT be called and a fixed Thai
"no matching product information" reply is prepared; model output that fails evidence
verification (unsupported numbers, codes or high-risk delivery/stock/warranty claims) or
a provider error SHALL be replaced by an answer composed deterministically from the
evidence records. The reply text is bounded to 1–5 000 characters (no split surrogate).
Failures before an answer exists — credential resolution, trace journal, memory receipt
— SHALL settle the job `FAILED` with a classified code (`EXECUTION_FAILED`,
`REPLY_DEADLINE_MISSED`) or `UNKNOWN` when a memory injection receipt is ambiguous.

## Acceptance criteria

- AC-093-012-01 — Given a Business whose model credential cannot be resolved, when the job is executed, then it settles `FAILED` with `EXECUTION_FAILED` and nothing is sent.
- AC-093-012-02 — Given a question with no matching business evidence, when answered, then no model call is made and the fixed reply is prepared.
- AC-093-012-03 — Given model output quoting a price absent from the evidence, when verified, then the evidence-composed answer is used instead.

## Implementation

- apps/server/src/modules/agent/server-line-answer.js

## Verification

- TC-093-007 — Server answer adapter (see [verification.md](../verification.md))
