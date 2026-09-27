---
id: FR-094-001
title: "Secrets live only behind the SecretStorePort"
part: FEAT-094-P01
owner: DOM-INT
delivery: implemented
legacy: [FR-223 (split 1/3)]
relations:
  specified_by: [SDD-094, API-161]
  decided_by: [ADR-046]
  derived_from: [SEC-028]
---

# FR-094-001 — Secrets live only behind the SecretStorePort

The system SHALL write, rotate, revoke and resolve a LINE channel secret only through
the Integration `SecretStorePort`, whose writable store is Supabase Vault or the
app-level envelope store (AES-256-GCM under `ZURI_SECRET_KEK`) chosen by
`ZURI_SECRET_STORE`, with the read-only deployment mount kept as an operator adapter.
Prisma SHALL hold only reference, store, kind, status, version history, validation
outcome and a non-secret display hint (last four characters of the Channel ID), and
the resolver SHALL re-check Tenant, Business, connection and destination from the rows.

## Acceptance criteria

- AC-094-001-01 — Given a stored credential, when any Prisma row or API response is inspected, then no secret or token appears.
- AC-094-001-02 — Given a resolve call naming another Business's connection, when executed, then it fails `CHANNEL_SECRET_SCOPE_MISMATCH`.

## Implementation

- apps/server/src/platform/integrations/core/secret-store/**; apps/server/src/modules/integration/application/line-channel-credential-service.js; apps/server/src/app/api/line-oa/connections/[id]/credential/**

## Verification

- TC-094-001 — Vault stores and lifecycle (see [verification.md](../verification.md))
- TC-094-002 — Step-up gate and rate limits (see [verification.md](../verification.md))
