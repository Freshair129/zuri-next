---
id: FEAT-017
title: Managed file workspace & File Manager
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FEAT-001, FR-037, FR-045, FR-058, ADR-016]
relations:
  depends_on: [FEAT-003, FEAT-021]
  decided_by: [ADR-006]
---

# FEAT-017 — Managed file workspace & File Manager

## Summary

Documents and attachments owned by a Business or a Project. The database is the only
authority for file identity, ownership, links, version, status and audit; real bytes live in
a mounted local folder (or a managed blob store, or stay an external URL) and every derived cache
is disposable. The Business and Project File Managers show the same assets in grid, timeline,
by-project and preview views. On a local installation a file can be revealed in the OS file
explorer; hosted mode can never do that.

## Scope

**In:** legacy ProjectFile metadata references; FileAsset / FileLink / LocalWorkspaceMount;
managed local ingest; content serving; path containment; reconcile/relink; cache rebuild;
local reveal; ProjectFile → FileAsset migration; Business aggregation; four File Manager views.
**Out:** binary content in backups by default (explicit only, FEAT-021); asset evidence use of
files (DOM-AST contract `createManagedBlobFileAsset` consumer); sync with cloud drives.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-017-001](requirements/FR-017-001-project-file-references-compatibility.md) | Project file references (compatibility) | — |
| [FR-017-002](requirements/FR-017-002-database-authoritative-file-assets.md) | Database-authoritative file assets | — |
| [FR-017-003](requirements/FR-017-003-mounts-and-managed-local-ingest.md) | Mounts and managed local ingest | — |
| [FR-017-004](requirements/FR-017-004-contained-paths-and-content-serving.md) | Contained paths and content serving | — |
| [FR-017-005](requirements/FR-017-005-reconcile-relink-and-disposable-cache.md) | Reconcile, relink and disposable cache | — |
| [FR-017-006](requirements/FR-017-006-capability-gated-local-reveal.md) | Capability-gated local reveal | — |
| [FR-017-007](requirements/FR-017-007-projectfile-migration-to-managed-assets.md) | ProjectFile migration to managed assets | — |
| [FR-017-008](requirements/FR-017-008-business-file-manager-aggregation.md) | Business File Manager aggregation | — |
| [FR-017-009](requirements/FR-017-009-file-manager-views.md) | File Manager views | — |
| [NFR-017-001](requirements/NFR-017-001-crash-recoverable-portable-local-files.md) | Crash-recoverable, portable local files | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
