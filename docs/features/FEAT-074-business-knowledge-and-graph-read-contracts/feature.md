---
id: FEAT-074
title: Business knowledge & graph read contracts
type: domain-feature
owner: DOM-KNW
runtime: SRV-001
status: draft
delivery: building
legacy: [FR-024, FR-047, FR-131]
relations:
  depends_on: [FR-062-002, FR-064-003]
  decided_by: [ADR-064]
---

# FEAT-074 — Business knowledge & graph read contracts

## Summary

The curated, allow-listed read contract the agent domain consumes for grounded product
answers, and the Tier 1 half of a graph-shaped read over Zuri's own relations —
distinct from, and never a substitute for, canonical GKS knowledge. Also the one
declared (unbuilt) pattern for publishing a second kind of business fact — a shipping
rate card — through the exact same curated store rather than a new domain or model.

## Scope

**In:** the `BusinessKnowledgeReadPort` allow-listed public/curated product projection
and its DuckDB/Supabase/Postgres/in-memory adapters; the `assertNoLiveFacts` guard that
keeps live operational facts (price, credit, invoice, payment, stock, schedule) out of
any projection; the deterministic, tenant-scoped projection of Zuri relations
(Customer/Business/Conversation/Membership) into a pluggable graph sink and its
Prisma-backed read fallback; publishing a second `knowledge_type` of curated fact
(a logistics rate matrix) into the same store, entering through the existing document
intake and FR-056-001, FR-056-002 approval gate.

**Out:** any GKS/GenesisBlockDB client, embedding call or index mutation — retired
entirely (`ADR-064`, `ADR-064`). Building a new Prisma model for the rate
card (refused, see §9). The seventeen-stage ingestion pipeline itself (`FEAT-072`).
LINE grounding through a corpus reader (`FR-096-001`, out of this conversion's FR
set).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-KNW |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-074-001](requirements/FR-074-001-knowledge-graph-projection-of-zuri-relations-never.md) | Knowledge graph projection of Zuri relations, never live facts | — |
| [FR-074-002](requirements/FR-074-002-curated-business-knowledge-read-contract.md) | Curated business-knowledge read contract | — |
| [FR-074-003](requirements/FR-074-003-shipping-rate-card-as-governed-business-knowledge.md) | Shipping rate card as governed business knowledge (declared) | — |
| [NFR-074-001](requirements/NFR-074-001-no-cross-tenant-graph-read.md) | No cross-tenant graph read | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
