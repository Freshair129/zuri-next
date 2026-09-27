---
id: FR-053-002
title: "Ingestion identity makes re-delivery a no-op"
delivery: implemented
legacy: [FR-081 (split 2/4)]
relations:
  specified_by: [SDD-053, API-160]
  derived_from: [BR-047]
---

# FR-053-002 — Ingestion identity makes re-delivery a no-op

The system SHALL compute `payloadHash` as SHA-256 over a canonical (key-sorted)
serialization of the payload and the idempotency key as SHA-256 over
`(tenantId, connectionId, entityType, externalId, payloadHash)`; a caller-supplied
hash or key that disagrees SHALL be refused; an existing key SHALL return `UNCHANGED`
with the stored record instead of inserting. The external id contributes to identity
and is never itself a key.

## Acceptance criteria

- AC-053-002-01 — Given the same LINE event delivered twice with identical payload, when ingested, then the second call returns `UNCHANGED` and one row exists.
- AC-053-002-02 — Given a supplied `payloadHash` that does not match the payload, when ingested, then it fails with "payloadHash does not match payload".

## Implementation

- apps/server/src/platform/integrations/core/idempotency.js; apps/server/src/platform/integrations/core/raw-ingest-service.js

## Verification

- TC-053-001 — Envelope and identity (see [verification.md](../verification.md))
- TC-053-003 — LINE webhook adapter convergence and erasure (see [verification.md](../verification.md))
