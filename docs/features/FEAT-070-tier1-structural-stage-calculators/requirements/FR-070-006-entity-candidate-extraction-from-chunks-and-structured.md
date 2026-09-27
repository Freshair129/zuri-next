---
id: FR-070-006
title: "Entity candidate extraction from chunks and structured records"
delivery: implemented
legacy: [FR-113]
relations:
  specified_by: [CMP-194]
  derived_from: [BR-066]
---

# FR-070-006 — Entity candidate extraction from chunks and structured records

The system SHALL extract `EntityCandidate` objects (never a canonical entity identity —
no `entity_id`, `canonical_id`, `resolved_to` field) from FR-070-005's chunks and
from caller-supplied structured records read in one pass, carrying all six
`DPS-KI-ENTITY-EXTRACT` fields (`candidate_id`, `type`, `mention`, `normalized_name`,
`source_chunk_id`, `confidence`) plus `source_record_id`, `scope` and `provenance`
carried verbatim from the source chunk or record. Two mentions of the same name SHALL
remain two distinct candidates — nothing here merges, links or resolves them. The
default recognizer SHALL claim only legal-form organisation patterns
(Thai `บริษัท…จำกัด`, `ห้างหุ้นส่วนจำกัด…`, and English `…Co., Ltd.`/`Ltd.`/`Limited`) at a
fixed confidence, and SHALL find nothing for a person, product or location — a caller
needing broader recognition SHALL supply its own recognizer function. A record mention
SHALL default `confidence: 1` (read from a declared field, not guessed).

## Acceptance criteria

- AC-070-006-01 — Given two chunks each naming the same organisation, when extracted, then two distinct candidates are produced with distinct `source_chunk_id`s, and neither carries a canonical-identity field.
- AC-070-006-02 — Given a sentence whose only entity is a person or a product, when extracted with the default recognizer, then no candidates are produced.
- AC-070-006-03 — Given a structured record with no caller-supplied confidence, when extracted, then the candidate carries `confidence: 1`.
- AC-070-006-04 — Given a caller-supplied recognizer, when extraction runs, then its type and confidence reach the candidate unchanged, replacing the default entirely.

## Implementation

- apps/server/src/modules/knowledge/entity-extraction.js

## Verification

- TC-070-006 — Entity candidates never carry canonical identity (see [verification.md](../verification.md))
