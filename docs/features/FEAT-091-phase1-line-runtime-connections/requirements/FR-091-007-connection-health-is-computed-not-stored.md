---
id: FR-091-007
title: "Connection health is computed, not stored"
part: FEAT-091-P04
owner: DOM-INT
delivery: building
legacy: [FR-080 (split 2/2)]
relations:
  specified_by: [SDD-091, API-140]
---

# FR-091-007 — Connection health is computed, not stored

The system SHALL compute each listed connection's `health`
(`CONNECTED · DEGRADED · ERROR · DISABLED · MISCONFIGURED` plus every observed reason)
from connection and credential state and, for channels, from `RawExternalRecord`
arrival evidence (stale after 24 h by default), resolving worst-first per connection.

## Acceptance criteria

- AC-091-007-01 — Given an ACTIVE LINE connection with no evidence in 24 h, when listed, then its health is not CONNECTED and names the staleness reason.

## Implementation

- apps/server/src/modules/integration/application/integration-management-service.js; apps/server/src/platform/integrations/core/connection-health.js; apps/server/src/app/api/platform/integrations/route.js; apps/server/src/app/(pm)/platform/integrations/page.jsx

## Verification

- TC-091-004 — Integrations management and health (see [verification.md](../verification.md))
