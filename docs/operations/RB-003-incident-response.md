---
id: RB-003
title: Incident response and known failure modes
status: draft
owner: operations
legacy: [docs/deployment/docker-ngrok.md (known limits), .brain/rca 2026-09-06 … 2026-09-24 (overlay dropped on redeploy, deleted in-use resources, worker namespace recreate, runtime credential drift, forced-RLS drift, admission ack before outbox, post-reboot ingress outage)]
relations:
  decided_by: [ADR-091, ADR-099, ADR-105]
---

# RB-003 — Incident response and known failure modes

## 1. Triage (first 10 minutes)

1. **Scope:** which surface fails (console, LINE answers, knowledge, a single
   Business)? Check `GET /api/health` locally and through the public origin.
2. **Containers:** `docker compose ps` and `docker compose logs --since 30m <service>`
   for `web`, `ngrok`, `line-worker`, `genesis-worker`, `conversation-runtime`.
3. **Correlation:** take the correlation id from the failing response or log record
   and follow it through structured logs and the audit table. Logs never contain
   message text or tokens; do not add them to diagnose.
4. **Contain before fixing** when data could be harmed: pause affected LINE accounts
   (routing first), stop workers, never delete jobs, evidence, volumes or rows.
5. Record timeline, evidence and decisions in the incident record — no secrets, URLs
   with credentials, tokens or customer content.

## 2. Known failure modes

| Symptom | Likely cause | Action |
|---|---|---|
| Every LINE delivery and worker call returns 503 after a deploy | production overlay dropped (an explicit `-f` replaced `COMPOSE_FILE`, or env file not beside the compose file) | redeploy with the full overlay list; verify config-files label and LINE-server flag (RB-005 §2) |
| Knowledge relay returns `pipeline_worker_unavailable` while containers look healthy | `web` recreated; worker left in the old network namespace | recreate `genesis-worker` with the same image; rerun relay smoke |
| Webhook not reached after host reboot | tunnel/agent not restarted or reverted configuration; container runtime socket stale; VPN/MTU interference | check tunnel request log first, then container runtime, then network; restore the single intended webhook owner |
| LINE customers answered twice | two receivers own the same channel | pause one immediately; follow RB-004 §3 |
| Jobs end `EXECUTION_FAILED`, nothing sent | no model-provider key for the Business, or provider down | expected until the key exists; otherwise inspect provider status; never enable a silent fallback |
| Jobs stuck `UNKNOWN` | provider acceptance ambiguous (timeout) | review and acknowledge; do not resend |
| Runtime database login fails (`28P01`/identifier errors) | stale credential or incomplete pooler username in deployment config | rotate through the operator role path; never substitute the general app login for a restricted role |
| A table readable/writable more broadly than intended | RLS enabled but not forced, or grants drift | apply a reviewed hardening migration (RB-002); verify catalog |
| Events acknowledged but never admitted after a crash | acknowledgement before durable admission marker | reconciler re-admits `ADMITTING` rows; if rows stuck `RECEIVED`, escalate (contract defect) |
| Production query latency ~5× network RTT | transaction pooling on a single container | set session pooling / remove override (NFR-025) |
| Local file workspace unavailable in container | by design (Windows path containment) | use on a Windows host runtime only |

## 3. Shared-resource safety

Before deleting or recreating any shared resource (worktree, container, volume, disk
image), check who is using it — process table, container attachments, other sessions —
and ask the owner when unsure. "Clean and merged" does not mean "unused". Never run
`down -v` on the production project.

## 4. Close-out

Write a root-cause analysis: symptom, evidence, root cause, fix, prevention (a test,
a check or a written rule next to the construct that failed). Link it from the
affected runbook when it changes procedure.
