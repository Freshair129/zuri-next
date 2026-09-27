---
id: FR-071-001
title: "Tier 1 stage composition"
delivery: implemented
legacy: [FR-118]
relations:
  specified_by: [CMP-223]
  derived_from: [BR-066]
  decided_by: [ADR-063]
---

# FR-071-001 — Tier 1 stage composition

The system SHALL call the seven Tier 1 knowledge-ingestion stages — parsing,
provenance capture, normalization, classification-carried scope, deduplication,
chunking, entity extraction — in ADR-063 D2's fixed order, over one artifact, in one
synchronous call, proving with a real composition test (not four separate pairwise
seam tests) that the seven calculators' outputs and inputs actually fit together. The
same artifact and text reprocessed SHALL produce the same chunk ids and entity-
candidate ids (determinism), and a dedup classification (`DUPLICATE_OF`/`REVISION_OF`)
SHALL survive the full composition rather than being computed and then discarded.

## Acceptance criteria

- AC-071-001-01 — Given one real artifact carrying a Thai organisation mention, a structured field and a structured record, when composed, then all seven stages run successfully in one call and their outputs compose (chunks carry the parsed provenance; entity candidates carry the chunk's scope).
- AC-071-001-02 — Given the same artifact composed twice, then the resulting chunk ids and entity-candidate ids are identical both times.
- AC-071-001-03 — Given a second pass over an already-seen artifact, when composed, then the dedup stage reports `DUPLICATE_OF`; given a new `source_version`, then it reports `REVISION_OF` with its `SUPERSEDES` edge — in both cases chunking and entity extraction still run on the artifact.

## Implementation

- apps/server/src/modules/knowledge/stage-runner.js

## Verification

- TC-071-001 — Seven-stage composition on one real artifact (see [verification.md](../verification.md))
