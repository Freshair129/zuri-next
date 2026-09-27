---
id: SRV-003
title: Conversation Runtime service
kind: service
status: draft
delivery: implemented
legacy: [services/conversation-runtime, docker-compose.conversation-runtime.yml, SDD-110, ADR-106]
relations:
  decided_by: [ADR-092, ADR-095, ADR-097]
---

# SRV-003 — Conversation Runtime service

## Responsibility
Executes LINE conversation turns for jobs whose executor cohort is
`CONVERSATION_RUNTIME`: claims eligible work through core, checks current authority,
composes turn context, routes bounded tools, invokes the model and coordinates
delivery and trace reporting. It has no web framework, ORM client, database
credential or direct table access; every authority and side effect goes through the
private `conversation-runtime.v1` core ports hosted by SRV-001.

Core (SRV-001) keeps: webhook signature validation, admission, account binding,
routing, authoritative claims/leases/receipts, identity and consent, integration
secrets and provider transport, CRM records, canonical work writers, memory/knowledge
adapters and trace persistence.

## Domains hosted
DOM-AGT (turn orchestration for the runtime cohort). DOM-LOA owns the job ledger and
account opt-in (`runtimeOwner`), which remain in core.

## Entrypoints
- `GET /healthz` (liveness), `GET /readyz` (configuration and core reachability).
- Outbound core ports (`/api/internal/conversation-runtime/v1/{operation}`):
  Job/Admission (`claim`, `renew`, `complete`, `fail`, `status`), Authority/Context
  (`resolve`, `prepare`), WorkTool (`read`, `propose`, `confirm-execute`, `status`),
  Model (`credential`, `invoke`), Memory/Knowledge (`read`, `append`, `receipt`),
  Delivery (`send`, `receipt`), Trace/Audit (`append`, `status`). Every request
  carries contract version, correlation id, deadline and idempotency key.

## Configuration (names only)
`CONVERSATION_RUNTIME_PORT`, `CONVERSATION_RUNTIME_CORE_URL`,
`CONVERSATION_RUNTIME_TOKEN` (dedicated private token, also set on SRV-001). No model
or channel credential is ever configured here; a model credential is a claim-bound,
short-lived, memory-only grant excluded from logs and traces.

## Dependencies
SRV-001 (core ports) only. If core is unreachable or a route is missing, the service
stops claiming and reports unavailable; it never falls back to the in-process worker.

## Scaling and state
Stateless; one job belongs to exactly one executor cohort fixed at admission, so the
runtime and SRV-002 never compete for the same job. A timed-out provider
operation whose acceptance cannot be established is `UNKNOWN`; ambiguous replies are
never retried as push. No exactly-once delivery claim.

## Deploy unit
Own image (`services/conversation-runtime/Dockerfile`, built from the repository
root); Compose overlay `docker-compose.conversation-runtime.yml`, profile
`conversation-runtime`. Production cutover (opting accounts into the runtime cohort)
is a separately gated operator step. See RB-005.
