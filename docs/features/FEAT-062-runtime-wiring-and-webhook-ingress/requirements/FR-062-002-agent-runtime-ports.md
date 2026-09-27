---
id: FR-062-002
title: "Agent runtime ports"
delivery: building
legacy: [FR-029]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-062-002 — Agent runtime ports

The system SHALL provide `createAgentPorts`, a pure composition function
that binds the agent's memory port to MSP (`createMspMemoryPort`) when an
`mspTransport` is supplied and to an in-memory default otherwise, and binds
its knowledge reader to a GenesisBlockDB-backed graph reader
(`createGraphKnowledgeReader`) when a `graphTraverse` is supplied and to the
Prisma relation reader (`queryKnowledge`) otherwise — MSP and GKS wiring
SHALL remain independent of each other, so configuring one is never a
prerequisite for the other.

## Acceptance criteria

- AC-062-002-01 — Given no `mspTransport` and no `graphTraverse`, when `createAgentPorts` runs, then it returns `{ memory: createInMemoryMemory(), knowledge: queryKnowledge, threadMemory: null }`.
- AC-062-002-02 — Given an `mspTransport` but no `graphTraverse`, when `createAgentPorts` runs, then `memory` and `threadMemory` are MSP-backed while `knowledge` remains the Prisma reader (independent wiring).

## Implementation

- `apps/server/src/modules/agent/runtime.js`, `apps/server/src/modules/agent/index.js`
