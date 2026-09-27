---
id: SRV-002
title: LINE job worker
kind: worker
status: draft
delivery: implemented
legacy: [apps/server/scripts/server-line-worker.mjs, compose service line-worker, FR-149, FR-152]
relations:
  decided_by: [ADR-095, ADR-091]
---

# SRV-002 — LINE job worker

## Responsibility
A supervisor loop that drives the durable LINE job ledger forward. Each round calls
SRV-001's authenticated worker endpoint (a conversation tick: claim and execute up to
N jobs concurrently, then send ready answers in order), and at a minimum interval the
rich-menu worker endpoint. All logic, leases and state transitions run inside SRV-001;
this process holds no channel secret, no database credential and no job state.

## Domains hosted
None directly; it triggers DOM-LOA (jobs, rich menus) and DOM-AGT (server answers)
work executed in SRV-001.

## Entrypoints
- Process command `node scripts/server-line-worker.mjs`.
- Outbound only: `POST {ZURI_LINE_WORKER_URL}` (`/api/line-oa/worker`) and
  `POST /api/line-oa/rich-menu-worker` with the worker bearer token; 240 s request
  timeout; redirects refused.

## Configuration (names only)
`ZURI_LINE_WORKER_URL` (must be the `/api/line-oa/worker` path on `web`, loopback or
HTTPS), `ZURI_LINE_WORKER_TOKEN` (≥ 32 characters; same value configured on SRV-001).
Execution concurrency and send batch size are configured on SRV-001.

## Dependencies
SRV-001 (healthy) only.

## Scaling and state
Stateless. Cadence adapts to work: fast while rounds do work, geometric back-off while
idle; admission also nudges the worker endpoint immediately, so the loop is a floor,
not the latency path. Concurrency safety comes from compare-and-set versions and
leases inside SRV-001, so more than one worker is safe but not needed. Stops cleanly
on SIGTERM/SIGINT.

## Deploy unit
Same image as SRV-001; Compose service `line-worker` in profile `line-server`,
enabled together with the `docker-compose.line-server.yml` overlay. See RB-005
and RB-004.
