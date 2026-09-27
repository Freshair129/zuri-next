---
id: FEAT-070
title: Tier 1 structural stage calculators
type: domain-feature
owner: DOM-KNW
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-112, FR-113, FR-114, FR-115, FR-116, FR-117]
relations:
  depends_on: [FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005, FR-053-001, FR-053-002, FR-053-003, FR-053-004]
  decided_by: [ADR-063]
---

# FEAT-070 — Tier 1 structural stage calculators

## Summary

The six pure, side-effect-free calculators that implement Stages 2, 3, 4, 6, 7 and 8 of
the seventeen-stage knowledge ingestion pipeline — parsing, provenance validation,
normalization, deduplication, chunking and entity-candidate extraction. Each is a
library function with no I/O, no database, no clock and no randomness, composed
in-process by `FEAT-071`. No console surface reaches them directly; they execute
wherever `apps/server`'s knowledge-ingestion code runs (the request path in `SRV-001`
for the pure calculators themselves, and inside `SRV-004` for the production
GenesisRAG17 executor that calls the equivalent renderer for structured sources).

## Scope

**In:** turning a document's text into a structured, source-linked artifact; validating
and walking source provenance; producing canonical forms alongside raw values;
splitting a document into retrieval-sized chunks with parent-child lineage; extracting
untyped entity mentions from chunks and structured records; classifying an incoming
artifact against held ones as duplicate, revision or independent.

**Out:** entity resolution, fact/relation extraction, ontology/temporal mapping, graph
construction, embedding, indexing and the quality gate — all GKS Tier 3 / GenesisBlockDB
Tier 4 authority, never executed here (`FR-072-003`). Calling these six in sequence
over one artifact (`FEAT-071`). Writing any result to the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 execution ledger
(the integration domain's `knowledge-ingestion-executor.js`). The sensitivity
classification these calculators carry but never compute (`FR-072-003`, Stage 5).
The production GenesisRAG17 chunker/parser actually used for text sources today
(`genesisrag17-source.js`) and for SmartGift catalog sources
(`genesisrag17-structured-record.js`, `FEAT-075`) — a second, independently tested
implementation of "parse and chunk a document" not composed with these six (see §9).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-001 (also executed in-process within SRV-004) |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-070-001](requirements/FR-070-001-document-parsing-into-a-structured-artifact-that.md) | Document parsing into a structured artifact that keeps its link to the raw source | — |
| [FR-070-002](requirements/FR-070-002-derived-object-provenance-and-the-lineage-chain.md) | Derived-object provenance and the lineage chain back to a source | — |
| [FR-070-003](requirements/FR-070-003-canonical-normalization-that-never-destroys-the-raw.md) | Canonical normalization that never destroys the raw value | — |
| [FR-070-004](requirements/FR-070-004-deduplication-and-version-relationships-within-one-tenant.md) | Deduplication and version relationships within one tenant | — |
| [FR-070-005](requirements/FR-070-005-structural-knowledge-chunking-with-parent-child-lineage.md) | Structural knowledge chunking with parent-child lineage | — |
| [FR-070-006](requirements/FR-070-006-entity-candidate-extraction-from-chunks-and-structured.md) | Entity candidate extraction from chunks and structured records | — |
| [NFR-070-001](requirements/NFR-070-001-determinism-across-all-six-calculators.md) | Determinism across all six calculators | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
