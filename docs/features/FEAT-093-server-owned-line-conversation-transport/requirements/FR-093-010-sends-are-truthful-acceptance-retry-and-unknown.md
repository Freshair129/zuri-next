---
id: FR-093-010
title: "Sends are truthful: acceptance, retry and UNKNOWN"
part: FEAT-093-P04
owner: DOM-LOA
delivery: implemented
legacy: [FR-149 (split 8/10)]
relations:
  specified_by: [SDD-093, API-147]
  depends_on: [API-117]
  derived_from: [BR-056]
---

# FR-093-010 — Sends are truthful: acceptance, retry and UNKNOWN

The system SHALL persist the answer before sending, send by Reply while the sealed
token is valid and otherwise by Push only if the account allows delayed Push, mark the
job `SENDING` with a 30 s lease before the external call, and on the outcome: record
provider acceptance (never delivery) and hand it to CRM (FEAT-092); retry a retryable
Push with exponential backoff (1 s·2^attempts, capped at 60 s) within a 23 h window;
fall back from Reply to Push only on a definite `LINE_HTTP_400` when Push is allowed;
never switch method after an ambiguous outcome; end ambiguous Reply attempts or expired
Push windows as `UNKNOWN` (`REPLY_OUTCOME_UNKNOWN`, `PUSH_RETRY_WINDOW_EXPIRED`) so no
duplicate is sent.

## Acceptance criteria

- AC-093-010-01 — Given a Reply whose HTTP call times out, when settled, then the job is `UNKNOWN` and is never re-sent.
- AC-093-010-02 — Given a Push that fails retryably, when settled, then it returns to `READY` with a later `availableAt`.

## Verification

- TC-093-005 — Job ledger, fencing, send outcomes and cadence (see [verification.md](../verification.md))
