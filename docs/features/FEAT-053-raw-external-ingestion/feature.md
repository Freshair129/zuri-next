---
id: FEAT-053
title: Raw external ingestion substrate
type: domain-feature
owner: DOM-INT
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-081]
relations:
  depends_on: []
  decided_by: [ADR-051]
---

# FEAT-053 — Raw external ingestion substrate

## Summary

Every acquisition channel (webhook, pull, file, manual) converges on one normalized
ingestion envelope and one raw-record writer. Raw records keep the source payload
verbatim as evidence; translation into business entities is always a separate, later
path owned by the consuming domain. LINE webhook events, marketplace listings and
retail prices already arrive this way; the knowledge pipeline and market intelligence
reuse it.

## Scope

**In:** the envelope schema, ingestion identity and idempotency, the scope-bound raw
record repository, run/cursor/dead-letter/external-ref records, raw-record PDPA
tombstoning, and adapters that call the writer.
**Out:** schedulers, translation ACLs and reader/replay surfaces (not built);
provider-specific pipelines (FEAT-059 FlowAccount, FEAT-093 LINE transport).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-INT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-053-001](requirements/FR-053-001-one-normalized-ingestion-envelope.md) | One normalized ingestion envelope | — |
| [FR-053-002](requirements/FR-053-002-ingestion-identity-makes-re-delivery-a-no.md) | Ingestion identity makes re-delivery a no-op | — |
| [FR-053-003](requirements/FR-053-003-raw-records-are-read-and-written-only.md) | Raw records are read and written only inside one scope | — |
| [FR-053-004](requirements/FR-053-004-raw-evidence-never-becomes-domain-truth-directly.md) | Raw evidence never becomes domain truth directly | — |
| [NFR-053-001](requirements/NFR-053-001-deterministic-identity.md) | Deterministic identity | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
