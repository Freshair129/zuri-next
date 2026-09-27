---
id: FR-056-001
title: "A gate decision is recorded with its evidence"
delivery: implemented
legacy: [FR-129 (split 1/2)]
relations:
  specified_by: [SDD-056, API-159]
  depends_on: [FR-060-001, FR-060-002]
---

# FR-056-001 — A gate decision is recorded with its evidence

The system SHALL record a publication gate decision as a `PipelineGateDecision` on the
run (gate id, status, required flag, deciding Person, reason, creation time) and SHALL
persist the evidence the reviewer acted on — the candidate publication's identity and
the added/changed/unchanged counts shown — in `evidenceJson`, returning it on read; no
new model or column is introduced.

## Acceptance criteria

- AC-056-001-01 — Given an APPROVED decision with evidence counts, when the run is read back, then the gate summary returns the same evidence.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-tracking-service.js; apps/server/src/platform/integrations/core/pipeline-tracking-contract.js

## Verification

- TC-056-001 — Gate evidence and violation detection (see [verification.md](../verification.md))
