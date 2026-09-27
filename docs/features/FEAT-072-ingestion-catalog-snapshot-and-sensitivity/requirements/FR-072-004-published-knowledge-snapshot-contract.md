---
id: FR-072-004
title: "Published knowledge snapshot contract"
delivery: building
legacy: [FR-110]
relations:
  specified_by: [SDD-072]
  derived_from: [BR-066]
  decided_by: [ADR-063, ADR-065, ADR-068]
---

# FR-072-004 — Published knowledge snapshot contract

The system SHALL make published knowledge readable only as a whole, identified
publication (`knowledge_snapshot_id`, `tenant_id`, `business_id`, `ontology_version`,
`pipeline_version`, `published_at`, object statistics), so that a retrieval answer can
name the exact corpus it read and two answers can be compared for whether they read
the same one. Publication SHALL be atomic — a half-built index is never exposed to
retrieval — and only a Stage 17 gate result of `PASS` or `PASS_WITH_WARNINGS` MAY
publish; `QUARANTINE` and `FAIL` SHALL NOT. Every gate result, publishing or not,
SHALL be recorded as a `PipelineGateDecision` whose `status` stays one of FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005's
four ledger statuses while the §23 four-value verdict is carried as that decision's
evidence — never a fifth status value. A successful run finish SHALL additionally
require the exact matching physical publication receipt from the GenesisBlock worker;
a passing gate alone SHALL NOT be sufficient to finish successfully.

## Acceptance criteria

- AC-072-004-01 — Given a Stage 17 verdict of `QUARANTINE` or `FAIL`, when publication is evaluated, then it is refused under every policy configuration.
- AC-072-004-02 — Given a gate result of `PASS`, `PASS_WITH_WARNINGS`, `QUARANTINE` or `FAIL`, when recorded, then a `PipelineGateDecision` exists for each, with `status` one of `PENDING`/`APPROVED`/`REJECTED`/`WAIVED` and the §23 result in its evidence — proven against the real database for `PASS`, `FAIL` and `QUARANTINE`.
- AC-072-004-03 — Given a run whose Stage 17 gate passed but whose publication receipt is missing or mismatched (`decisionHash`/`snapshotId`/`generation`/ `receiptHash` not all equal between evidence and receipt), when finish is requested, then the run is left open or failed, never closed successful.
- AC-072-004-04 — Given two answers, when each cites a `knowledge_snapshot_id`, then whether they read the same corpus is answerable by comparing the two ids alone.

## Implementation

- apps/server/src/modules/knowledge/published-snapshot-contract.js; apps/server/src/platform/integrations/core/genesisrag17-publication.js

## Verification

- TC-072-004 — Snapshot contract, atomic publication and receipt-gated finish (see [verification.md](../verification.md))
- TC-072-005 — Isolated end-to-end acceptance (fixed corpus thresholds) (see [verification.md](../verification.md))
