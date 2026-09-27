---
id: FR-091-006
title: "Owners inspect and create connection metadata only"
part: FEAT-091-P04
owner: DOM-INT
delivery: building
legacy: [FR-080 (split 1/2)]
relations:
  specified_by: [SDD-091, API-140]
  decided_by: [ADR-053]
---

# FR-091-006 — Owners inspect and create connection metadata only

The system SHALL let an owner with trusted Business authority list, at
`/platform/integrations`, the Business-scoped providers, connections (including the
`LINE_OA` channel and model-provider connections) and credential metadata with explicit
loading/error/empty states, and create a `PHASE1_LINE_LLM` connection whose secret
reference must be `supabase-vault:<uuid>` (`SECRET_REF_MUST_BE_SUPABASE_VAULT_OPAQUE_REFERENCE`
otherwise); references are shown masked, secret material is never returned or stored in
Prisma, logs or audit, and the page cannot activate LINE routing.

## Acceptance criteria

- AC-091-006-01 — Given a create request with a raw key instead of a vault reference, when submitted, then it is refused and nothing is stored.
- AC-091-006-02 — Given a listed Phase-1 connection, when rendered, then its reference appears as `supabase-vault:xxxxxxxx…yyyy`.

## Implementation

- apps/server/src/modules/integration/application/integration-management-service.js; apps/server/src/platform/integrations/core/connection-health.js; apps/server/src/app/api/platform/integrations/route.js; apps/server/src/app/(pm)/platform/integrations/page.jsx

## Verification

- TC-091-004 — Integrations management and health (see [verification.md](../verification.md))
