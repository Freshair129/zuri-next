---
id: FR-074-001
title: "Knowledge graph projection of Zuri relations, never live facts"
delivery: building
legacy: [FR-024]
relations:
  specified_by: [SDD-074]
  decided_by: [ADR-064]
---

# FR-074-001 — Knowledge graph projection of Zuri relations, never live facts

The system SHALL project Zuri's own relations (Customer, Business, Conversation,
Membership) into a graph via a pluggable `GraphSink` seam, tenant-scoped and
deterministic, and SHALL refuse to project any live-fact field (`price`, `credit`,
`invoice`, `payment`, `stock`, `schedule`, `amount`, `balance` — the `LIVE_FACT_FIELDS`
set) via an `assertNoLiveFacts` guard evaluated before any write reaches the sink. It
SHALL expose `queryKnowledge` (a principal-neighbourhood read over Zuri's own database)
as the read contract the agent domain consumes, and SHALL expose
`createGraphKnowledgeReader` for reading through an injected `traverse` function that
may only ever be bound through MSP → GKS or the interim serving surface — never
directly to GenesisBlockDB.

## Acceptance criteria

- AC-074-001-01 — Given a projection input naming a `price` or `stock` field, when `projectKnowledgeGraph` runs, then `assertNoLiveFacts` refuses it before any sink write is attempted.
- AC-074-001-02 — Given a `queryKnowledge` call for one tenant's principal, when executed, then the result is deterministic and scoped to that tenant alone.
- AC-074-001-03 — Given `createGraphKnowledgeReader` with no `traverse` bound, when a read is attempted, then it falls back to the plain Prisma `queryKnowledge` path rather than reaching any substrate directly.

## Implementation

- apps/server/src/modules/knowledge/graph-query.js; apps/server/src/modules/knowledge/project-graph.js; apps/server/src/modules/knowledge/sink.js; apps/server/src/modules/knowledge/query.js; apps/server/src/modules/knowledge/live-facts.js; apps/server/src/modules/knowledge/index.js

## Verification

- TC-074-001 — Graph projection refuses live facts and stays tenant-scoped (see [verification.md](../verification.md))
