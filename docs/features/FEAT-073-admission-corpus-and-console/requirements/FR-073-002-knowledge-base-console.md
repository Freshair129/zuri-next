---
id: FR-073-002
title: "Knowledge base console"
delivery: implemented
legacy: [FR-254]
relations:
  specified_by: [SDD-073]
  relates_to: [FEAT-072, FEAT-073]
---

# FR-073-002 — Knowledge base console

The system SHALL provide `/knowledge/console`, where an authorized Business viewer
browses admitted source versions, every matching FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 run with per-stage evidence,
and corpus generations; admits supported sources through FR-073-001; queries one
published generation; and opens the exact cited chunk, parsed artifact and raw source
under the viewer's current authorization. Every list SHALL be bounded and
cursor-paginated with allow-listed DTOs; every source reference SHALL be checked
against current authority before disclosure; citation evidence SHALL resolve the exact
immutable chunk/parsed/raw identity with no fallback to current file bytes. Loading,
empty, error and runtime-unavailable states SHALL each be distinct and explicit —
unauthorized source existence and content SHALL be withheld identically to a
nonexistent one.

## Acceptance criteria

- AC-073-002-01 — Given more than 100 source versions exist for a Business, when the console lists them, then pagination correctly bounds and continues the list.
- AC-073-002-02 — Given a source that was revoked, deleted or is forbidden to the current viewer, when the console lists or resolves it, then its existence and content are withheld identically to a nonexistent source.
- AC-073-002-03 — Given the viewer's scope changes mid-read (e.g. a grant revoked between list and detail request), when the detail is requested, then current authority is rechecked and the read is refused if no longer authorized.
- AC-073-002-04 — Given a real isolated browser admission through to native publication, when the console resolves a citation, then all three evidence layers (chunk, parsed artifact, raw source) resolve to the exact immutable identity the citation names.

## Implementation

- apps/server/src/modules/knowledge/console/KnowledgeConsole.jsx; apps/server/src/modules/knowledge/knowledge-console-service.js; apps/server/src/modules/knowledge/knowledge-console-repository.js; apps/server/src/app/(pm)/knowledge/console/page.jsx; apps/server/src/app/api/knowledge/console/**; apps/server/src/app/api/knowledge/citations/[citationId]/artifact/route.js

## Verification

- TC-073-003 — Knowledge console — pagination, authorization and citation resolution (see [verification.md](../verification.md))
