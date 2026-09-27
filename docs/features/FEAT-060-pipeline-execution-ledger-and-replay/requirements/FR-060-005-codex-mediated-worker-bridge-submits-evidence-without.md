---
id: FR-060-005
title: "Codex-mediated worker bridge submits evidence without a direct Supabase or service-role credential"
delivery: implemented
legacy: [FR-071 (split 5/5), ADR-040]
relations:
  specified_by: [SDD-060]
  decided_by: [ADR-058]
---

# FR-060-005 — Codex-mediated worker bridge submits evidence without a direct Supabase or service-role credential

The system SHALL expose `data_pipeline.run_create`, `data_pipeline.document_stage`,
`data_pipeline.event_record`, `data_pipeline.monitor_read` and
`data_pipeline.replay_request` as MCP tools authenticated through the same
viewer/session boundary as any other tool call, resolving Tenant/Business/
connection scope server-side from the authenticated principal rather than a
caller-supplied override, and calling only the existing application services
(`createPipelineRunFromWorker`, `stageDocumentIntakeForPipeline`,
`recordPipelineEvent`, `getPipelineMonitor`, `requestPipelineReplay`) —
never a second, MCP-only persistence path. The bridge SHALL run in
`EVIDENCE_ONLY` mode: it SHALL NOT perform canonical Supabase apply,
Product/Customer promotion, publish or rollback. No document bytes, OCR
text, customer PII or secrets SHALL appear in a pipeline event or its audit
payload; the restricted document contract SHALL be submitted only through
the existing server-side staging boundary (`stageDocumentIntakeForPipeline`).

## Acceptance criteria

- AC-060-005-01 — Given a `data_pipeline.run_create` call whose args name a `businessCode` the caller does not own, when it executes, then the server-resolved scope governs and a mismatched destination is refused, never widened by the argument.
- AC-060-005-02 — Given a `data_pipeline.event_record` payload, when inspected, then it contains no raw document bytes, OCR text or PII field.
- AC-060-005-03 — Given the bridge in its shipped configuration, when any of its five tools is invoked, then no call path reaches a Supabase canonical-apply, promotion or publish operation.

## Implementation

- apps/server/src/platform/integrations/core/cloud-sot-agent.js; apps/server/src/platform/integrations/core/pipeline-tracking-service.js (`createPipelineRunFromWorker`); apps/server/src/modules/project-manager/mcp/transport.js; apps/server/src/app/api/mcp/route.js

## Verification

- TC-060-005 — MCP worker bridge scope resolution and evidence-only bound (see [verification.md](../verification.md))
