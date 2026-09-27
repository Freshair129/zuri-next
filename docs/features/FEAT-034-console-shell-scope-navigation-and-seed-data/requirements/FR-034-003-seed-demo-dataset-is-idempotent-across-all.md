---
id: FR-034-003
title: "Seed/demo dataset is idempotent across all seven product modes"
delivery: live
legacy: [FR-016]
relations:
  specified_by: [SDD-034]
---

# FR-034-003 — Seed/demo dataset is idempotent across all seven product modes

`prisma/seed.js` SHALL produce a complete demo dataset across all seven
product modes, and SHALL be idempotent — running it again SHALL NOT
duplicate rows or change ids already assigned.

## Acceptance criteria

- AC-034-003-01 — Given a seeded database, when the seed script runs a second time, then the row counts for every seeded entity are unchanged.

## Implementation

- `apps/server/prisma/seed.js`

## Verification

- TC-034-003 — Seed script idempotency across seven modes (see [verification.md](../verification.md))
