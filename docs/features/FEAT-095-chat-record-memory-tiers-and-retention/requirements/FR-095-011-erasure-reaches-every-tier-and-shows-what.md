---
id: FR-095-011
title: "Erasure reaches every tier and shows what is pending (declared)"
part: FEAT-095-P07
owner: DOM-IAM
delivery: building
legacy: [FR-232]
relations:
  specified_by: [SDD-095]
  depends_on: [API-104]
  decided_by: [ADR-041]
  derived_from: [SEC-029]
---

# FR-095-011 — Erasure reaches every tier and shows what is pending (declared)

The system SHALL, on principal erasure and on a Customer's consent changing to DECLINED
for memory, tombstone in one transaction everything Tier 1 holds (CRM bodies, previews,
attachments, LINE job fields, raw payloads, trace inputs, knowledge candidates naming an
erased conversation) and leave durable work for outside tiers: one MSP erase call per
projection receipt retried with backoff and shown on the Customer's erasure status as
`PENDING_MSP` until acknowledged, and a knowledge-source withdrawal with a correction run
for an admitted candidate; an external tier is never assumed erased.

## Acceptance criteria

- AC-095-011-01 — Given a Customer with two projection receipts, when erased, then the erasure status reads `PENDING_MSP` until both MSP erasures are acknowledged.

## Implementation

- apps/server/src/modules/identity/erase-principal.js (Tier 1 part only)

## Verification

- TC-095-005 — Tier 1 erasure (partial proof of the declared FR) (see [verification.md](../verification.md))
