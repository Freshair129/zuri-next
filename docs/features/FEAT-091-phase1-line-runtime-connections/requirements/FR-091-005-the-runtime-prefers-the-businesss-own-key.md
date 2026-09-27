---
id: FR-091-005
title: "The runtime prefers the Business's own key and fails closed"
part: FEAT-091-P03
owner: DOM-AGT
delivery: building
legacy: [FR-079 (split 3/3)]
relations:
  specified_by: [SDD-091]
  depends_on: [API-161, FEAT-054]
  decided_by: [ADR-047]
---

# FR-091-005 — The runtime prefers the Business's own key and fails closed

The system SHALL, per answer, first ask for the Business's own `MODEL_PROVIDER`
credential (FEAT-054) and use it when present — a broken Business credential SHALL
fail the answer, never fall through to the operator's key; only when the Business has
none SHALL it use the Phase-1 connection (FR-091-003/004); a local/test legacy model
configuration is reachable only outside `PRODUCTION_LINE` and only when no Phase-1
connection exists.

## Acceptance criteria

- AC-091-005-01 — Given a Business key whose store resolution fails, when a LINE message is answered, then the answer fails and the Phase-1 connection is not used.
- AC-091-005-02 — Given no Business key and one valid Phase-1 connection, when answered, then the Phase-1 provider/model/secret is used.

## Implementation

- apps/server/src/modules/agent/phase1-runtime.js

## Verification

- TC-091-003 — Runtime selection order (see [verification.md](../verification.md))
