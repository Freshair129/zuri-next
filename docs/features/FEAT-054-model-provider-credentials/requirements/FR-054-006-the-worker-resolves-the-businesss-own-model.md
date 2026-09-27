---
id: FR-054-006
title: "The worker resolves the Business's own model credential"
delivery: implemented
legacy: [FR-266 (split, INT half 3/3)]
relations:
  specified_by: [SDD-054, API-161]
---

# FR-054-006 — The worker resolves the Business's own model credential

The system SHALL resolve, for a `(tenantId, businessId)`, exactly the ACTIVE PRIMARY
`MODEL_PROVIDER` connection's provider, model and API key through the secret store
(plus the PRP base URL for `prp`), and SHALL throw
(`MODEL_CREDENTIAL_CONNECTION_INCOMPLETE` / `MODEL_CREDENTIAL_NOT_RESOLVABLE`) rather
than fall back to any other credential.

## Acceptance criteria

- AC-054-006-01 — Given a revoked credential, when the worker resolves the Business's model, then resolution fails and no answer is attempted with another key.

## Implementation

- apps/server/src/modules/integration/application/model-provider-credential-service.js (`resolveBusinessModelCredential`)

## Verification

- TC-054-002 — Model key provisioning, rotate, revoke, validate (see [verification.md](../verification.md))
