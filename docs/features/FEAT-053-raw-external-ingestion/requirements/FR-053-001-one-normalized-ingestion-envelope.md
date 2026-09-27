---
id: FR-053-001
title: "One normalized ingestion envelope"
delivery: implemented
legacy: [FR-081 (split 1/4)]
relations:
  specified_by: [SDD-053, API-160]
---

# FR-053-001 — One normalized ingestion envelope

The system SHALL accept raw records only as an envelope carrying `tenantId`, optional
`businessId`, `connectionId`, `provider`, `lane` (ACCOUNTING, SALES, PRODUCTION_SUPPLY,
MARKETING, CUSTOMER, BUSINESS, MARKET_INTELLIGENCE), `entityType`, `externalId`,
`sourceType` (PULL, WEBHOOK, FILE, MANUAL), `schemaVersion` and `payload`, with
optional run id, source URI, receive time and artifact id; unknown fields are refused.
A new channel SHALL be added as an adapter onto this envelope, never as a second
raw-write path.

## Acceptance criteria

- AC-053-001-01 — Given an envelope with an unknown lane or an extra field, when validated, then it is refused and nothing is written.

## Implementation

- apps/server/src/platform/integrations/core/contracts.js

## Verification

- TC-053-001 — Envelope and identity (see [verification.md](../verification.md))
