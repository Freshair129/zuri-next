---
id: FR-075-001
title: "SmartGift structured-record source adapter (before Stage 1)"
delivery: building
legacy: [FR-187]
relations:
  specified_by: [SDD-075]
  derived_from: [BR-047]
  decided_by: [ADR-069]
---

# FR-075-001 — SmartGift structured-record source adapter (before Stage 1)

The system SHALL admit a SmartGift catalog file (`format: "SMARTGIFT_CATALOG_V1"`)
through the exact same admission queue as any other source — no second caller, route,
or write path — splitting it into one record per catalog entry, each carrying a
`sourceKey` derived from the file name and the record's own `externalId`, a `version`
equal to SmartGift's own file-level SHA-256 registry hash, and a `contentHash` over the
record's canonical JSON. A changed record SHALL always be a new version, never a
rewrite — an untouched record inside a re-admitted file also takes a new version with
an identical `contentHash`, which Stage 6 deduplication already reads as the same
content. The system SHALL deny any record whose source locator or field names show CRM
shape (customer/contact/quotation, `ลูกค้า`/`ใบเสนอราคา`) at **two points**: before
enqueue (per record; other records in the same file still proceed) and again at
Stage 5 classify (for any structured provider, terminal 422 evidence) — never scanning
descriptive prose text for the same words, which would refuse ordinary catalog
descriptions.

## Acceptance criteria

- AC-075-001-01 — Given a catalog file containing one denied record among several allowed ones, when admitted, then the denied record never becomes a `KnowledgeSource` while the others proceed, and the response names the denial.
- AC-075-001-02 — Given a corrected catalog file re-admitted with one record unchanged, when split, then the unchanged record takes a new version with an identical `contentHash` to its prior version.
- AC-075-001-03 — Given two different `FileAsset`s both claiming the same catalog file name inside one corpus, when the second is admitted, then it is refused 409 `KNOWLEDGE_SOURCE_CONFLICT` rather than silently merged.
- AC-075-001-04 — Given a record denied by the adapter's pre-enqueue check, when a caller instead bypasses the adapter and the record reaches Stage 5 directly, then Stage 5's classify gate independently denies it with terminal 422 evidence.

## Implementation

- apps/server/src/modules/knowledge/smartgift-catalog-adapter.js; apps/server/src/modules/knowledge/structured-record-policy.js; apps/server/src/modules/knowledge/knowledge-admission-service.js; apps/server/src/app/api/knowledge/catalog-files/route.js

## Verification

- TC-075-001 — SmartGift adapter identity, versioning and per-record Zero-PII (see [verification.md](../verification.md))
