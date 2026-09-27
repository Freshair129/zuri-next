---
id: NFR-096-001
title: "Bounded, configurable retrieval budget for the GKS corpus hop"
delivery: implemented
legacy: [FR-235 (budget clause), SDD-099]
relations:
  specified_by: [SDD-096]
---

# NFR-096-001 — Bounded, configurable retrieval budget for the GKS corpus hop

The corpus hop (P01) SHALL complete within a configurable wall-clock budget — default 2500 ms
(`ZURI_LINE_KNOWLEDGE_BUDGET_MS`) — return at most a configurable top-K of ranked results — default
5 (`ZURI_LINE_KNOWLEDGE_TOP_K`) — and cap its returned evidence packet at a configurable byte size —
default 8192 bytes (`ZURI_LINE_KNOWLEDGE_MAX_PACKET_BYTES`), dropping lowest-ranked hits first when
a hit would exceed the cap. Exceeding the time budget SHALL resolve to `GKS_UNAVAILABLE`, never a
slower answer. All three are configuration, never hard-coded constants.

Measured by: `apps/server/tests/unit/line-knowledge-grounding.test.js`,
`apps/server/tests/unit/corpus-knowledge-reader.test.js` (budget/timeout, top-K truncation and
packet-size truncation behaviour).
