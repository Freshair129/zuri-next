---
id: RB-001
title: Backup and restore
status: draft
owner: operations
legacy: [docs/DB-MIGRATION-NOTES.md (snapshot export/import, cutover), docs/ARCHITECTURE.md (offline backup), ADR-018 D7–D8, ADR-061 (job ledger recovery), ADR-093, docker-compose.knowledge-storage.yml, docker-compose.yml volume notes]
relations:
  decided_by: [ADR-086, ADR-094]
---

# RB-001 — Backup and restore

Covers SRV-009, SRV-006, knowledge state volumes and the cold archive.
Backups never contain plaintext credentials; restores always preview before they
write (BR-053).

## 1. What is backed up, and how

| Asset | Mechanism | Notes |
|---|---|---|
| Relational data (production) | managed physical backup / point-in-time recovery per the approved policy | the policy is an activation gate; record it |
| Relational data (before any production migration) | redacted logical snapshot of affected objects, SHA-256 recorded | RB-002 §2 |
| Application-level snapshot | `GET /api/backup/export` (provider-agnostic JSON of every snapshot model; operator-class read, audited) | excludes sealed reply tokens, envelope ciphertext and key-encryption keys; declares recovery manifests (e.g. LINE job/trace memory fields) |
| Knowledge object storage | replication/backup to a **separate host** | a second container on the same host is not a backup |
| Knowledge state volumes (MSP/GKS state, native store, published generations) | volume-level copy with the worker stopped, or by moving volumes aside | never `docker compose down -v`; a reset happens only on owner instruction, by moving volumes aside |
| Cold chat archive | archive files on a dedicated disk with a hash-chained manifest | the archive KEK has an owner-held offline backup; never stored in DB or repository |
| Deployment secrets | the operator's secret manager | never in snapshots or in this repository |

## 2. Restore an application snapshot

1. Stop inbound traffic that could write during restore (pause LINE accounts; stop
   workers).
2. `POST /api/backup/import` in preview mode: review counts and conflicts.
3. Confirm explicitly (`confirm: true`). Restore recreates rows with their original
   UUIDs; there is no silent overwrite.
4. After restore: every restored LINE account has server ownership disabled and its
   epoch advanced; re-enable accounts deliberately (RB-004). Discarded reply
   tokens are not recoverable by design. Legacy snapshots without the memory recovery
   manifest are refused when the installation already holds enrolled memory evidence.
5. Verify health, counts and a route-level read for each restored domain; record the
   snapshot hash, preview output and operator.

## 3. Move data between providers (SQLite ⇄ PostgreSQL)

Generate the PostgreSQL schema from the canonical model, apply it, then move data by
snapshot export/import (import refuses a non-empty target). Never copy database files
into production. Re-run the test suite against the target provider.

## 4. Restore relational data from a physical backup

Operator procedure of the managed provider. Before switching traffic: verify the
migration ledger matches the release, forced RLS and grants on tenant tables, and run
isolation probes (a second tenant reads zero rows of the first). Record the recovery
point used.

## 5. Rehearsal

Rehearse restores on a separate project/stack (own project name, own env files), never
on production. Measured RPO/RTO for each asset in §1 is an activation requirement.
