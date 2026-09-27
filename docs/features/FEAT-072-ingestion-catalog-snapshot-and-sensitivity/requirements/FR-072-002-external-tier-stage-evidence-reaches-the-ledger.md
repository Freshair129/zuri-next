---
id: FR-072-002
title: "External-tier stage evidence reaches the ledger by report and by pull"
delivery: building
legacy: [FR-109 (job-lifecycle and external-reporting half)]
relations:
  specified_by: [SDD-072]
  decided_by: [ADR-065, ADR-066]
---

# FR-072-002 — External-tier stage evidence reaches the ledger by report and by pull

The system SHALL let GKS/GenesisBlockDB report Stage 9–17 evidence onto this ledger
authenticated by the run's Tenant's FR-027-001 data-plane key (never an installation
operator), refusing a Tier 1 stage id from that key with 403 regardless of caller
intent. A report SHALL be identified by run + stage + attempt + outcome — a replay
resolves `UNCHANGED`, a conflicting retry is refused 409 — and SHALL require
`startedAt`/`finishedAt` naming the execution's own timing, never the network's. A run
SHALL close only by deriving its terminal status from ledger facts
(`knowledgeRunOutcome`): every executed stage 2–17 `SUCCEEDED` behind an `APPROVED`,
publishable Stage 17 gate closes `SUCCEEDED`; any failed stage or rejected gate closes
`FAILED`; anything else is refused, naming what is still owed. Because GKS never calls
outward, the system SHALL additionally pull GKS's stage-evidence export through MSP on
a per-scope cursor (`KnowledgeEvidenceCursor`) owned by this domain, classifying every
exported row as apply / unattributed / held / blocked and advancing the cursor only
past rows that landed.

## Acceptance criteria

- AC-072-002-01 — Given a reporter key attempts to write a Tier 1 stage id (e.g. `DPS-KI-PARSE`), when the report is submitted, then it is refused 403 regardless of the reported outcome or the reporting principal.
- AC-072-002-02 — Given a run with every stage 2–17 reported `SUCCEEDED` and an `APPROVED` gate carrying a `PASS`/`PASS_WITH_WARNINGS` verdict, when finish is requested, then the run closes `SUCCEEDED`; given a run with any stage still unreported, then finish is refused 409 naming the missing stage.
- AC-072-002-03 — Given a Stage 9 execution in the real GKS naming a run, when the evidence-pull importer runs, then it lands on this ledger as `DPS-KI-ENTITY-RESOLVE` on that exact run, proven live across zuri-ai, MSP and GKS.
- AC-072-002-04 — Given an exported evidence row that names a run this ledger never minted, when pulled, then it is classified `unattributed`, the cursor advances past it, and it is listed rather than silently dropped or blocking every later row.

## Implementation

- apps/server/src/platform/integrations/core/knowledge-ingestion-executor.js; apps/server/src/platform/integrations/core/knowledge-evidence-importer.js; apps/server/src/app/api/pipelines/knowledge/[executionRunId]/**; apps/server/src/app/api/pipelines/knowledge/evidence/pull/route.js

## Verification

- TC-072-002 — External-tier reporter, run close and live cross-repo evidence pull (see [verification.md](../verification.md))
