---
id: FR-011-001
title: "Immutable approval request per effectful step"
delivery: implemented
legacy: [FR-272 (split 1/3 — request)]
relations:
  specified_by: [SDD-011]
  decided_by: [ADR-018]
  derived_from: [SEC-003, SEC-007]
---

# FR-011-001 — Immutable approval request per effectful step

The system SHALL, for a step of an existing `ProjectExecutionRun` whose status is NOT_STARTED,
READY or WAITING_APPROVAL and whose action class is one of PROJECT_WRITE, EXTERNAL_MESSAGE,
SPEND, CREDENTIAL_CHANGE, MERGE, DEPLOY or DESTRUCTIVE, create a `ProjectApprovalRequest`
scoped to the server-resolved Tenant/Business/Workspace/Project and exact run/step, carrying
action class, effect key, manifest/input/artifact hashes (SHA-256), optional commit SHA, a
redacted effect summary (≤ 16 KiB; keys resembling secrets, tokens, audio, transcripts, commands
are refused), expected effects, eligible reviewer capability, policy version
`pm-approval-gateway.v1` and expiry (default 15 min, max 24 h); its canonical SHA-256
`requestDigest` over all of these SHALL be immutable. READ_ONLY steps SHALL create no row. The
requester SHALL own the Business or hold `project.execution.request` there; the request scope
SHALL match the PM trace scope. A new request for the same step SHALL supersede the prior one.

## Acceptance criteria

- AC-011-001-01 — Given a READ_ONLY step, then no approval row is created.
- AC-011-001-02 — Given a summary containing key `apiKey`, then the request is refused.
- AC-011-001-03 — Given a request whose Business differs from the run's, then 403 `SCOPE_NOT_ALLOWED`.

## Implementation

- apps/server/src/modules/project-manager/application/approval-gateway.js

## Verification

- TC-011-001 — Approval gateway lifecycle (see [verification.md](../verification.md))
