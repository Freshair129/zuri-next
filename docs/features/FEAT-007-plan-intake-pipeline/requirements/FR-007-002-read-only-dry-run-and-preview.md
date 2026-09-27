---
id: FR-007-002
title: "Read-only dry run and preview"
delivery: live
legacy: [FR-012 (split 2/3 — dry run)]
relations:
  specified_by: [API-039]
---

# FR-007-002 — Read-only dry run and preview

The system SHALL produce, without writing, a preview classifying every Project, Workstream,
Container, Item, Milestone, Gate, Repository and Dependency as insert, update or conflict,
resolving identity by external reference first, then by code constrained to the plan's
target scope (a code that exists outside that scope is a conflict, never an insert or a
silent skip), and SHALL flag as conflicts assignees that are not active members of the
target Business. A preview with conflicts SHALL not be committable.

## Acceptance criteria

- AC-007-002-01 — Given item code `WI-1` existing under a different Workstream, then the preview lists a conflict "belongs to a different workstream".
- AC-007-002-02 — Given an assignee without an active Membership in the target Business, then a conflict of kind `assignee` is listed.
- AC-007-002-03 — Given a valid plan, when dry-run is called twice, then the database is unchanged.

## Implementation

- apps/server/src/modules/project-manager/import/plan-import-service.js; apps/server/src/app/api/import/dry-run/route.js; apps/server/src/app/api/import/commit/route.js

## Verification

- TC-007-002 — Dry run, commit, rollback and idempotency (see [verification.md](../verification.md))
