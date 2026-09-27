---
id: FR-070-002
title: "Derived-object provenance and the lineage chain back to a source"
delivery: implemented
legacy: [FR-116]
relations:
  specified_by: [CMP-217]
  derived_from: [FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005]
---

# FR-070-002 — Derived-object provenance and the lineage chain back to a source

The system SHALL require all ten source-lineage fields (`source_id`, `source_type`,
`source_uri`, `source_version`, `artifact_id`, `ingested_at`, `parsed_at`,
`pipeline_version`, `extractor_version`, `checksum`) on every knowledge object with no
default for any of them, refusing an absent, `null` or present-but-empty provenance
object identically. It SHALL refuse a `parsed_at` that precedes its own `ingested_at`.
An object declared `DERIVED`/`INFERRED`/`COMPUTED` in place of a raw source SHALL still
be refused unless it names `derivation_method` and a non-empty `source_objects` whose
every id **resolves** through a caller-supplied resolver — presence of a name is not
enough. The system SHALL provide a chain walker (`Fact → Chunk → ParsedArtifact →
RawArtifact → Source`) that reports (never throws) whether the chain reached a source,
which link could not resolve, or that it detected a cycle.

## Acceptance criteria

- AC-070-002-01 — Given a `DERIVED` object naming a `source_objects` id that nothing resolves, when publishability is asserted, then it is refused and the unresolvable id is named in the error.
- AC-070-002-02 — Given a chain that points at itself, when it is walked, then the walk terminates reporting `reached: false` and the cycle, rather than hanging.
- AC-070-002-03 — Given an artifact whose `parsed_at` is before its `ingested_at`, when provenance is built, then it is refused.
- AC-070-002-04 — Given no resolver is supplied, when publishability is asserted, then the call throws immediately rather than degrading to a shape-only check.

## Implementation

- apps/server/src/modules/knowledge/provenance.js

## Verification

- TC-070-002 — Provenance requires ten fields and refuses unresolvable derivation (see [verification.md](../verification.md))
