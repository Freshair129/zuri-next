---
id: FR-053-004
title: "Raw evidence never becomes domain truth directly"
delivery: implemented
legacy: [FR-081 (split 4/4)]
relations:
  specified_by: [SDD-053]
  derived_from: [BR-047]
---

# FR-053-004 — Raw evidence never becomes domain truth directly

The system SHALL persist the payload verbatim with `processingStatus = RECEIVED` and
SHALL NOT write business entities during raw ingestion; translation is a separate
path whose failure cannot corrupt the evidence. Runs SHALL carry their own counts
(fetched, created, updated, unchanged, failed) and terminal state; failures SHALL be
preservable as DeadLetterRecord rows naming failing stage and owner rather than
silently retried. PDPA erasure SHALL be able to tombstone raw records for given
external ids.

## Acceptance criteria

- AC-053-004-01 — Given a LINE webhook event ingested, when inspected, then no Customer or Message was written by the raw writer.
- AC-053-004-02 — Given a principal erasure naming a LINE user id, when completed, then that user's raw record payloads are tombstoned with reason `PDPA_ERASURE`.

## Implementation

- apps/server/src/platform/integrations/core/raw-ingest-service.js; apps/server/src/platform/integrations/core/raw-record-redaction.js; apps/server/src/platform/integrations/core/integration-registry.js; apps/server/src/platform/integrations/providers/line/line-oa-webhook.js

## Verification

- TC-053-003 — LINE webhook adapter convergence and erasure (see [verification.md](../verification.md))
