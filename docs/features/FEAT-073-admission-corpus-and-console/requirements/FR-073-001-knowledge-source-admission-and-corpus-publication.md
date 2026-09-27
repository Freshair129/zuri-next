---
id: FR-073-001
title: "Knowledge source admission and corpus publication"
delivery: implemented
legacy: [FR-173]
relations:
  specified_by: [SDD-073]
  decided_by: [ADR-067, ADR-068]
---

# FR-073-001 — Knowledge source admission and corpus publication

The system SHALL let an authorized user submit an immutable Text/Markdown body or an
existing readable FileAsset (text/Markdown) through one UI/API/MCP admission service
under a Business and optional owned, live Project association, returning a durable
queued `KnowledgeIngestion` job; the same request key with the same input SHALL return
the same job idempotently, while a changed key or changed content at an existing
source version SHALL conflict rather than silently overwrite. The system SHALL merge
only exactly-verified Stage 17 publication receipts into an immutable, append-only
`KnowledgeCorpusGeneration` manifest in one atomic transaction, per Business + optional
Project corpus, never asserting cross-document native graph traversal or a second GKS
quality gate. A query SHALL pin one corpus manifest, ask MSP for each active source's
exact snapshot, and fuse per-snapshot ranks (reciprocal-rank fusion, k=60); a required
snapshot/read failure SHALL fail the whole query rather than return a partial answer
silently labelled complete. Citation resolution SHALL bind corpus generation, source,
ingestion and chunk, and SHALL recheck current ACL/revocation on every resolution —
a source withdrawn or deleted after an answer was generated SHALL deny that citation
even though it was valid when produced. Withdrawing a source SHALL atomically remove
its corpus serving membership while retaining audit history; an older admitted
revision SHALL never overwrite a newer admitted source revision.

## Acceptance criteria

- AC-073-001-01 — Given two documents admitted and published under one corpus, when one is corrected, then the correction preserves the other document's snapshot reference and a stale completion of the older run cannot overwrite the newer correction.
- AC-073-001-02 — Given a source withdrawn after an answer cited it, when the citation is later resolved, then access is denied even though the citation was valid when the answer was produced.
- AC-073-001-03 — Given a duplicate admission request under the same idempotency key and unchanged content, when submitted again, then the same job is returned; given changed content under the same key, then it conflicts (409) rather than silently replacing the prior version.
- AC-073-001-04 — Given a required snapshot read fails during a query, when the query executes, then the whole query fails rather than returning a partial result presented as complete.

## Implementation

- apps/server/src/modules/knowledge/knowledge-admission-service.js; apps/server/src/modules/knowledge/knowledge-corpus-service.js; apps/server/src/modules/knowledge/knowledge-authorization.js; apps/server/src/modules/knowledge/knowledge-execution-authority.js; apps/server/src/app/api/knowledge/ingestions/**; apps/server/src/app/api/knowledge/queries/route.js; apps/server/src/app/api/knowledge/citations/**; apps/server/src/app/api/knowledge/sources/**; apps/server/src/app/api/knowledge/corpora/**

## Verification

- TC-073-001 — Isolated end-to-end admission through native publication (see [verification.md](../verification.md))
- TC-073-002 — Admission service unit contract (see [verification.md](../verification.md))
