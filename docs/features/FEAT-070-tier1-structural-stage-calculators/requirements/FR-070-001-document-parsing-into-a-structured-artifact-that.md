---
id: FR-070-001
title: "Document parsing into a structured artifact that keeps its link to the raw source"
delivery: implemented
legacy: [FR-115]
relations:
  specified_by: [CMP-209]
  derived_from: [FR-053-001, FR-053-002, FR-053-003, FR-053-004]
---

# FR-070-001 — Document parsing into a structured artifact that keeps its link to the raw source

The system SHALL parse Markdown/plain-text input into a `ParsedArtifact` carrying
`document_id`, `parsed_from` (the link to the raw artifact), an ordered `structure`
block list (`heading`/`text` nodes), `text_blocks`, recognised `tables`, `warnings` and
`metadata` (including `extractor_version`). It SHALL refuse to invent structure that is
not there — a `#` inside a fenced or indented code block, `#hashtag` with no following
space, and a table whose separator disagrees with its header column count are each left
as prose (the last reported in `warnings`), never silently repaired. CRLF and a leading
byte-order mark SHALL normalize identically to LF input with no BOM.

## Acceptance criteria

- AC-070-001-01 — Given a table whose separator row disagrees with its header's column count, when the document is parsed, then the table is left as prose and one entry is added to `warnings` naming it.
- AC-070-001-02 — Given real `parseDocument` output handed to `chunkDocument` (FR-070-005), when the composition runs, then `parsed_from` survives from the artifact to every resulting chunk's `provenance`.
- AC-070-001-03 — Given an unclosed code fence, when the document is parsed, then the rest of the document is still read as text and one warning names the unclosed fence, rather than silently swallowing everything after it.
- AC-070-001-04 — Given an empty document, when it is parsed, then an empty artifact is returned (with `document_id`/`parsed_from` set) rather than throwing.

## Implementation

- apps/server/src/modules/knowledge/parsing.js

## Verification

- TC-070-001 — Document parsing refuses invented structure (see [verification.md](../verification.md))
