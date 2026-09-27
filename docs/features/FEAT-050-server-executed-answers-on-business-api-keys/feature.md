---
id: FEAT-050
title: Server-executed answers on Business API keys
type: domain-feature
owner: DOM-LOA
runtime: SRV-001
status: draft
delivery: building
legacy: [FEAT-045, FR-265, FR-266]
relations:
  depends_on: [API-151, FEAT-048]
  decided_by: [ADR-047, ADR-049]
---

# FEAT-050 — Server-executed answers on Business API keys

## Summary

Every LINE OA conversation a server-enabled account answers now calls a real
model, under the Business's own provider API key, entered write-only from the
browser. There is no device-executed alternative left: `EDGE` transport and
execution are retired. This feature covers the account-side vocabulary
retirement, the Studio's read of the Business's model-credential readiness,
and the runtime-cohort split (`SERVER` vs the extracted Conversation Runtime)
that decides which durable executor answers a job.

## Scope

**In:** retirement of `EDGE`/`modelAccess.LOCAL_ONLY` from the account's
vocabulary and action surface; the Studio's model-key readiness read
(consumes Integration's `MODEL_PROVIDER` credential status); the readiness
journey's model-key step; the `CONFIGURE_EXECUTION` `runtimeOwner` split
between the legacy `SERVER` worker and the extracted Conversation Runtime.
**Out:** writing, validating or storing the model-provider key itself (owned
by Integration, FR-054-003 INT half, `API-151`);
the Private Runtime Platform provider itself (FR-054-005, Integration).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-001 (control plane) · SRV-003 (extracted executor, opt-in per account) |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-050-001](requirements/FR-050-001-line-oa-conversation-execution-is-server-only.md) | LINE OA conversation execution is server-only | — |
| [FR-050-002](requirements/FR-050-002-every-server-answer-calls-a-real-model.md) | Every server answer calls a real model; no canned substitute reaches a customer | — |
| [FR-050-003](requirements/FR-050-003-the-studio-reads-the-businesss-model-key.md) | The Studio reads the Business's model-key readiness, never its material | — |
| [FR-050-004](requirements/FR-050-004-conversation-execution-is-split-into-a-durable.md) | Conversation execution is split into a durable SERVER cohort and an opt-in Conversation Runtime cohort | — |
| [NFR-050-001](requirements/NFR-050-001-no-model-provider-key-material-ever-appears.md) | No model-provider key material ever appears in a Studio response, log or trace | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
