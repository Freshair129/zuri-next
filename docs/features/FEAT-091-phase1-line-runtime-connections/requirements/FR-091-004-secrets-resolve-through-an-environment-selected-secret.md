---
id: FR-091-004
title: "Secrets resolve through an environment-selected secret manager"
part: FEAT-091-P02
owner: DOM-INT
delivery: building
legacy: [FR-079 (split 2/3)]
relations:
  specified_by: [SDD-091, API-161]
  decided_by: [ADR-052, ADR-053]
---

# FR-091-004 — Secrets resolve through an environment-selected secret manager

The system SHALL resolve a connection's opaque `secretRef` through a provider-neutral
`SecretManagerPort` selected by runtime source — Supabase Vault through the private
resolver for `PRODUCTION_LINE` (a local file vault is refused there), a local vault for
dev/test/eval — scoped by `{tenantId, businessId}`, failing closed on not-found,
ambiguous, expired or unavailable; production refuses Supabase secret/service
credentials that bypass row-level security.

## Acceptance criteria

- AC-091-004-01 — Given `NODE_ENV=production` and a runtime source other than `PRODUCTION_LINE`, when the runtime starts, then it fails `PHASE1_PRODUCTION_RUNTIME_SOURCE_FORBIDDEN`.
- AC-091-004-02 — Given an expired secret, when resolved, then it fails `Expired` and no model call occurs.

## Implementation

- apps/server/src/platform/integrations/core/secret-manager.js; apps/server/src/platform/integrations/core/credential-vault.js; apps/server/src/modules/agent/phase1-runtime.js

## Verification

- TC-091-002 — Connection selection and secret resolution (see [verification.md](../verification.md))
