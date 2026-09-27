---
id: FEAT-021
title: Audit trail & snapshot backup/restore
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-013, FR-014, FR-075]
relations:
  depends_on: [FR-023-001, FR-032-003]
  decided_by: []
---

# FEAT-021 — Audit trail & snapshot backup/restore

## Summary

Two installation-level safety nets. The audit trail is one append-only event log every service
writes to (entity, action, actor, scope, before/after) with an operator-only browser. Snapshot
backup exports the whole installation's relational data as a versioned JSON snapshot and restores it
only through preview then explicit confirmation — never a silent overwrite — and only for an
installation operator, because a restore replaces every tenant's data.

## Scope

**In:** `recordAudit` shape and listing; audit browser; snapshot export (optionally with binary file
content); import preview; confirmed restore with remounts; model coverage manifest (included and
explicitly excluded models); per-domain recovery manifests validated before restore.
**Out:** each domain's own recovery manifest semantics (owned by those domains; validated here);
point-in-time database backups (operations); audit retention policy.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-021-001](requirements/FR-021-001-append-only-audit-trail.md) | Append-only audit trail | — |
| [FR-021-002](requirements/FR-021-002-operator-audit-browser.md) | Operator audit browser | — |
| [FR-021-003](requirements/FR-021-003-snapshot-export.md) | Snapshot export | — |
| [FR-021-004](requirements/FR-021-004-operator-only-preview-and-restore.md) | Operator-only preview and restore | — |
| [NFR-021-001](requirements/NFR-021-001-restore-is-all-or-nothing-within-a.md) | Restore is all-or-nothing within a bound | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
