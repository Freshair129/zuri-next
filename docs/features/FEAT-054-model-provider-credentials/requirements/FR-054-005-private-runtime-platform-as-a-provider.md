---
id: FR-054-005
title: "Private Runtime Platform as a provider"
delivery: implemented
legacy: [FR-267]
relations:
  specified_by: [SDD-054, API-150]
  decided_by: [ADR-047]
---

# FR-054-005 — Private Runtime Platform as a provider

The system SHALL offer provider `prp` only when the operator configured
`ZURI_PRIVATE_RUNTIME_BASE_URL` (HTTPS, or HTTP on loopback; no user-info, query or
fragment) — never an endpoint a browser supplies — else 503
`PRIVATE_RUNTIME_NOT_CONFIGURED`; SHALL validate the Business's PRP client key against
PRP `GET /v1/models` (401/403 refuses the key, an alias absent from the granted list
refuses the model, nothing stored on either); answers SHALL use PRP's
OpenAI-compatible chat completions, strip `<think>…</think>` reasoning before text can
reach a customer, fail closed on an answer that is only unfinished reasoning, and
never fall back to an external provider.

## Acceptance criteria

- AC-054-005-01 — Given no configured base URL, when `prp` is provisioned, then 503 and PRP is not called.
- AC-054-005-02 — Given a model alias not in PRP's granted list, when provisioned, then 422 `MODEL_NOT_FOUND`.
- AC-054-005-03 — Given a PRP answer `<think>…` with no closing tag, when post-processed, then no text is sent.

## Implementation

- apps/server/src/platform/integrations/providers/model/model-provider-admin-port.js; apps/server/src/platform/integrations/providers/model/private-runtime-config.js; apps/server/src/modules/agent/model-provider.js

## Verification

- TC-054-003 — Provider probes and PRP (see [verification.md](../verification.md))
