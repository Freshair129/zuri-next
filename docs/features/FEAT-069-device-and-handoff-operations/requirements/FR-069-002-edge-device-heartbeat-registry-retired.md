---
id: FR-069-002
title: "Edge Device heartbeat registry (retired)"
delivery: retired
legacy: [FR-141]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-069-002 — Edge Device heartbeat registry (retired)

The system, while this capability existed, resolved one trusted viewer on
every `GET`/`POST`/`DELETE /api/agent/heartbeat` call before any work
(fail-closed: a missing/invalid session was `401`, never an anonymous
device list); validated a heartbeat payload against a strict schema (a
failed parse was `400`, registering nothing — there was no default
device); required `businessId` to name a Business the viewer owned (`403`
otherwise); kept the registry process-local and keyed by
`(businessId, deviceId)`, by decision — the agent charter owns no Prisma
model for device liveness — so a heartbeat was a cache that went stale
after 120 s rather than a durable record; and audited every registration,
status transition and removal, writing none for a no-op tick.

## Acceptance criteria

- AC-069-002-01 (historical) — Given a request with no valid session, when any heartbeat method was called, then it returned `401` rather than an anonymous device list.
- AC-069-002-02 (historical) — Given a `businessId` the viewer did not own, when `POST`/`DELETE` was called, then it returned `403` via `ownsBusiness`.
- AC-069-002-03 (historical) — Given a heartbeat older than 120 s or a non-`healthy` status, when the console read the registry, then the device was reported offline/stale rather than falsely `online`.

## Implementation

- *(removed — historically `apps/server/src/app/api/agent/heartbeat/route.js`, `apps/server/src/modules/agent/edge-device-registry.js`)*
