---
id: FR-074-002
title: "Curated business-knowledge read contract"
delivery: building
legacy: [FR-047]
relations:
  specified_by: [SDD-074]
  derived_from: [SEC-008]
  relates_to: [FR-072-003]
---

# FR-074-002 — Curated business-knowledge read contract

The system SHALL expose exactly one allow-listed, versioned public product projection
through `BusinessKnowledgeReadPort`, with DuckDB and Supabase/Postgres as
interchangeable adapters and an in-memory adapter for tests, excluding PII, cost,
margin, invoice, unrestricted SQL and local file paths **by construction** — never by
convention at the call site. The system SHALL verify, not merely assert, that every
record a query packet returns is at or below the `PUBLIC` sensitivity the surface is
allowed to serve — a packet builder that scans and rejects any record above `PUBLIC`
rather than stamping the ceiling onto whatever arrived.

## Acceptance criteria

- AC-074-002-01 — Given a query against the read port, when the result includes a record above `PUBLIC` sensitivity, then `buildBusinessKnowledgePacket` refuses to build the packet rather than silently relabelling the record.
- AC-074-002-02 — Given a request naming a field outside `PUBLIC_BUSINESS_KNOWLEDGE_FIELDS`, when queried, then the field is excluded from the response by construction, not filtered post hoc.
- AC-074-002-03 — Given the same query issued against the DuckDB adapter and the Supabase/Postgres adapter, then both return the same allow-listed shape.

## Implementation

- apps/server/src/modules/knowledge/business-contract.js; apps/server/src/modules/knowledge/postgres-business-knowledge.js; apps/server/src/modules/knowledge/supabase-business-knowledge.js; apps/server/src/modules/agent/phase1-runtime.js

## Verification

- TC-074-002 — Business-knowledge packet verifies sensitivity rather than asserting it (see [verification.md](../verification.md))
