---
id: FEAT-008
title: Enterprise API
type: domain-feature
owner: DOM-PRJ
runtime: SRV-001
status: draft
delivery: live
legacy: [FR-019, FR-106]
relations:
  depends_on: [FEAT-007, FR-027-001, FR-008-002]
  decided_by: [ADR-055]
---

# FEAT-008 — Enterprise API

## Summary

A backend-first integration surface for external systems (ERP, CRM, delivery tools): they
push plans through the same PlanEnvelope pipeline, identify records by their own external
ids (Salesforce-style upsert by external id), resolve ids and codes back to Zuri records, and
read a generated OpenAPI document. Machine callers authenticate with a per-Tenant API key
and can never reach beyond that Tenant.

## Scope

**In:** ExternalRef mapping on imported entities; upsert-by-external-id semantics; resolve
endpoint; OpenAPI document; enforcement of per-Tenant API keys on these routes.
**Out:** minting, listing and revoking API keys, the `ApiAccessKey` model and its UI
(DOM-IAM, FR-008-002 key lifecycle); the ExternalRef table's ownership discipline
(DOM-IAM, BR-047).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-PRJ |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-008-001](requirements/FR-008-001-upsert-by-external-id.md) | Upsert by external id | — |
| [FR-008-002](requirements/FR-008-002-per-tenant-api-key-enforcement.md) | Per-Tenant API key enforcement | — |
| [FR-008-003](requirements/FR-008-003-resolve-external-ids-and-codes.md) | Resolve external ids and codes | — |
| [FR-008-004](requirements/FR-008-004-openapi-document.md) | OpenAPI document | — |
| [NFR-008-001](requirements/NFR-008-001-no-enumeration-through-the-api.md) | No enumeration through the API | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
