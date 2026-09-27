---
id: FEAT-048
title: LINE OA accounts
type: domain-feature
owner: DOM-LOA
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-018, FR-146]
relations:
  depends_on: [API-147, API-IAM-session-resolve]
  decided_by: [ADR-044]
---

# FEAT-048 — LINE OA accounts

## Summary

The Business-scoped account record for one LINE Official Account: identity,
scope, a stored status machine, a derived `LIVE` status, the (now single)
`CLOUD` transport mode, and the default-account flag. It is the aggregate root
every other LOA feature attaches to (rich menus, LIFF apps, conversation
jobs). Used from the web console (`/line-oa`) by Business staff.

## Scope

**In:** account identity and scope derivation; the stored status machine and
derived `LIVE`; transport-mode field (now single-valued); default-account
exclusivity; versioned account actions (`PAUSE`, `RESUME`, `ARCHIVE`,
`SET_DEFAULT`) and their authorization/refusal shape.
**Out:** webhook registration and legacy quiescence (FR-094-009,
FR-094-010, cross-domain `FEAT-094`); knowledge-grounding mode
(`FR-096-001`, `FEAT-095`); session-timeout and business-hours actions
(`FEAT-051`); server-execution/model-key readiness (`FEAT-050`); rich
menus and LIFF apps (`FEAT-049`).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-048-001](requirements/FR-048-001-account-identity-and-scope-derivation.md) | Account identity and scope derivation | — |
| [FR-048-002](requirements/FR-048-002-stored-status-machine-and-derived-live.md) | Stored status machine and derived LIVE | — |
| [FR-048-003](requirements/FR-048-003-transport-mode-admits-cloud-only.md) | Transport mode admits CLOUD only | — |
| [FR-048-004](requirements/FR-048-004-default-account-is-exclusive-per-business-and.md) | Default account is exclusive per Business, and every write is a compare-and-swap | — |
| [NFR-048-001](requirements/NFR-048-001-refusals-are-404-shaped.md) | Refusals are 404-shaped | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
