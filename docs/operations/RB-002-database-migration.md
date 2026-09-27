---
id: RB-002
title: Apply production database migrations
status: draft
owner: operations
legacy: [docs/runbooks/production-migration-reconciliation.md, docs/runbooks/ASSET-EVIDENCE-PRODUCTION-ACTIVATION.md §1–5, docs/runbooks/line-oa-provider-merge.md, docs/DB-MIGRATION-NOTES.md, ADR-057, ADR-104]
relations:
  decided_by: [ADR-094, ADR-086]
---

# RB-002 — Apply production database migrations

Operates SRV-009. Applies reviewed, idempotent migration files to the production
database through the controlled operator tool. It is separate from the application
release (RB-005) and is performed only on the owner's instruction.

## 0. Rules

- Production columns come only from the migration directory. The canonical ORM model
  and its generated PostgreSQL twin are never applied directly; schema-sync commands
  (`db push`, SQLite migrations) are never run against production.
- Every migration is additive and idempotent (`IF NOT EXISTS` guards); a destructive
  step (drop, rename, truncate, data rewrite) needs its own reviewed decision.
- Every new tenant-scoped table ships forced RLS, the single runtime policy, runtime
  grants and revocations from anonymous/authenticated/service roles in the same file.
- Migration SQL never writes the migration ledger; the operator tool records it.
- Use the direct connection; never print it.

## 1. Identify the target

Confirm the target project identity and the database user from a read-only query;
compare with the reviewed target recorded in the plan. A mismatch is a stop condition,
never a reason to create or link another project.

## 2. Preflight and snapshot (read-only)

1. Run the read-only preflight: schemas, roles, grants, RLS state, migration ledger,
   existence of the tables the plan touches. Save the receipt outside the repository.
2. Take a redacted logical snapshot of the affected objects; record its SHA-256.
3. Compare the ledger with the migration directory. For each missing version, compare
   the live catalog with the file's effects:
   - effects fully present → the tool will **record** it without replaying SQL;
   - effects absent → the tool will **apply** the reviewed file;
   - partially present → stop and perform a drift review.

## 3. Dry run

Run the operator tool without `--apply`: it executes the plan inside a transaction
that is rolled back and prints only redacted status. It refuses a version/name
mismatch, an unexpected target, a missing precondition or an unreviewed file, and
hashes every file at run time.

## 4. Apply

Run the tool with `--apply`, the expected project reference, the preflight receipt
and the snapshot. Each migration runs in its own transaction; a failure leaves the
database and ledger unchanged for that migration.

## 5. Verify

Read the database again (the tool's receipt is not sufficient):

- every planned version/name pair is present in the ledger;
- every target table exists with `rowsecurity = true`, `forcerowsecurity = true`, the
  runtime policy and runtime grants, and zero grants to service/anonymous roles;
- expected columns/constraints exist; unrelated objects unchanged;
- `GET /api/health` still reports `db=ok`.

## 6. Record

Store: commit SHA, preflight receipt, snapshot hash, plan, apply receipt, post-apply
query output, operator and time — without URLs, tokens or data.

## Rollback

Application behaviour rolls back by image (RB-005). A structural rollback is a
new reviewed migration. Data restore uses RB-001.

## Special cases

- **Provider/identity merges** (e.g. merging two codes for one provider): run the
  pre-apply inventory queries, apply the idempotent merge migration (re-point rows;
  disable, never delete, colliding duplicates with a recorded reason), verify counts,
  record the result.
- **Restricted service roles** (e.g. Market service `SELECT, INSERT` on one table) are
  created by the operator from the service's runbook text, never by a migration file
  written by the service lane.
