---
id: FR-065-002
title: "Controlled LINE canary readiness"
delivery: building
legacy: [FR-054]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-065-002 — Controlled LINE canary readiness

The system SHALL produce a `DRY_RUN`-mode canary preflight plan that checks,
one named assertion at a time, that the binding's id/project/tenant/business
match what was expected, that its provider/model is approved and has a
credential available, and that both the golden-evaluation report and the
runtime-role isolation report are present, unexpired (each with its own
`expiresAt`) and match their expected SHA-256 hashes — and SHALL never
itself activate a binding or call LINE.

## Acceptance criteria

- AC-065-002-01 — Given a binding whose `id` does not equal `expected.bindingId`, when `createCanaryPreflightPlan` runs, then the `binding-id` check fails with `BINDING_MISMATCH` and the overall plan is not `PASS`.
- AC-065-002-02 — Given a `goldenReport.totalAssertions` below 20 or an `isolationReport`/`goldenReport` `expiresAt` in the past relative to `options.now`, when the plan is built, then the corresponding check fails rather than being silently ignored.
- AC-065-002-03 — Given every check passes, when the plan completes, then no LINE call is made and no `zuri_core.line_channel_binding` row is written — this function is read-only by construction.

## Implementation

- `apps/server/src/modules/agent/canary-preflight.js`, `apps/server/src/modules/knowledge/runtime-isolation-probe.js`
