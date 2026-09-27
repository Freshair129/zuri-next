---
id: FR-057-001
title: "Connector state is derived from connection evidence"
delivery: building
legacy: [FR-130 (split 1/2)]
relations:
  specified_by: [SDD-057, API-140]
---

# FR-057-001 — Connector state is derived from connection evidence

The system SHALL describe each catalog connector by presentation metadata and the
`IntegrationProvider` codes that would represent it, and SHALL derive its state for the
viewed Business: `NOT_CONNECTED` with reason `CONNECTOR_NOT_IMPLEMENTED` when no code in
the product connects it (empty provider codes), `NOT_CONNECTED` with
`NO_CONNECTION_RECORDED` when no matching connection exists, otherwise the best health
state among matching connections (CONNECTED, DEGRADED, ERROR, MISCONFIGURED, DISABLED)
with `NO_HEALTH_EVIDENCE` when a row lacks computed health. No credential material
passes through the catalog.

## Acceptance criteria

- AC-057-001-01 — Given the GitHub tile, when the page renders for any Business, then it shows `NOT_CONNECTED` / `CONNECTOR_NOT_IMPLEMENTED`.
- AC-057-001-02 — Given one CONNECTED and one MISCONFIGURED LINE connection, when the tile is derived, then it is CONNECTED and the misconfigured row keeps its own reasons further down.

## Implementation

- apps/server/src/platform/integrations/core/connector-catalog.js; apps/server/src/app/(pm)/platform/integrations/page.jsx

## Verification

- TC-057-001 — Catalog derivation and page claims (see [verification.md](../verification.md))
