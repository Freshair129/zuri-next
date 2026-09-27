---
id: FR-010-002
title: "Agent intake over MCP"
delivery: live
legacy: [FR-069 (split 1/4 — agent intake)]
relations:
  specified_by: [API-042]
  derived_from: [BR-054, SEC-002]
---

# FR-010-002 — Agent intake over MCP

The system SHALL expose a JSON-RPC 2.0 MCP endpoint (protocol `2024-11-05`, `initialize`,
`tools/list`, `tools/call`) for an authenticated viewer, offering the PM tools
`project_manager.plan_dry_run`, `project_manager.plan_commit`, `project_manager.work_read` and
`project_manager.work_status_update`, each mapped onto the same PlanEnvelope dry run/commit and
work services with the caller's own authority (re-resolved per call). Tool arguments SHALL be
validated strictly; unknown methods SHALL return JSON-RPC -32601.

## Acceptance criteria

- AC-010-002-01 — Given no session, then the endpoint answers JSON-RPC error -32001 with HTTP 401.
- AC-010-002-02 — Given `plan_commit` for a Workspace the viewer does not own, then the same refusal as the HTTP import is returned and nothing is written.

## Implementation

- apps/server/src/modules/project-manager/mcp/transport.js; apps/server/src/app/api/mcp/route.js

## Verification

- TC-010-002 — MCP transport (see [verification.md](../verification.md))
