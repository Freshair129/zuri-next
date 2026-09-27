---
id: SDD-059
title: "FlowAccount read-only pull pipeline — design"
---

# SDD-059 — FlowAccount read-only pull pipeline design

- **Components (planned):** CMP-126 (token exchange, resource catalog, paginator, limiter); CMP-127 (Platform UI); provisioner through CMP-144.
- **Data owned:** IntegrationConnection (a `DATA_SOURCE` connection kind, not yet in the kind vocabulary), IngestionRun, SyncCursor, RawExternalRecord, DeadLetterRecord.
- **Contracts exposed:** none yet.
- **Contracts consumed:** API-160, API-161, credential-write gate.
- **Main sequence:** wizard → vault write → token → company verify → ACTIVE → per-resource run → envelopes → raw records → cursor on completion.
- **Failure modes:** terminal failure → run FAILED + dead letter, cursor not advanced.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-059-001..003 | — (declared; design in ADR-056) |
