---
id: SDD-011
title: "Approval gateway for effectful agent steps — design"
---

# SDD-011 — Approval gateway for effectful agent steps design

- **Components:** CMP-001 (`buildApprovalDigest`, `requestApproval`, `decideApproval`, `admitApprovedStep`, `revokeOrSupersede`, `listApprovals`, `approvalDto`); CMP-012 (run/step source of truth).
- **Data owned:** ProjectApprovalRequest (`approvalRequestId`, scope ids, run/step refs, `actionClass`, `effectKey`, hashes, `payloadSummaryJson`, `expectedEffectsJson`, `eligibleReviewerCapability`, `policyVersion`, `requestedByPersonId`, `expiresAt`, `requestDigest`, `state`, decision fields, admission lease fields, `auditEventId`).
- **Contracts exposed:** API-023, API-022; in-process `requestApproval` / `admitApprovedStep` for executors.
- **Contracts consumed:** IAM `ownsBusiness`, `hasPermission(viewer, businessId, capability)` (FR-024-003).
- **States:** PENDING → APPROVED → CONSUMED; PENDING → REJECTED | EXPIRED | SUPERSEDED | REVOKED; APPROVED → REVOKED | SUPERSEDED | EXPIRED.
- **Failure modes:** unknown outcome at executor requires reconciliation (no automatic re-admission); all refusals carry machine codes.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-011-001..003 | apps/server/src/modules/project-manager/application/approval-gateway.js |
| FR-011-002 | apps/server/src/app/api/projects/[id]/execution-runs/[executionRunId]/approvals/route.js; …/approvals/[approvalRequestId]/decision/route.js |
