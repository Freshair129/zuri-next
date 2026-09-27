---
id: FEAT-071
title: Stage composition & quarantine
type: domain-feature
owner: DOM-KNW
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FR-118, FR-119]
relations:
  depends_on: [FEAT-070]
  decided_by: [ADR-063]
---

# FEAT-071 — Stage composition & quarantine

## Summary

Composes the seven Tier 1 calculators of `FEAT-070` (parsing through entity
extraction, in ADR-063 D2's fixed order) into one in-process call over one artifact,
and extends that composition to catch a per-stage failure and quarantine it with
BR-067's complete failure envelope instead of letting an unclassified error propagate.
Proves composition, not operation: nothing here opens a database or writes the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005
ledger.

## Scope

**In:** calling parse → provenance → normalize → dedupe → chunk → entity-extraction
in sequence over one real artifact; reconciling the field-name seams between stages
(`checksum` vs. `content_hash`, the narrowed `scope` shape); per-stage failure
attribution and BR-067 quarantine classification.

**Out:** classification/Stage 5 (`FEAT-072`, upstream of this composition — the
classified `scope` arrives already computed). Writing any composed result to the FR-060-001, FR-060-002, FR-060-003, FR-060-004, FR-060-005
ledger (integration domain's `knowledge-ingestion-executor.js`, `SDD-071`). Deciding what
a caller does with a `DUPLICATE_OF`/`REVISION_OF` classification (a caller's policy).
The production GenesisRAG17 executor's own per-stage persistence and quarantine wiring
(`FEAT-072`), which shares field mappings with this composition but is a separate,
ledger-writing implementation.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-071-001](requirements/FR-071-001-tier-1-stage-composition.md) | Tier 1 stage composition | — |
| [FR-071-002](requirements/FR-071-002-per-stage-failure-attribution-and-br-022.md) | Per-stage failure attribution and BR-067 quarantine | — |
| [NFR-071-001](requirements/NFR-071-001-no-partial-result-on-success.md) | No partial result on success | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
