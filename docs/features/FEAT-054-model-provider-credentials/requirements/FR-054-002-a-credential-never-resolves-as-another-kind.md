---
id: FR-054-002
title: "A credential never resolves as another kind"
delivery: implemented
legacy: [FR-242 (split 2/2)]
relations:
  specified_by: [SDD-054, API-161]
  derived_from: [SEC-031]
---

# FR-054-002 — A credential never resolves as another kind

The system SHALL refuse, in both the envelope store and the Supabase Vault layer and
before any secret reaches a store, a write that would change an existing connection's
stored kind (409 `CREDENTIAL_KIND_MISMATCH`), and SHALL never resolve a credential
written under one kind as another.

## Acceptance criteria

- AC-054-002-01 — Given a connection holding a `LINE_CHANNEL` credential, when a `MODEL_PROVIDER_KEY` write names it, then 409 and nothing is stored.

## Implementation

- apps/server/src/platform/integrations/core/secret-store/secret-store-port.js; envelope-secret-store.js; supabase-vault-secret-store.js; credential-lifecycle.js

## Verification

- TC-054-001 — Credential kinds and kind mismatch (see [verification.md](../verification.md))
