---
id: FR-064-003
title: "Server-owned LINE scope binding"
delivery: building
legacy: [FR-052]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-064-003 — Server-owned LINE scope binding

The system SHALL resolve LINE Tenant/Business scope only from an active,
destination-bound, hash-verified binding — an HMAC-peppered bearer token
and destination hash checked against `zuri_core.line_channel_binding`
(`status = 'ACTIVE'`, inside its validity window) — and SHALL reject any
scope a client attempts to select directly. Every read against the LINE
runtime database SHALL execute under the unprivileged `zuri_line_smartgift_ro`
role, set with `SET LOCAL ROLE` inside its own short transaction.

## Acceptance criteria

- AC-064-003-01 — Given a bearer token under 32 characters or a destination hash mismatch, when `createPostgresLineBindingResolver.resolve` runs, then it throws `PHASE1_BINDING_UNAUTHORIZED` (401) without distinguishing which check failed.
- AC-064-003-02 — Given any query issued through the Phase 1 runtime pool, when it executes, then it runs inside a transaction that has first issued `set local role zuri_line_smartgift_ro` (or `zuri_line_runtime` for the secret-role path) — never on the pool's default role.
- AC-064-003-03 — Given a role name not in `RUNTIME_DB_ROLE_SQL`, when `executeAsRole` is called, then it throws `PHASE1_DATABASE_ROLE_FORBIDDEN` rather than executing an unvalidated `SET LOCAL ROLE`.

## Implementation

- `apps/server/src/modules/agent/line-binding-resolver.js`, `apps/server/src/modules/agent/line-channel-binding.js`, `apps/server/src/modules/agent/phase1-runtime.js`, `apps/server/src/modules/knowledge/runtime-postgres-config.js`
