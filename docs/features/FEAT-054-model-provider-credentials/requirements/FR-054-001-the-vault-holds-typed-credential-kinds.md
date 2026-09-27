---
id: FR-054-001
title: "The vault holds typed credential kinds"
delivery: implemented
legacy: [FR-242 (split 1/2)]
relations:
  specified_by: [SDD-054, API-161]
  depends_on: [FEAT-094]
---

# FR-054-001 — The vault holds typed credential kinds

The system SHALL accept, besides `LINE_CHANNEL`, the credential kinds `OAUTH_CLIENT`
(`{clientId, clientSecret}`), `MODEL_PROVIDER_KEY` (`{apiKey}`) and `NOTION_OAUTH_TOKEN`
(`{accessToken, refreshToken}`), each validated by its own bundle schema and serialized
in a canonical field order, with the same write → activate → rotate → revoke → resolve
lifecycle, versioning, failure compensation and scope re-check as a LINE credential.
A kind without a bundle schema SHALL be refused (`CHANNEL_SECRET_KIND_UNSUPPORTED`).

## Acceptance criteria

- AC-054-001-01 — Given an `OAUTH_CLIENT` bundle missing `clientSecret`, when written, then it is refused before any store call.
- AC-054-001-02 — Given a `MODEL_PROVIDER_KEY` written and activated, when rotated, then the previous version stays resolvable until the new one validates.

## Implementation

- apps/server/src/platform/integrations/core/secret-store/secret-store-port.js; envelope-secret-store.js; supabase-vault-secret-store.js; credential-lifecycle.js

## Verification

- TC-054-001 — Credential kinds and kind mismatch (see [verification.md](../verification.md))
- TC-054-003 — Provider probes and PRP (see [verification.md](../verification.md))
