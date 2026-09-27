---
id: FR-093-004
title: "One Integration-owned port signs, sends and classifies LINE calls"
part: FEAT-093-P02
owner: DOM-INT
delivery: implemented
legacy: [FR-149 (split 2/10)]
relations:
  specified_by: [SDD-093, API-147]
  derived_from: [BR-056]
---

# FR-093-004 — One Integration-owned port signs, sends and classifies LINE calls

The system SHALL verify webhook signatures and perform every reply/push through the
Integration LINE messaging port, which resolves the account's credential through the
secret manager per call (callers never hold the token), applies a 10 s timeout, and
returns `ACCEPTED_BY_LINE` or a classified failure (retryable, unknown, HTTP status)
with the provider request id; secrets are redacted from every error.

## Acceptance criteria

- AC-093-004-01 — Given a push that times out, when classified, then the outcome is not `ACCEPTED_BY_LINE`.

## Implementation

- apps/server/src/platform/integrations/providers/line/line-oa-evidence.js; line-oa-webhook.js; server-line-transport.js

## Verification

- TC-093-002 — Evidence and messaging port (see [verification.md](../verification.md))
