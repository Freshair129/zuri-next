---
id: FR-064-002
title: "Production Supabase tenant isolation"
delivery: building
legacy: [FR-051]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-064-002 — Production Supabase tenant isolation

The system SHALL store SmartGift business knowledge in the private
`zuri_core.business_knowledge` table with every row carrying the reserved
Tenant and Business UUIDs, enforce forced row-level security and
tenant-leading indexes on every read, and read only `sensitivity = 'PUBLIC'`
`is_active` rows through the tenant-scoped Postgres query
(`createPostgresBusinessKnowledgeReader`) — a query with a malformed
tenant/business UUID SHALL fail Zod validation before reaching the
database.

## Acceptance criteria

- AC-064-002-01 — Given a `product_detail` query for one product code, when `createPostgresBusinessKnowledgeReader.query` runs, then the emitted SQL predicate is `product_code = $3` scoped by `tenant_id = $1 and business_id = $2 and sensitivity = 'PUBLIC' and is_active`.
- AC-064-002-02 — Given a `tenantId` that is not a UUID, when `.query` is called, then it throws a Zod validation error before any SQL executes.

## Implementation

- `apps/server/src/modules/knowledge/postgres-business-knowledge.js`
