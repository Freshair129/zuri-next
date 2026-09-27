---
id: SDD-064
title: "LINE delivery and scope binding — design"
---

# SDD-064 — LINE delivery and scope binding design

- **Components:**
  - `CMP-165` — historically the webhook's reply-recording
    half (see FEAT-062's retired route).
  - `CMP-163` — `apps/server/src/modules/knowledge/postgres-business-knowledge.js`.
  - `CMP-152` — `line-channel-binding.js` (env-configured
    variant), `line-binding-resolver.js` (Postgres-backed variant),
    `phase1-runtime.js` (pool + role execution).
  - `CMP-153` — `line-binding-status.js`.
- **Data owned:** none — `zuri_core.line_channel_binding` and
  `zuri_core.business_knowledge` are production Postgres tables this domain
  reads under a scoped role; it owns neither schema.
- **Contracts exposed:** `API-171` (consumed
  in-process by `DOM-LOA`'s account health check).
- **Contracts consumed:** none new.
- **Main sequence (status read):** 1. `DOM-LOA`'s account service calls
  `createLineBindingStatusReaderFromEnv`. 2. If configured, a
  `zuri_line_smartgift_ro`-scoped `select` runs. 3. `readLineBindingStatusLabel`
  reduces the row (or its absence) to one of four labels.
- **Failure modes:** malformed scope input never reaches SQL (Zod-validated
  first); an unconfigured reader answers `UNKNOWN` rather than guessing;
  a visible-but-non-ACTIVE row is `NOT_ACTIVE`, never a finer-grained
  guess the underlying role's policy cannot actually support.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-064-001 | *(removed — see §9)* |
| FR-064-002 | `apps/server/src/modules/knowledge/postgres-business-knowledge.js` |
| FR-064-003 | `apps/server/src/modules/agent/line-binding-resolver.js`, `apps/server/src/modules/agent/line-channel-binding.js`, `apps/server/src/modules/agent/phase1-runtime.js`, `apps/server/src/modules/knowledge/runtime-postgres-config.js` |
| FR-064-004 | `apps/server/src/modules/agent/line-binding-status.js`, `apps/server/src/modules/agent/phase1-runtime.js` |
