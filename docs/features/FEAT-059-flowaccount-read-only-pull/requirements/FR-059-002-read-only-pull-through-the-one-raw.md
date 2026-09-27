---
id: FR-059-002
title: "Read-only pull through the one raw ingestion path"
delivery: declared
legacy: [FR-125 (split 2/3)]
relations:
  specified_by: [SDD-059, API-160]
  depends_on: [FEAT-053]
---

# FR-059-002 — Read-only pull through the one raw ingestion path

The system SHALL call only the approved GET resource catalog, paginate within the
provider's page-size ceiling, and send every record through `ingestRawExternalRecord`
with trusted Tenant/Business/connection scope, external id and payload hash (same id +
hash → `UNCHANGED`); document resources use a date watermark with 7-day lookback,
master resources (contacts, products, company, chart of accounts) use full snapshot
reconciliation; `SyncCursor` advances only after a complete resource run.

## Acceptance criteria

- AC-059-002-01 — Given a run that fails on page 3, when it ends, then the cursor is unchanged and an IngestionRun/DeadLetterRecord records the safe failure code.
