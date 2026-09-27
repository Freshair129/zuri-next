---
id: FEAT-072
title: Ingestion stage catalog, snapshot contract & sensitivity lattice
type: domain-feature
owner: DOM-KNW
runtime: SRV-004
status: draft
delivery: building
legacy: [FR-109, FR-110, FR-111]
relations:
  depends_on: [FEAT-070, FEAT-071, FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005, FR-053-001, FR-053-002, FR-053-003, FR-053-004]
  decided_by: [ADR-063, ADR-065, ADR-066, ADR-068]
---

# FEAT-072 — Ingestion stage catalog, snapshot contract & sensitivity lattice

## Summary

Registers the seventeen-stage knowledge ingestion pipeline as one governed
`DPL-KNOWLEDGE-INGEST-V1` definition on the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005 execution ledger, with a stable
per-stage evidence catalog, a derived job-state projection, and the four-level
sensitivity/processing-policy lattice every ingested object must carry before it is
indexed. Also the published-knowledge-snapshot contract — the identity, atomicity and
gate-result rules that let a retrieval answer name the exact corpus it read. This is
the largest and least-closed part of the domain: eight of FR-072-001, FR-072-002's thirteen product-wide
acceptance criteria are built, and the isolated GenesisRAG17 profile (ADR-068) proves a
stronger, narrower slice end to end in its own test corpus.

## Scope

**In:** the seventeen `DPS-KI-*` stage ids and their per-stage evidence obligations;
the end-to-end `pipeline_job_id` trace (`Source → RawArtifact → ParsedArtifact →
Chunks → Entities → Facts → Graph → Indexes → Published Snapshot`); the FR-072-001, FR-072-002 job
lifecycle and its clockless derivation (`knowledgeJobState`); the external-tier
reporter (Stages 9–17 report onto this ledger via the FR-027-001 data-plane key) and the
GKS evidence-pull importer; the published `knowledge_snapshot_id` identity, atomic
publication rule and Stage 17 gate-result vocabulary; the four-level sensitivity
lattice (`PUBLIC`/`INTERNAL`/`CONFIDENTIAL`/`RESTRICTED`) and its four per-object
processing-policy fields; the isolated GenesisRAG17 production executor
(`genesisrag17-executor.js`) that runs Stages 1–8 for real and receives/imports
Stages 9–17 evidence.

**Out:** the seven Tier 1 calculators themselves (`FEAT-070`) and their pure
composition (`FEAT-071`). Source admission and corpus manifest publication
(`FEAT-073`). Executing any of the nine stages this domain does not own —
resolution, fact extraction, ontology/temporal mapping, graph construction,
enrichment, embedding, indexing, and the physical half of the quality gate — all GKS
Tier 3 / GenesisBlockDB Tier 4 (`ADR-063` D2, D3). Building the indexes a
snapshot names.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-004 (the isolated GenesisRAG17 production executor; the reporter/evidence-pull routes and the pure catalog/job-state helpers run in SRV-001) |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-072-001](requirements/FR-072-001-seventeen-stage-knowledge-ingestion-stage-catalog-and.md) | Seventeen-stage knowledge ingestion stage catalog and job trace | — |
| [FR-072-002](requirements/FR-072-002-external-tier-stage-evidence-reaches-the-ledger.md) | External-tier stage evidence reaches the ledger by report and by pull | — |
| [FR-072-003](requirements/FR-072-003-knowledge-sensitivity-lattice-and-processing-policy.md) | Knowledge sensitivity lattice and processing policy | — |
| [FR-072-004](requirements/FR-072-004-published-knowledge-snapshot-contract.md) | Published knowledge snapshot contract | — |
| [NFR-072-001](requirements/NFR-072-001-nfr-020-per-stage-metrics.md) | NFR-019 per-stage metrics | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
