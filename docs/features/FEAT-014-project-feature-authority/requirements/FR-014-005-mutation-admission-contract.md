---
id: FR-014-005
title: "Mutation admission contract"
delivery: building
legacy: [FR-252 (split 5/7 — mutation contract)]
relations:
  depends_on: [legacy:FR-252-P2]
  derived_from: [BR-001, SEC-003, SEC-007]
---

# FR-014-005 — Mutation admission contract

The system SHALL admit every Feature mutation only with: a live authenticated session whose
API-write CSRF token (`x-csrf-token`, Identity contract) and exact configured Origin validate
(403 `CSRF_INVALID`); an `Idempotency-Key` scoped to principal, Project, operation and target
(same key + same payload → prior receipt with 200; different payload → 409
`IDEMPOTENCY_KEY_REUSED`); `If-Match` equal to the Feature version or Project feature-graph ETag
(428 when missing, 412 `VERSION_MISMATCH` when stale); and authority re-resolved after taking the
Project lock, using the clock read after the lock (owner of the Business, or installation
operator). The resource change, a typed ProjectFeatureMutationReceipt (target and resource
discriminators, payload hash, ETag, version) and exactly one AuditEvent SHALL commit atomically.

## Acceptance criteria

- AC-014-005-01 — Given a request without `If-Match`, then 428 `PRECONDITION_REQUIRED`.
- AC-014-005-02 — Given the owner's grant is revoked while the request waits on the Project lock, then the mutation is refused.
- AC-014-005-03 — Given an audit insert failure, then no Feature change or receipt persists.

## Verification

- TC-014-001 — Feature mutations, CAS, idempotency, audit (see [verification.md](../verification.md))
- TC-014-005 — Owner forms in the browser (see [verification.md](../verification.md))
