---
id: SRV-009
title: Primary relational database (PostgreSQL)
kind: database
status: draft
delivery: live
legacy: [compose services db + db-migrate (profile local-db), managed Supabase project, FR-030, FR-145, ADR-018, ADR-104]
relations:
  decided_by: [ADR-086, ADR-094, ADR-096, ADR-083]
---

# SRV-009 — Primary relational database

## Responsibility
The transactional system of record for all domains, shared physically and owned
logically per domain (one owning domain per table). In production a managed PostgreSQL
project also provides the secret store (vault functions) and private object storage
buckets; a self-hosted installation can run the bundled PostgreSQL instead.

## Domains hosted
Storage for every domain's owned tables; no domain logic.

## Entrypoints
- Pooled connection for the application runtime (`DATABASE_URL`; session pooling for
  long-running containers).
- Direct connection for operator tooling and migrations (`DIRECT_URL`).
- Bundled mode: `db` service reachable only on the application network; `db-migrate`
  one-shot schema push for that bundled database only.

## Configuration (names only)
`DATABASE_URL`, `DIRECT_URL`, `ZURI_DB_POOL_MODE`, CA file names
(`ZURI_LINE_DB_CA_FILE`, `ZURI_CUSTOMER_REVIEW_DB_CA_FILE`); bundled mode:
`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `COMPOSE_PROFILES=local-db`.

## Schemas and roles
- `public`: application tables with forced row-level security, one runtime policy and
  grants to the application runtime role; no grants to anonymous, authenticated or
  service roles.
- Private schema (`zuri_core`): channel bindings and activation events, LINE-facing
  business knowledge, phase-1 connection metadata; not exposed via any data API;
  NOLOGIN scope roles entered per transaction.
- Dedicated NOLOGIN writer/reader roles for secret-store functions; a migration role
  for operators; restricted per-service roles (e.g. Market: `SELECT, INSERT` on one
  table).
- The MSP store is never this database/schema/role (startup refuses it).

## Scaling and state
Durable. Tenant-leading indexes on RLS paths; composite Tenant/Business foreign keys.
Production changes only through reviewed, idempotent migrations applied by the
operator tool (ADR-094); schema-sync commands are never run against production.
Backups: managed physical backup/PITR per the approved policy, plus redacted logical
snapshots taken before every production migration (RB-001).

## Deploy unit
Managed project (production) or Compose `db` + `db-migrate` (profile `local-db`, named
volume `db-data`; only `down -v` deletes it). See RB-002.
