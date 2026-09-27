---
id: FR-044-001
title: "Backfill scope and envelope are fixed by contract"
delivery: live
legacy: [FR-078 (split 1/5)]
relations:
  specified_by: [SDD-044]
---

# FR-044-001 — Backfill scope and envelope are fixed by contract

The system SHALL accept historical customer records only for the contract's fixed
Tenant/Business scope (never client-selected), each carrying source system, table,
record key, row, source hash, snapshot hash, resolution status, privacy basis,
disposition and an idempotency key derived from source system/table/key/snapshot hash,
under one immutable contract id, version id and mission id.

## Acceptance criteria

- AC-044-001-01 — Given a record naming a different Business, when validated, then it is rejected and not staged.
- AC-044-001-02 — Given the same source row applied twice for one snapshot, when the second apply runs, then no second Customer or provenance row is created.

## Implementation

- apps/server/scripts/build_smartgift_customer_backfill.py; apps/server/scripts/apply_smartgift_customer_backfill.py; apps/server/scripts/rollback_smartgift_customer_backfill.py; apps/server/scripts/readonly-smartgift-customer-backfill-backup.mjs; apps/server/supabase/migrations/20260818070000_customer_profile_backfill_schema.sql; 20260818072000_customer_profile_contract_receipt.sql

## Verification

- TC-044-001 — Contract envelope, resolution and exclusions (see [verification.md](../verification.md))
- TC-044-003 — Review queue service, API and UI (see [verification.md](../verification.md))
