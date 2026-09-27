---
id: FR-075-003
title: "Edge reads the published GenesisRAG17 generation (default off)"
delivery: building
legacy: [FR-189]
relations:
  specified_by: [SDD-075]
  decided_by: [ADR-069]
---

# FR-075-003 — Edge reads the published GenesisRAG17 generation (default off)

The system SHALL let the edge runtime answer SmartGift catalog queries through
`ZURI_EDGE_GENESISRAG17_MODE` (`off` | `shadow` | `primary`, default `off`), where
`off` is unchanged v4 behaviour, `shadow` asks the published generation the same
question through MSP for comparison only (never affecting the answer, recording only a
content-free comparison outcome), and `primary` answers from the published generation
with per-passage citations, falling back to v4 strictly before an operator-configured
fallback-until instant and recording every fallback. Any mode other than `off` SHALL
refuse to start the process if a named prerequisite (MSP transport, credential, scope,
fallback-until date for `primary`) is missing, naming the missing setting and never its
value. The edge process SHALL independently re-verify every response it receives —
scope, one generation per hit, all five citation ids present, no more than `topK`
results — even though MSP has already checked it.

## Acceptance criteria

- AC-075-003-01 — Given `ZURI_EDGE_GENESISRAG17_MODE=off` (the default), when the process starts, then no other GenesisRAG17 setting is read and v4 answers exactly as before.
- AC-075-003-02 — Given `mode=primary` with the fallback-until instant already passed, when the published generation is unavailable, then the evidence is recorded `unavailable` rather than silently falling back to v4.
- AC-075-003-03 — Given `mode=shadow`, when a comparison runs, then the recorded outcome contains only ids, counts, generation, latencies and a fixed error code — never the question, passage text, a product name, or an MSP error message.
- AC-075-003-04 — Given a response from MSP naming more than `topK` results or a hit missing one of its five citation ids, when edge validates it, then the response is refused rather than trusted because MSP already checked it.

## Implementation

- apps/edge/src/rag/genesisrag17/corpus-context.ts; apps/edge/src/rag/genesisrag17/msp-stdio.ts; apps/edge/src/rag/genesisrag17/product-rag.ts; apps/edge/src/rag/genesisrag17/published-rag.ts; apps/edge/src/rag/genesisrag17/record-store.ts; apps/edge/src/rag/genesisrag17/settings.ts; apps/edge/src/conversation/executor.ts

## Verification

- TC-075-003 — Edge published-generation query modes (see [verification.md](../verification.md))
