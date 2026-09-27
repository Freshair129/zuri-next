---
id: FR-091-001
title: "One provider-neutral model port with fixed allow-lists"
part: FEAT-091-P01
owner: DOM-AGT
delivery: building
legacy: [FR-048 (split 1/2)]
relations:
  specified_by: [SDD-091]
  decided_by: [ADR-052]
---

# FR-091-001 — One provider-neutral model port with fixed allow-lists

The system SHALL construct every model call through one `ModelProviderPort` whose
public-LINE provider allow-list is `openrouter`, `openai`, `anthropic`, `gemini`,
`groq` (plus `prp` only with an operator-configured base URL); `ollama` SHALL be
accepted only for `LOCAL_DEV`/`TEST`/`EVAL` runtime sources on an exact loopback URL
and without a credential, and refused for `PRODUCTION_LINE`
(`MODEL_PROVIDER_NOT_ALLOWED_FOR_PRODUCTION_LINE`). OpenRouter credentials are obtained
through an HTTPS-callback OAuth code exchange; consumer-plan CLI credentials are never
selectable.

## Acceptance criteria

- AC-091-001-01 — Given runtime source `PRODUCTION_LINE` and provider `ollama`, when the port is created, then it throws and no call is made.
- AC-091-001-02 — Given an unknown provider, when the port is created, then it throws `MODEL_PROVIDER_NOT_ALLOWED_FOR_PUBLIC_LINE`.

## Implementation

- apps/server/src/modules/agent/model-provider.js; apps/server/src/modules/agent/model-provider-catalog.js; apps/server/src/modules/agent/openrouter-oauth.js; apps/server/src/platform/integrations/llm/provider-catalog.js

## Verification

- TC-091-001 — Provider catalog and port (see [verification.md](../verification.md))
