---
id: FEAT-064
title: LINE delivery and scope binding
type: domain-feature
owner: DOM-AGT
runtime: SRV-001
status: proposed
delivery: building
legacy: [FR-050, FR-051, FR-052, FR-147]
relations:
  depends_on: [SEC-009]
  decided_by: [ADR-060]
---

# FEAT-064 — LINE delivery and scope binding

## Summary

Where a LINE turn's Tenant/Business scope comes from and how tightly the
knowledge it reads is isolated: a server-owned, hash-verified binding
(never a client-selected id) resolves scope; the production knowledge store
enforces tenant-leading Postgres RLS; and a read-only status view lets a
sibling domain (LINE OA Studio) answer "is this binding currently ACTIVE"
without ever seeing a credential. The single-reply delivery discipline that
originally sat in front of all of this was removed with the Edge Device
surfaces and is not currently implemented (§9).

## Scope

**In:** the historical single-reply-per-event delivery contract
(FR-064-001); the production Supabase/`zuri_core` tenant-isolation shape
for SmartGift business knowledge (FR-064-002); the server-owned binding
resolver and its unprivileged-role read discipline (FR-064-003); the
four-label binding-status reader (FR-064-004).
**Out:** the LINE OA Studio `LineOaAccount` aggregate and its own native
webhook (DOM-LOA); the Conversation Runtime's job admission and cohort
snapshot (DOM-LOA, ADR-049).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AGT |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-064-001](requirements/FR-064-001-single-reply-line-delivery-not-currently-implemented.md) | Single-reply LINE delivery (not currently implemented) | — |
| [FR-064-002](requirements/FR-064-002-production-supabase-tenant-isolation.md) | Production Supabase tenant isolation | — |
| [FR-064-003](requirements/FR-064-003-server-owned-line-scope-binding.md) | Server-owned LINE scope binding | — |
| [FR-064-004](requirements/FR-064-004-line-binding-status-read-contract.md) | LINE binding status read contract | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
