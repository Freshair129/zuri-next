---
id: SDD-069
title: "Device and handoff operations (retired Edge Device surfaces) — design"
---

# SDD-069 — Device and handoff operations (retired Edge Device surfaces) design

- **Components (historical):** `CMP-150` — formerly
  `apps/server/src/app/api/agent/line-asset-handoff/route.js` +
  `apps/server/src/modules/asset-management/import/line-asset-handoff.js`.
  `CMP-157` — formerly
  `apps/server/src/app/api/agent/heartbeat/route.js` +
  `apps/server/src/modules/agent/edge-device-registry.js`.
- **Data owned:** none in either case — the heartbeat registry was
  explicitly an in-memory, process-local cache, never a Prisma model
  (charter decision); `EdgeDeviceCredential`/pairing rows belong to
  `legacy:FR-144`, preserved per ADR-095 D3 but not owned by this domain.
- **Contracts exposed:** `API-170` (gap, see §9),
  `API-168` (retired, see §9) — both in contracts.md for
  traceability.
- **Contracts consumed:** the canonical Asset intake service
  (`FEAT-087`), `legacy:FR-144`'s `resolveEdgeDeviceContext`
  (historical, for `deviceToken` compatibility acceptance).
- **Main sequence / failure modes:** historical only — see §9.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-069-001 | *(removed — historically `apps/server/src/app/api/agent/line-asset-handoff/route.js`, `apps/server/src/modules/asset-management/import/line-asset-handoff.js`)* |
| FR-069-002 | *(removed — historically `apps/server/src/app/api/agent/heartbeat/route.js`, `apps/server/src/modules/agent/edge-device-registry.js`)* |
