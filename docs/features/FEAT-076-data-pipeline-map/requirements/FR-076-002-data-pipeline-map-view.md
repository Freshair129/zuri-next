---
id: FR-076-002
title: "Data Pipeline Map view"
delivery: implemented
legacy: [FR-213]
relations:
  specified_by: [SDD-076]
  derived_from: [FR-018-002, FR-018-003, FR-024-003]
  decided_by: [ADR-070]
---

# FR-076-002 — Data Pipeline Map view

The system SHALL render the FR-076-001 projection at `/knowledge/data-pipeline` as
a layered node-edge graph in hand-rolled inline SVG — columns for sources, entry
surfaces, processes, stores and recipients, nodes coloured by build status with the
status word beside the colour, edges labelled — with summary figures, a chain filter
highlighting one chain's full path, domain and status filters, a detail panel naming a
selected node/edge/chain's domain, FEATs, requirement statuses, surfaces and
decisions, and an equivalent list view presenting the same chains/nodes/edges as
tables. Every node, edge and chain SHALL be reachable and selectable by keyboard. The
page SHALL resolve the viewer server-side and SHALL send no projection at all unless
the viewer holds `knowledge` visible in at least one Business — the same projection
for every admitted viewer, with no per-viewer variation.

## Acceptance criteria

- AC-076-002-01 — Given a viewer without `knowledge` visible in any Business, when the page is requested, then no projection data reaches the response payload.
- AC-076-002-02 — Given a chain is selected via the filter, when the view renders, then that chain's full path — every node and edge on it — is visually highlighted end to end.
- AC-076-002-03 — Given keyboard-only navigation, when a user tabs through the view, then every node, edge and chain is reachable and selectable without a mouse.
- AC-076-002-04 — Given the same viewer switches to the list view, then it shows the identical chains, nodes and edges as the graph view, as tables.

## Implementation

- apps/server/src/app/(pm)/knowledge/data-pipeline/page.jsx; apps/server/src/modules/knowledge/pipeline-map/DataPipelineMapView.jsx; apps/server/src/modules/knowledge/pipeline-map/DataPipelineMap3D.jsx; apps/server/src/modules/knowledge/pipeline-map/pipeline-map-layout.js; apps/server/src/modules/knowledge/pipeline-map/pipeline-map-access.js

## Verification

- TC-076-002 — Map view rendering, filters and admission (see [verification.md](../verification.md))
