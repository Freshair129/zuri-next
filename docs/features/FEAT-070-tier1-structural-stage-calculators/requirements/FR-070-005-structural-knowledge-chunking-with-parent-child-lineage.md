---
id: FR-070-005
title: "Structural knowledge chunking with parent-child lineage"
delivery: implemented
legacy: [FR-112]
relations:
  specified_by: [CMP-188]
  derived_from: [BR-066]
  decided_by: [ADR-063]
---

# FR-070-005 — Structural knowledge chunking with parent-child lineage

The system SHALL split a parsed document along its own heading structure —
document → section → chunk — rather than at a fixed token stride, carrying all eight
`DPS-KI-CHUNK` fields (`chunk_id`, `parent_id`, `document_id`, `sequence`,
`heading_path`, `token_count`, `scope`, `provenance`) on every chunk, with
`heading_path` naming the whole ancestor chain. `scope` and `provenance` SHALL be
carried verbatim from the caller and never computed here. A section exceeding
`maxTokens` (default 400) SHALL additionally emit overlapping fixed windows beneath it
(the section chunk itself surviving alongside its children), reported as a `warnings`
entry naming the oversized section. The function SHALL be pure, so the same document
produces the same `chunk_id`s on every call.

## Acceptance criteria

- AC-070-005-01 — Given a section within `maxTokens`, when chunked, then it is one chunk with `parent_id: null` and no children.
- AC-070-005-02 — Given an oversized section, when chunked, then it keeps its own chunk and gains overlapping windowed children naming it as `parent_id`, reported once in `warnings`.
- AC-070-005-03 — Given the same document chunked twice, then every `chunk_id` matches across both calls.
- AC-070-005-04 — Given a heading with no body text beneath it, when chunked, then it produces no chunk.

## Implementation

- apps/server/src/modules/knowledge/chunking.js

## Verification

- TC-070-005 — Structural chunking with fallback windows (see [verification.md](../verification.md))
