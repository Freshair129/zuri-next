---
id: SDD-097
title: "Server-owned self-hosted inference pool — design"
---

# SDD-097 — Server-owned self-hosted inference pool design

- **Components:**
  - `CMP-128` (DOM-INT) — Business-scoped node/pool
    registration, credential resolution, qualification protocol and
    administrative lifecycle (FEAT-097-P01).
  - `CMP-162` (DOM-AGT) — capacity-aware admission
    algorithm and the per-engine capacity-lease ledger; consumes node
    observations to select/spill between nodes (FEAT-097-P03).
  - `CMP-177` (DOM-AGT) — per-invocation execution
    orchestration: context composition, prompt/tool budgeting, tool-loop
    validation and result commit (FEAT-097-P02).
  - `CMP-064` (DOM-PLT) — removable,
    operator-only dashboard reading redacted Integration/Agent contracts,
    with delegated drain/resume (FEAT-097-P04).
  - `CMP-104` (DOM-LOA) — account-level policy
    selection, immutable per-job snapshot, and the cutover/rollback
    procedure (FEAT-097-P05).

- **Data owned** (none of this exists as a Prisma model yet — named from
  ADR-062's proposed data ownership, not from any migration):
  - DOM-INT: `InferencePool`, `InferencePoolMember`, `InferenceNodeObservation`
    (a new self-hosted provider profile on the existing `IntegrationConnection`;
    no new credential table).
  - DOM-AGT: `InferenceCapacityLease` (one Agent-owned table, single writer).
  - DOM-LOA: additive fields on the existing `LineConversationJob` — execution
    placement, processing permission, `inferencePoolId`, pool/configuration
    version, profile hash — via an additive migration that preserves old-job
    default behavior.
  - DOM-PLT: no new persisted data; read-only projection over the above.

- **Contracts exposed:**
  - `API-INT-inference-pools` — management CRUD/qualify/lifecycle, under the
    existing `src/app/api/platform/integrations/**` ownership (candidate
    subpaths `inference-pools`, `inference-nodes`,
    `inference-nodes/[id]/qualify`).
  - `API-PLT-inference-ops` — a bounded, operator-only read endpoint behind
    `/control/inference`.

- **Contracts consumed:**
  - Agent consumes `API-INT-inference-pools` (qualified node/profile data)
    and existing MSP/GKS read ports (unchanged).
  - LINE OA Studio consumes Agent's execution result through the existing
    Server answer seam and dispatches through Integration's existing LINE
    transport (unchanged).
  - Platform Control consumes Integration's redacted node/observation
    contract and Agent's capacity/attempt summaries; it exposes no write
    authority of its own.

- **Main sequence:**
  1. An authorized manager registers and qualifies self-hosted nodes into a
     Business-scoped pool (P01).
  2. An authorized owner selects `SELF_HOSTED_ONLY` for the account and the
     system records an immutable per-job policy/profile snapshot on
     admission (P05).
  3. The router resolves current node observations, serializes a per-engine
     capacity lease, and picks the first eligible node, spilling to the next
     under load/deadline constraints (P03).
  4. The executor dispatches a bounded Chat Completions request to the
     leased node, validates and executes any returned tool calls, and
     commits a bounded result (P02).
  5. The existing Server delivery seam sends the committed answer through
     Integration's LINE transport and CRM reconciles the accepted outbound
     message (P05, unchanged path).
  6. Throughout, the operator-only projection reads redacted node/capacity
     state as a side channel with no effect on the above (P04).

- **Failure modes:**
  - An unqualified, ineligible or profile/credential-mismatched node is
    excluded from admission even with free VRAM (NODES-*, ROUTE-04).
  - Capacity or deadline exhaustion on both nodes defers or fails the job
    within its existing deadline; there is no hidden hosted-provider
    fallback (ROUTE-*, explicit non-goal per ADR-062 D6/D9).
  - An ambiguous post-dispatch result (timeout, disconnect) is recorded as
    uncertain and its capacity quarantined rather than retried or replayed
    (ADR-062 D9).
  - A registration attempt targeting cloud metadata, loopback, or a
    redirect/rebinding destination is refused at connection time before any
    credential is transmitted (ADR-062 D10, SEC grounding).
  - Removing the operations projection, Prometheus or Grafana does not
    disable inference correctness or delete business/pool state
    (ADR-062 D11).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-097-001 | Not implemented — approved design only (legacy `FR-097-001`, `code: []`, `tests: []`) |
| FR-097-002 | Not implemented — approved design only (legacy `FR-097-002`, `code: []`, `tests: []`) |
| FR-097-003 | Not implemented — approved design only (legacy `FR-097-003`, `code: []`, `tests: []`) |
| FR-097-004 | Not implemented — approved design only (legacy `FR-097-004`, `code: []`, `tests: []`) |
| FR-097-005 | Not implemented — approved design only (legacy `FR-097-005`, `code: []`, `tests: []`) |
