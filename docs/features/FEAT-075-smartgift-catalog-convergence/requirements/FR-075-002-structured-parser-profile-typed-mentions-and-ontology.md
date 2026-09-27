---
id: FR-075-002
title: "Structured parser profile, typed mentions and ontology_v2"
delivery: building
legacy: [FR-188]
relations:
  specified_by: [SDD-075]
  decided_by: [ADR-069]
---

# FR-075-002 — Structured parser profile, typed mentions and ontology_v2

The system SHALL render each SmartGift catalog record, under the
`genesisrag17-parser-2` profile, as one descriptive chunk (one mention: the record's
own `Product`/`PACKAGE`/`PRICE_TIER` entity) followed by one claim chunk per relation,
each claim chunk's whole text being the canonical-JSON triple
`{subject, predicate, object}`. Stage 8 extraction under this profile SHALL use the
pinned structured recognizer only — the one exception to the general recognizer-guard
closure — typing occurrences by the predicate (`HAS_COMPONENT` → `Product`,
`PRICED_AT` → `PRICE_TIER`, `IN_CATEGORY` → `CATEGORY`) and resolving with the
SmartGift code verbatim as `resolutionKey`, never through `normalizeOrganizationName`.
The system SHALL accept both `ontology_v1` and the superset `ontology_v2`
(`HAS_COMPONENT`, `PRICED_AT`, `IN_CATEGORY`) without ever rewriting an already-
published `ontology_v1` snapshot, and SHALL refuse — at Stage 2, never left for a later
stage to discover — any batch mixing dated and undated records or naming more than one
catalog-version date.

## Acceptance criteria

- AC-075-002-01 — Given a `ProductMaster` record and its `BundleOffer` package, when rendered under parser-2, then the descriptive chunk carries exactly one mention and each relation's claim chunk is an exact-substring canonical-JSON triple.
- AC-075-002-02 — Given a caller names `genesisrag17-parser-1`, a token budget or a custom chunker version on a `SMARTGIFT_CATALOG` source, when submitted, then it is refused 400 `GENESISRAG17_PARSER_CONFIG_UNSUPPORTED` — the profile follows the provider and is never caller-selectable.
- AC-075-002-03 — Given a batch mixing a dated and an undated record, when parsed, then Stage 2 refuses it as a parser error rather than persisting a mixed batch.
- AC-075-002-04 — Given an `ontology_v1` snapshot already published, when `ontology_v2` becomes available, then the `ontology_v1` snapshot remains queryable unchanged as an older generation.

## Implementation

- apps/server/src/modules/knowledge/genesisrag17-structured-record.js; apps/server/src/modules/knowledge/genesisrag17-source.js; apps/server/src/platform/integrations/core/genesisrag17-executor.js; apps/server/src/modules/knowledge/knowledge-corpus-service.js

## Verification

- TC-075-002 — Parser-2 rendering, structured recognizer and ontology_v2 (see [verification.md](../verification.md))
