---
id: FR-054-003
title: "A Business owner provisions a model key write-only"
delivery: implemented
legacy: [FR-266 (split, INT half 1/3)]
relations:
  specified_by: [SDD-054, API-151]
  depends_on: [FR-094-004]
  decided_by: [ADR-047]
  derived_from: [SEC-028, SEC-031]
---

# FR-054-003 — A Business owner provisions a model key write-only

The system SHALL accept `POST /api/integration/model-providers` with
`{businessId, provider (anthropic|openai|gemini|groq|prp), model (owner-entered, no
server default), apiKey (trimmed, 20–4096 printable chars)}` only from a Business
owner who sees the Business and has the `line-oa` domain, after the credential-write
gate (AAL2 step-up and rate limits, FR-094-004). It SHALL require a writable store,
prove the key live against the provider before storing anything (401/403 → 422
`MODEL_KEY_REJECTED`; unknown model → 422 `MODEL_NOT_FOUND`; outage →
`MODEL_PROVIDER_UNAVAILABLE`), then create or reuse the Business's single
`MODEL_PROVIDER` connection (role PRIMARY, model in metadata) and write + activate the
credential, auditing `CREDENTIAL_WRITTEN` or `CREDENTIAL_ROTATED` without key material.
The display hint is always null.

## Acceptance criteria

- AC-054-003-01 — Given a key the provider rejects, when provisioned, then 422 `MODEL_KEY_REJECTED` and no connection, credential or version row is written.
- AC-054-003-02 — Given a Business with an existing model connection, when a new key is provisioned, then the same connection is reused and a new credential version is created.
- AC-054-003-03 — Given any response, log or audit payload of this route, when inspected, then no part of the key appears.

## Implementation

- apps/server/src/modules/integration/application/model-provider-credential-service.js; apps/server/src/modules/integration/application/credential-route.js; apps/server/src/app/api/integration/model-providers/**

## Verification

- TC-054-002 — Model key provisioning, rotate, revoke, validate (see [verification.md](../verification.md))
