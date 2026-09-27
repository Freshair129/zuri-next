---
id: FR-070-004
title: "Deduplication and version relationships within one tenant"
delivery: implemented
legacy: [FR-117]
relations:
  specified_by: [CMP-193]
  derived_from: [BR-066]
  decided_by: [ADR-063]
---

# FR-070-004 — Deduplication and version relationships within one tenant

The system SHALL classify an incoming artifact against held candidates of the **same
tenant only** as `DUPLICATE_OF` (identical BR-066 four-part identity), `REVISION_OF`
(same `source_id`, different identity — emitting a supersession **pair**, `SUPERSEDES`
from the incoming artifact and `SUPERSEDED_BY` back to the prior one) or `INDEPENDENT`
(neither). The tenant SHALL be folded into the identity hash itself — never checked as
a separate comparison — so that no cross-tenant collapse can be expressed, not merely
guarded against. A missing `source_id`, `source_version`, `content_hash`,
`pipeline_version` or tenant SHALL be refused by name rather than defaulted to an empty
string. `DERIVED_FROM` SHALL never be assigned by this calculator.

## Acceptance criteria

- AC-070-004-01 — Given two tenants each holding byte-identical content, when classified, then they receive different identities and are `INDEPENDENT`, never `DUPLICATE_OF`.
- AC-070-004-02 — Given a re-ingest under a changed `pipeline_version` with every content byte identical, when classified, then the result is `REVISION_OF`, never `DUPLICATE_OF`.
- AC-070-004-03 — Given a revision, when classified, then both `SUPERSEDES` and `SUPERSEDED_BY` edges are emitted; given a duplicate or an independent artifact, then no edge is emitted.

## Implementation

- apps/server/src/modules/knowledge/dedup.js

## Verification

- TC-070-004 — Dedup identity folds the tenant in rather than checking it (see [verification.md](../verification.md))
