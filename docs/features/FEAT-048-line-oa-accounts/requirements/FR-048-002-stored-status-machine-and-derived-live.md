---
id: FR-048-002
title: "Stored status machine and derived LIVE"
delivery: implemented
legacy: [FR-146 (split 2/4)]
relations:
  specified_by: [API-121]
  decided_by: [ADR-044]
---

# FR-048-002 — Stored status machine and derived LIVE

The system SHALL store an account's status as one of `DRAFT | CONNECTED |
PAUSED | ARCHIVED` and SHALL compute `LIVE` only at read time from the agent
lane's binding read model; no write path SHALL accept or persist `LIVE`.

## Acceptance criteria

- AC-048-002-01 — Given an account with an ACTIVE, in-window binding, when its health is read, then `effectiveStatus` is `LIVE`.
- AC-048-002-02 — Given a PATCH body naming `status: 'LIVE'`, when it is submitted, then the write is rejected by schema validation.

## Implementation

- `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`

## Verification

- TC-048-002 — Status machine and derived LIVE (see [verification.md](../verification.md))
