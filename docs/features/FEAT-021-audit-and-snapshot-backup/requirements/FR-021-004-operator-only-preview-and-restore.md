---
id: FR-021-004
title: "Operator-only preview and restore"
delivery: live
legacy: [FR-075 (split 2/2 — restore authority), FR-013 (split 2/2 — preview and confirm)]
relations:
  specified_by: [API-003]
  depends_on: [FR-023-001]
  derived_from: [BR-053, SEC-007]
---

# FR-021-004 — Operator-only preview and restore

The system SHALL treat both the import preview and the restore as installation-wide operations
requiring the installation-operator capability (a server-held platform grant on a trusted session;
never inferred from owning Businesses; `isPlatform` never counts). The preview SHALL validate the
snapshot (version, per-model rows, recovery manifests, mount/content gaps) and return counts and
errors without writing; restore SHALL require `confirm: true`, SHALL require each remount to name an
existing Business, a device key and an absolute root, and SHALL replace all restorable tables in one
transaction (reverse dependency order delete, ordered insert), then audit `SNAPSHOT/RESTORED`.

## Acceptance criteria

- AC-021-004-01 — Given a Tenant owner without platform grant, when previewing, then refused and no row counts are disclosed.
- AC-021-004-02 — Given an invalid snapshot, when confirmed, then `restored: false` with errors and the database is unchanged.
- AC-021-004-03 — Given a valid snapshot without `confirm`, then `needsConfirmation: true` and nothing is written.

## Verification

- TC-021-002 — Snapshot export/import (see [verification.md](../verification.md))
- TC-021-003 — Restore authorization (see [verification.md](../verification.md))
