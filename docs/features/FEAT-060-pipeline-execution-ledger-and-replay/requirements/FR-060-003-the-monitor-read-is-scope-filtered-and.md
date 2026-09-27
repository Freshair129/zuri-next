---
id: FR-060-003
title: "The monitor read is scope-filtered and never leaks secrets"
delivery: implemented
legacy: [FR-071 (split 3/5)]
relations:
  specified_by: [SDD-060, API-159]
---

# FR-060-003 — The monitor read is scope-filtered and never leaks secrets

The system SHALL answer the pipeline monitor (list and single-run read)
filtered to Businesses the viewer sees (or all, for an installation
operator), returning identities, hashes, counts, status, tags and failure
references only — never a service-role key, a database URL, another
Tenant's metadata or raw evidence payloads.

## Acceptance criteria

- AC-060-003-01 — Given a viewer who does not see the run's Business, when the run is requested by id, then it resolves as not found, not a redacted row.
- AC-060-003-02 — Given a monitor response, when inspected, then no field contains a connection string, bearer token or another Tenant's identifier.

## Implementation

- apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`listPipelineRuns`, `listPipelineRunsForHealth`, `getPipelineMonitor`); apps/server/src/app/api/pipelines/runs/route.js, apps/server/src/app/api/pipelines/runs/[executionRunId]/route.js

## Verification

- TC-060-003 — Scope-filtered monitor read (see [verification.md](../verification.md))
