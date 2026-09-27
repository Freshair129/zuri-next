---
id: FEAT-097
title: Server-owned self-hosted inference pool
type: cross-domain-feature
owner: DOM-AGT
runtime: SRV-001
participants:
  - domain: DOM-INT
    part: FEAT-097-P01
    role: Inference node/pool registration, credential resolution and qualification
  - domain: DOM-AGT
    part: FEAT-097-P02
    role: Server-owned self-hosted model execution
  - domain: DOM-AGT
    part: FEAT-097-P03
    role: Inference capacity routing and health
  - domain: DOM-PLT
    part: FEAT-097-P04
    role: Inference pool operations projection (operator-only, removable)
  - domain: DOM-LOA
    part: FEAT-097-P05
    role: Self-hosted inference policy and cutover
status: proposed
delivery: declared
legacy: [FEAT-043, FR-255, FR-256, FR-257, FR-258, FR-259]
relations:
  depends_on: []
  decided_by: [ADR-062]
---

# FEAT-097 — Server-owned self-hosted inference pool

## Summary

LINE answers can be executed by an authorized, qualified pool of self-hosted
(non-hosted-cloud) inference nodes instead of requiring an Edge executor or a
hosted model provider. The feature covers Business-scoped node/pool
registration and trust, capacity-aware routing over current health
observations with atomic per-engine leasing, Server-owned execution that
preserves existing deterministic/tool/knowledge/memory/receipt/delivery
boundaries, an installation-operator-only removable operations projection,
and an explicit, reversible, account-level policy and cutover procedure. The
whole feature is design-only at this point: every part is `delivery:
declared`, with no code and no tests in the legacy repository (legacy
`testCount: 0` on all five FRs).

## Scope

**In:**
- Business-scoped registration, write-only credential references, and
  explicit qualification/lifecycle management of self-hosted inference nodes
  and pools (reusing `IntegrationConnection`/credential abstractions).
- A new `SELF_HOSTED_ONLY` model-access policy value for `SERVER` execution
  placement, selected explicitly per account.
- Capacity-aware admission: current qualified-node health/observations plus
  an atomic, database-serialized per-engine capacity lease, preferred-first
  spillover between nodes, and deadline-aware routing.
- Server-side execution of a model-needed LINE turn against the qualified
  pool, preserving the existing tool loop, knowledge/MSP context boundaries,
  invocation receipts, and delivery/CRM reconciliation.
- An installation-operator-only, removable operations projection of pool
  readiness/capacity/observation age/bounded failures, with delegated
  drain/resume actions.
- An explicit, per-account, reversible cutover procedure with an immutable
  per-job policy/profile snapshot and rollback path.

**Out:**
- `EDGE` execution placement combined with `SELF_HOSTED_ONLY` — explicitly
  refused in v1 (FR-097-005 configuration matrix); no unsupported enum is sent to
  older Edge devices.
- VRAM aggregation, tensor parallelism, KV-state migration between nodes, or
  any single distributed model — this is request distribution across
  independent full replicas only (ADR-062 D1).
- A public developer API, external API-key billing, a new LINE gateway, or a
  second durable message queue.
- Vision/document extraction, headless coding-agent tools, local
  filesystem/LAN-only capabilities — these remain Edge-only and are not
  implicitly migrated (ADR-062 D8).
- Automatic GPU power management (sleep/wake), host reboot, or any automatic
  process-kill/GPU-clock action triggered by monitoring (ADR-062 D7, D11).
- Persisted time-series metric history — phase one keeps only the latest
  bounded observation plus redacted state transitions; Prometheus/Grafana
  history is optional and deferred (FR-097-004).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

DOM-AGT is the feature owner because ADR-062 (the decision that governs
this entire feature) is itself an Agent-domain decision, and the two FRs with
the largest legacy vote weight and the most structurally central behavior —
execution (FR-097-002) and capacity routing (FR-097-003) — are both Agent-primary.
Integration, Platform Control and LINE OA Studio each own one part outright
(registration/trust, operations projection, and account policy/cutover,
respectively) but none of them is accountable for the feature as a whole.

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-097-P01 | Inference node registration & trust | DOM-INT | SRV-001 | FR-097-001 |
| FEAT-097-P02 | Server-owned self-hosted model execution | DOM-AGT | SRV-001 | FR-097-002 |
| FEAT-097-P03 | Inference capacity routing & health | DOM-AGT | SRV-001 | FR-097-003 |
| FEAT-097-P04 | Inference pool operations projection | DOM-PLT | SRV-001 | FR-097-004 |
| FEAT-097-P05 | Self-hosted inference policy & cutover | DOM-LOA | SRV-001 | FR-097-005 |

All five parts run inside the existing `SRV-001` deployable. ADR-062 D1
explicitly rules out a new gateway/queue/orchestrator process for this
decision ("No Ray, Kubernetes, Redis/BullMQ, LiteLLM or new LINE gateway is
required"); the self-hosted vLLM engines themselves are external,
operator-owned hardware outside the zuri-ai deploy footprint and are not a
`services.yaml` deployable of this system (see Open issues).

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-097-001](requirements/FR-097-001-business-scoped-node-pool-registration-trust-and.md) | Business-scoped node/pool registration, trust and qualification | FEAT-097-P01 |
| [FR-097-002](requirements/FR-097-002-server-owned-self-hosted-model-execution.md) | Server-owned self-hosted model execution | FEAT-097-P02 |
| [FR-097-003](requirements/FR-097-003-inference-capacity-routing-and-health.md) | Inference capacity routing and health | FEAT-097-P03 |
| [FR-097-004](requirements/FR-097-004-inference-pool-operations-projection.md) | Inference pool operations projection | FEAT-097-P04 |
| [FR-097-005](requirements/FR-097-005-self-hosted-inference-policy-and-cutover.md) | Self-hosted inference policy and cutover | FEAT-097-P05 |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
