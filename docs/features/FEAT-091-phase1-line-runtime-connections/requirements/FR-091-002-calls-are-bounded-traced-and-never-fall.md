---
id: FR-091-002
title: "Calls are bounded, traced and never fall back"
part: FEAT-091-P01
owner: DOM-AGT
delivery: building
legacy: [FR-048 (split 2/2)]
relations:
  specified_by: [SDD-091]
---

# FR-091-002 — Calls are bounded, traced and never fall back

The system SHALL give each call a timeout (default 10 s, 100–25 000 ms), classify
failures (`MODEL_PROVIDER_TIMEOUT`, `…_NETWORK_ERROR`, `…_HTTP_<status>`,
`…_INVALID_JSON`, `…_EMPTY_RESPONSE`), record provider-reported usage when present
(else `UNAVAILABLE`) through the trace hooks, and SHALL never switch to another
provider automatically.

## Acceptance criteria

- AC-091-002-01 — Given a provider that times out, when an answer is generated, then the error is `MODEL_PROVIDER_TIMEOUT` and no second provider is called.

## Implementation

- apps/server/src/modules/agent/model-provider.js; apps/server/src/modules/agent/model-provider-catalog.js; apps/server/src/modules/agent/openrouter-oauth.js; apps/server/src/platform/integrations/llm/provider-catalog.js

## Verification

- TC-091-001 — Provider catalog and port (see [verification.md](../verification.md))
- TC-091-004 — Integrations management and health (see [verification.md](../verification.md))
