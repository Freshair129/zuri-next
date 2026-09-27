---
id: SDD-062
title: "Runtime wiring and webhook ingress — design"
---

# SDD-062 — Runtime wiring and webhook ingress design

- **Components:**
  - `CMP-184` — the retired `apps/server/src/app/api/agent/line-webhook/route.js`.
  - `CMP-175` — `runtime.js` (`createAgentPorts`,
    `captureAgentMemoryLineage`, `replayAgentContext`).
- **Data owned:** none.
- **Contracts exposed:** `API-173` (historical; see contracts.md).
- **Contracts consumed:** MSP tool transport (`msp_memory_upsert`/`_list`),
  GenesisBlockDB graph traversal — both optional, injected.
- **Main sequence (historical):** 1. LINE posts a signed batch to the
  webhook. 2. The route verifies the signature, normalizes each event onto
  the FR-053-001, FR-053-002, FR-053-003, FR-053-004 ingestion envelope. 3. `handleAgentTurn` runs Gate E (and
  optional Gate F). 4. The route returns the turn's response.
- **Failure modes:** an unresolved tenant is refused outright (no
  DEFAULT-tenant fallback); an unconfigured MSP/GKS backend degrades to the
  in-memory/Prisma default rather than failing the turn.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-062-001 | *(removed — see §9)* historically `apps/server/src/app/api/agent/line-webhook/route.js`, `apps/server/src/platform/integrations/providers/line/line-oa-evidence.js` |
| FR-062-002 | `apps/server/src/modules/agent/runtime.js`, `apps/server/src/modules/agent/index.js` |
