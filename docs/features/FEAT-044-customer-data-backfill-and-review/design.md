---
id: SDD-044
title: "Customer data backfill and import review — design"
---

# SDD-044 — Customer data backfill and import review design

- **Components:** CMP-089 — operator pipeline `build_smartgift_customer_backfill.py` → `apply_smartgift_customer_backfill.py` / `rollback_smartgift_customer_backfill.py`, `build_smartgift_customer_review_queue.py`, cut-over/verify scripts; CMP-090 — `customer-import-review-service.js` + `customer-import-review-store.js` (Prisma store in dev, `zuri_core` Postgres store with a dedicated runtime login in production).
- **Data owned:** CustomerImportBatch, CustomerImportProvenance, CustomerImportReviewCase, CustomerImportReviewDecision; writes Person/Customer only through the approved batch.
- **Contracts exposed:** API-114.
- **Contracts consumed:** RBAC permissions `CUSTOMER_REVIEW_READ_PERMISSION` / `CUSTOMER_REVIEW_DECIDE_PERMISSION` (DOM-IAM).
- **Main sequence (backfill):** read-only snapshot → validated artifact → resolution report → review/hold → approvals → verified backup → staged upsert in one transaction → post-apply reconciliation.
- **Main sequence (review):** scope check (contract Business) → resolve scope via store → permission → list/append with optimistic version → redacted DTO.
- **Failure modes:** missing hosted review-store configuration → `Customer review target is not configured`; permission failures 403; stale version refused.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-044-001..004 | apps/server/scripts/build_smartgift_customer_backfill.py; apps/server/scripts/apply_smartgift_customer_backfill.py; apps/server/scripts/rollback_smartgift_customer_backfill.py; apps/server/scripts/readonly-smartgift-customer-backfill-backup.mjs; apps/server/supabase/migrations/20260818070000_customer_profile_backfill_schema.sql; 20260818072000_customer_profile_contract_receipt.sql |
| FR-044-005 | apps/server/src/modules/crm/customer-import-review-service.js; apps/server/src/modules/crm/customer-import-review-store.js; apps/server/src/app/api/platform/customer-import-reviews/**; apps/server/src/app/(pm)/platform/customer-import-reviews/page.jsx; apps/server/scripts/build_smartgift_customer_review_queue.py |
