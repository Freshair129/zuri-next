---
id: FR-052-001
title: "Deployment liveness probe"
delivery: live
legacy: [FR-142 (split 1/2)]
relations:
  specified_by: [API-125]
  decided_by: [ADR-044]
---

# FR-052-001 — Deployment liveness probe

The system SHALL answer `GET /api/health` with no session, run exactly one
trivial query (`SELECT 1`) against the configured application database, and
return `{status:'ok', db:'ok'}` (200) or `{status:'degraded', db:'unreachable'}`
(503) — states only, never an error message, host or credential.

## Acceptance criteria

- AC-052-001-01 — Given a reachable database, when `GET /api/health` is called, then it returns 200 with `{status:'ok', db:'ok'}`.
- AC-052-001-02 — Given an unreachable database, when called, then it returns 503 with `{status:'degraded', db:'unreachable'}` and no error detail.

## Implementation

- `apps/server/src/app/api/health/route.js`

## Verification

- TC-052-001 — Health route states (see [verification.md](../verification.md))
