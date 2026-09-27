---
id: FR-076-001
title: "Data pipeline registry and generated projection"
delivery: implemented
legacy: [FR-212]
relations:
  specified_by: [SDD-076]
  decided_by: [ADR-070]
---

# FR-076-001 — Data pipeline registry and generated projection

The system SHALL maintain `docs/DATA-PIPELINE-MAP.md` as one JSON registry of nodes
(kind SOURCE, ENTRY, PROCESS, STORE, RECIPIENT), labelled edges and chains (an ordered
path of edges from a source to a recipient), and SHALL generate
`docs/.data-pipeline-map.json` and the committed `runtime/data-pipeline-map.json` from
it on every `govern` run. Every internal node SHALL name its owning domain and at least
one declared requirement; the generator SHALL derive each node's surface level from
what actually exists (an `ENDPOINT` from an existing `route.js`, a `UI` from an
existing `page.jsx`, an `MCP` from a registered tool name, a `WORKER`/`FILE` from an
existing file) and its build status from the requirements snapshot, accepting a
`PRODUCTION` claim only with written evidence. An edge SHALL take the weakest status of
the internal nodes it joins, and a chain the weakest of its edges. Generation SHALL
fail by name on an unknown requirement/decision id, a missing surface, an
unsubstantiated production claim, an edge to an unknown node, a node no edge touches,
or a chain that does not run start-to-end from a SOURCE to a RECIPIENT.

## Acceptance criteria

- AC-076-001-01 — Given a registry node naming a requirement id the snapshot does not know, when the generator runs, then generation fails by name on that id.
- AC-076-001-02 — Given a node claiming `PRODUCTION` status with no written evidence, when generated, then the claim is rejected rather than silently accepted.
- AC-076-001-03 — Given a chain whose declared edges do not join end to end (a gap between two edges), when generated, then generation fails naming the break.
- AC-076-001-04 — Given an edge joining a `DECLARED` node and a `CODE_TESTS` node, when its status is derived, then the edge is reported `DECLARED` (the weaker of the two), never averaged or rounded up.

## Implementation

- scripts/data-pipeline-map.mjs; apps/server/src/modules/knowledge/pipeline-map/pipeline-map-read-model.js; docs/DATA-PIPELINE-MAP.md

## Verification

- TC-076-001 — Registry generation validates and fails by name (see [verification.md](../verification.md))
