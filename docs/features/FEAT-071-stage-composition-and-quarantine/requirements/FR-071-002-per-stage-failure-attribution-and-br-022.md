---
id: FR-071-002
title: "Per-stage failure attribution and BR-067 quarantine"
delivery: implemented
legacy: [FR-119]
relations:
  specified_by: [CMP-223]
  derived_from: [BR-067]
  decided_by: [ADR-063]
---

# FR-071-002 — Per-stage failure attribution and BR-067 quarantine

The system SHALL extend the Tier 1 composition to catch each stage's failure
individually, reporting exactly which stages succeeded before the one that failed, and
SHALL classify every such failure with BR-067's complete envelope (`job_id`,
`artifact_id`, `stage`, `error_code`, `error_message`, `retry_count`,
`first_failed_at`, `last_failed_at`, `pipeline_version`) plus a
`RETRYABLE`/`NON_RETRYABLE`/`REVIEW_REQUIRED` classification — never silently dropping
a document that failed partway. It SHALL classify every Tier 1 stage failure
`NON_RETRYABLE` (the seven stage functions are pure and deterministic, so a thrown
validation error repeats identically on retry), sharing every field mapping with the
non-tracing composition (FR-071-001) so neither duplicates the other.

## Acceptance criteria

- AC-071-002-01 — Given a document that fails at the fifth of seven stages, when the traced composition runs, then real `STEP_SUCCEEDED`-shaped evidence exists for the first four stages and BR-067's complete failure envelope for the fifth, with nothing after it attempted.
- AC-071-002-02 — Given any Tier 1 stage's failure, when classified, then it is always `NON_RETRYABLE`, because an ambiguous value already declines via `canonical: null` (FR-070-003) rather than throwing, so no Tier 1 failure ever needs `REVIEW_REQUIRED`.
- AC-071-002-03 — Given the same fifteen tests that pass against the non-tracing composition, when run against the traced one, then all fifteen still pass unchanged — tracing is additive, not a rewrite.

## Implementation

- apps/server/src/modules/knowledge/stage-runner.js; apps/server/src/modules/knowledge/quarantine.js

## Verification

- TC-071-002 — Traced composition and BR-067 quarantine (see [verification.md](../verification.md))
