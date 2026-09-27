---
id: FEAT-075
title: SmartGift catalog convergence
type: domain-feature
owner: DOM-KNW
runtime: SRV-004
status: draft
delivery: building
legacy: [FR-187, FR-188, FR-189]
relations:
  depends_on: [FEAT-072, FEAT-073, ADR-072]
  decided_by: [ADR-069]
---

# FEAT-075 — SmartGift catalog convergence

## Summary

Converges the three independent writers of SmartGift's product-catalog data
(SmartGift's own 5-stage ETL direct write, `apps/edge` Genesis RAG v4's private
sibling-checkout read/serve, and the unactivated 17-stage pipeline) onto one entry
path: a structured-record source adapter before Stage 1, a typed parser profile and
`ontology_v2` contract for catalog facts, and edge reading the published generation
through MSP instead of its own private store. The one profile within this domain that
has actually reached production traffic.

## Scope

**In:** admitting a SmartGift catalog file as a structured record source before
Stage 1; per-record identity, versioning and Zero-PII deny keyed to SmartGift's own
SHA-256 registry; the `genesisrag17-parser-2` rendering profile, the pinned structured
recognizer, and the `ontology_v2` predicate vocabulary (`HAS_COMPONENT`, `PRICED_AT`,
`IN_CATEGORY`) for catalog entities; edge's `off`/`shadow`/`primary` query mode against
the published GenesisRAG17 generation, with Genesis RAG v4 kept only as a time-boxed
fallback.

**Out:** the generic admission queue and corpus manifest itself (`FEAT-073`, which
this feature enters through, never beside). The four-repository `ontology_v2` contract
negotiation outside this repository (MSP, GKS, GenesisBlock worker each accept
independently). SmartGift's pricing engine (`ADR-077`, a separate domain).
Sunsetting SmartGift's direct vault write or edge v4's file read (ADR-069 Phase 5,
conditional and not yet met).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-004 (Tier 1 adapter and executor); the edge query half runs in the edge desktop runtime, not a zuri-ai service — see §9 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-075-001](requirements/FR-075-001-smartgift-structured-record-source-adapter-before-stage.md) | SmartGift structured-record source adapter (before Stage 1) | — |
| [FR-075-002](requirements/FR-075-002-structured-parser-profile-typed-mentions-and-ontology.md) | Structured parser profile, typed mentions and ontology_v2 | — |
| [FR-075-003](requirements/FR-075-003-edge-reads-the-published-genesisrag17-generation-default.md) | Edge reads the published GenesisRAG17 generation (default off) | — |
| [NFR-075-001](requirements/NFR-075-001-no-second-genesisblockdb-writer.md) | No second GenesisBlockDB writer | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
