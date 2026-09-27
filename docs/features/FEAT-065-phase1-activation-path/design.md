---
id: SDD-065
title: "Phase 1 activation path — golden evaluation, canary readiness, activation receipt — design"
---

# SDD-065 — Phase 1 activation path — golden evaluation, canary readiness, activation receipt design

- **Components:**
  - `CMP-149` — `activation-readiness-contract.js`
    (shared Zod schemas: golden corpus, canary plan, receipt states).
  - `CMP-159` — `golden-evaluation.js`.
  - `CMP-154` — `canary-preflight.js`.
  - `CMP-168` — `line-operator.js`, `line-binding-activation.js`,
    `line-activation-contract.js`, `zuri-cli-canary-receipt.js`.
- **Data owned:** none — writes exactly one row of `zuri_core.line_channel_binding`
  (compare-and-swap) and `zuri_core.line_activation_event` per attempt; both
  tables belong to the production Postgres runtime this domain reads/writes
  under scoped roles, not to a Prisma model this domain owns.
- **Contracts exposed:** `API-167`,
  `API-172`, `API-169` (all
  CLI/operator-invoked, see contracts.md).
- **Contracts consumed:** the knowledge domain's `runtime-isolation-probe.js`
  (secret-redacted role-isolation report consumed as `isolationReport`).
- **Main sequence:** 1. Operator runs the golden evaluator against the
  approved corpus (FR-065-001) → redacted report + SHA-256. 2. Operator
  runs the isolation probe (knowledge domain) → redacted report + SHA-256.
  3. `createCanaryPreflightPlan` checks both reports plus binding/provider
  identity match (FR-065-002) → `PASS`/`FAIL` per check. 4. Only on a
  fully-passing plan, an operator runs the activation command, which
  re-verifies evidence hashes and performs the CAS `UPDATE` plus receipt
  (FR-065-003).
- **Failure modes:** any single check failing anywhere in the chain halts
  before the next step; a stale `version` fails the CAS with zero rows
  affected; a tampered evidence file fails hash re-verification before any
  write.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-065-001 | `apps/server/src/modules/agent/golden-evaluation.js`, `apps/server/src/modules/agent/activation-readiness-contract.js` |
| FR-065-002 | `apps/server/src/modules/agent/canary-preflight.js`, `apps/server/src/modules/knowledge/runtime-isolation-probe.js` |
| FR-065-003 | `apps/server/src/modules/agent/line-activation-contract.js`, `apps/server/src/modules/agent/line-binding-activation.js`, `apps/server/src/modules/agent/line-operator.js`, `apps/server/src/modules/agent/zuri-cli-canary-receipt.js` |
