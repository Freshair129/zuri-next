---
id: FEAT-049
title: Rich menus and LIFF app registry
type: domain-feature
owner: DOM-LOA
runtime: SRV-001
status: draft
delivery: implemented
legacy: [FEAT-018, FR-151, FR-152, FR-153]
relations:
  depends_on: [API-149, FEAT-048]
  decided_by: [ADR-044, ADR-045]
---

# FEAT-049 — Rich menus and LIFF app registry

## Summary

The rich-menu designer and its server-owned publish job ledger, plus the
per-account LIFF app registry a rich menu's `LIFF` tap action resolves
through. Used by Business staff from the Design Studio (`/line-oa/rich-menus`)
and executed against LINE by the rich-menu worker tick.

## Scope

**In:** rich menu identity, numbered freeze-immutable versions, tap-action
vocabulary and image-reference validation; the publish/set-default/set-alias
job ledger, worker claim and acceptance semantics; LIFF app registration,
activation and rich-menu `LIFF`-action resolution.
**Out:** Flex message designer, flow designer, template library, dispatch
(declared in `ADR-044`/legacy charter, no implementing code — crosswalked
`dropped`); creating/updating a LIFF app on LINE Login itself (a console step
today, per code comments).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-049-001](requirements/FR-049-001-rich-menu-identity-and-numbered-draft-versions.md) | Rich menu identity and numbered draft versions | — |
| [FR-049-002](requirements/FR-049-002-freeze-makes-a-version-immutable-save-reports.md) | Freeze makes a version immutable; save reports every publish blocker | — |
| [FR-049-003](requirements/FR-049-003-publish-jobs-are-server-owned-leased-and.md) | Publish jobs are server-owned, leased and fenced | — |
| [FR-049-004](requirements/FR-049-004-acceptance-is-truthful-ambiguity-ends-unknown-never.md) | Acceptance is truthful; ambiguity ends UNKNOWN, never a silent retry | — |
| [FR-049-005](requirements/FR-049-005-liff-app-registry-lifecycle.md) | LIFF app registry lifecycle | — |
| [FR-049-006](requirements/FR-049-006-a-rich-menu-liff-tap-action-resolves.md) | A rich menu LIFF tap action resolves by code, never invents a URL | — |
| [NFR-049-001](requirements/NFR-049-001-no-line-credential-ever-reaches-this-domains.md) | No LINE credential ever reaches this domain's code | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
