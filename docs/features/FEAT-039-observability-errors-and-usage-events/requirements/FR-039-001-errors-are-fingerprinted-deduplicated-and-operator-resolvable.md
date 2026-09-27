---
id: FR-039-001
title: "Errors are fingerprinted, deduplicated and operator-resolvable"
delivery: building
legacy: [FR-247]
relations:
  specified_by: [SDD-039]
  decided_by: [ADR-037]
---

# FR-039-001 — Errors are fingerprinted, deduplicated and operator-resolvable

`logger.exception(event, error, fields)` SHALL emit exactly as `error()`
does today, compute `fingerprint = sha256(name + ':' + message + ':' +
firstStackFrame)`, and return `{ fingerprint, name, message, frames }`.
`recordErrorEvent(db, logger.exception(...))` SHALL upsert one `ErrorEvent`
row per fingerprint — a new fingerprint inserts with `occurrenceCount: 1`; a
repeat increments `occurrenceCount`/`lastSeenAt`, leaving `firstSeenAt`
untouched. Only `name`, `message` and parsed `{file, line, function}` stack
frames SHALL be kept; a frame that fails the `file:line` shape SHALL be
dropped, not stored as free text. An operator SHALL read the list grouped by
fingerprint under `/control/errors` and mark one resolved.

## Acceptance criteria

- AC-039-001-01 — Given the same error recurring three times, when each occurrence is recorded, then exactly one `ErrorEvent` row exists with `occurrenceCount: 3`.
- AC-039-001-02 — Given an operator resolves an `ErrorEvent`, when a new occurrence of the same fingerprint arrives afterward, then it still increments the same row (resolution does not fork a new fingerprint).

## Implementation

- `apps/server/src/app/(control)/control/errors/page.jsx`, `apps/server/src/app/api/platform/error-events/**`, `apps/server/src/lib/observability/logger.js`, `apps/server/src/modules/platform-control/{application/error-events.js,components/ErrorEventsView.jsx}`

## Verification

- TC-039-001 — Error fingerprinting, dedup and resolve (see [verification.md](../verification.md))
