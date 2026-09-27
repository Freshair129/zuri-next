---
id: FR-048-004
title: "Default account is exclusive per Business, and every write is a compare-and-swap"
delivery: implemented
legacy: [FR-146 (split 4/4)]
relations:
  specified_by: [API-121]
  decided_by: [ADR-044]
---

# FR-048-004 — Default account is exclusive per Business, and every write is a compare-and-swap

The system SHALL allow at most one `isDefaultForBusiness = true` account per
Business and SHALL require the caller's `version` on every account write,
refusing a stale version as a conflict rather than applying it.

## Acceptance criteria

- AC-048-004-01 — Given account A is the Business's default, when `SET_DEFAULT` is applied to account B of the same Business, then A's flag is cleared and B's is set in the same transaction.
- AC-048-004-02 — Given a PATCH with a `version` older than the account's current `version`, when applied, then the write is refused as a conflict.

## Implementation

- `apps/server/src/app/api/line-oa/accounts/[id]/route.js`, `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`

## Verification

- TC-048-004 — Default exclusivity and version compare-and-swap (see [verification.md](../verification.md))
