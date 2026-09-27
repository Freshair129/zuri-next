---
id: FR-095-004
title: "Retention is declared per data class and may only be shortened"
part: FEAT-095-P03
owner: DOM-CRM
delivery: building
legacy: [FR-230 (split 1/3)]
relations:
  specified_by: [SDD-095, API-118]
  decided_by: [ADR-041]
---

# FR-095-004 — Retention is declared per data class and may only be shortened

The system SHALL declare the retention classes `RAW_LINE_PAYLOAD` (90 days),
`MESSAGE_BODY_AND_ATTACHMENTS` (730 days ≈ 24 months), `AGENT_TRACE_EVENT` (90 days) and
`MSP_SESSION_CONTENT` (90 days), and SHALL let a Tenant record an override per class that
is shorter than the default; a longer value SHALL be refused (not clamped) and each
override audited `RETENTION_OVERRIDE_SET`.

## Acceptance criteria

- AC-095-004-01 — Given a Tenant override of 800 days for message bodies, when set, then it is refused.

## Implementation

- apps/server/src/modules/crm/retention-override-service.js; retention-sweep-service.js; apps/server/src/app/api/crm/retention-sweep/route.js; apps/server/scripts/server-retention-sweep-worker.mjs; apps/server/src/lib/validation/enums.js

## Verification

- TC-095-002 — Retention overrides and sweep (see [verification.md](../verification.md))
