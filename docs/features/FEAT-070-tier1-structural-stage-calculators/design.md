---
id: SDD-070
title: "Tier 1 structural stage calculators — design"
---

# SDD-070 — Tier 1 structural stage calculators design

- **Components:** CMP-209 (`src/modules/knowledge/parsing.js`,
  `parseDocument`) · CMP-217 (`provenance.js`, `buildSourceProvenance`,
  `assertPublishable`, `traceToSource`) · CMP-208 (`normalization.js`,
  `normalizeValue`, `normalizeOrganizationName`) · CMP-193 (`dedup.js`,
  `ingestionIdentity`, `classifyAgainst`) · CMP-188 (`chunking.js`,
  `chunkDocument`) · CMP-194 (`entity-extraction.js`,
  `extractEntityCandidates`, `defaultRecognizer`).
- **Data owned:** none. Every calculator returns an in-memory value to its caller;
  `owns_models: []` holds for this feature exactly as the domain charter states.
- **Contracts exposed:** none (library functions, no route/API/EVT).
- **Contracts consumed:** none directly; `scope` comes from `FR-072-003`
  (classification, Stage 5) and identity comes from `FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005`/`FR-053-001, FR-053-002, FR-053-003, FR-053-004`
  (Stage 1), both upstream callers' concern.
- **Main sequence:** composed in ADR-063 D2's fixed order by `FEAT-071`:
  Parse → Provenance → Normalize → (Classify, Stage 5, outside this feature) →
  Dedupe → Chunk → Entity Extraction, over one artifact, in one call.
- **Failure modes:** each calculator throws a typed validation error naming the missing
  or invalid field; none classifies or quarantines its own failure (`FEAT-071`
  owns that).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-070-001 | apps/server/src/modules/knowledge/parsing.js |
| FR-070-002 | apps/server/src/modules/knowledge/provenance.js |
| FR-070-003 | apps/server/src/modules/knowledge/normalization.js |
| FR-070-004 | apps/server/src/modules/knowledge/dedup.js |
| FR-070-005 | apps/server/src/modules/knowledge/chunking.js |
| FR-070-006 | apps/server/src/modules/knowledge/entity-extraction.js |
