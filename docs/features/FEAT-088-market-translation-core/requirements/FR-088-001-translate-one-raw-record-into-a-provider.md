---
id: FR-088-001
title: "Translate one raw record into a provider-neutral observation"
delivery: implemented
legacy: [FR-092 (split 1/3 — core translation + persistence, PR #88 / issue #76), SEC-017]
relations:
  specified_by: [SDD-088]
  decided_by: [ADR-081]

---

# FR-088-001 — Translate one raw record into a provider-neutral observation

The system SHALL load one eligible `RawExternalRecord` only through a trusted,
tenant/business-scoped Integration read port, translate it via an injected
provider-neutral `extractCandidate` function into a `MarketObservation` draft, resolve
canonical Product identity via an injected Knowledge/GKS resolver (an absent or null
result yields `UNRESOLVED`, never an invented identity), derive a deterministic lineage
key from `rawRecordId + payloadHash + translationSchemaVersion + observationType`, and
persist the draft through an atomic create-if-absent boundary so concurrent replay of
the same raw evidence resolves to one logical observation (`CREATED` or `UNCHANGED`,
never a duplicate row).

## Acceptance criteria

- AC-088-001-01 — Given a valid `RawExternalRecord` with a payload, source lineage and no matching `lineageKey`, when it is translated, then a new `MarketObservation` is persisted with `resolutionStatus` reflecting whatever the injected resolver returned and `status: CREATED`.
- AC-088-001-02 — Given the identical raw record replayed (same id, payload hash, schema version, observation type), when translated again — including from two concurrent callers — then exactly one `MarketObservation` row exists and the result is `UNCHANGED` (or one `CREATED` and the rest `UNCHANGED`), never a unique-constraint failure surfaced to the caller.
- AC-088-001-03 — Given no `knowledgeResolver` is supplied, or it returns null, when translated, then the persisted observation has `resolutionStatus: UNRESOLVED`, `canonicalProductRef: null`, `canonicalCategoryRef: null` — never a fabricated match.
- AC-088-001-04 — Given a raw record missing a required field (`tenantId`, `connectionId`, `provider`, `entityType`, `externalId`, `payloadJson`, `payloadHash`), when translation is attempted, then it is refused before any write.

## Implementation

- `apps/server/src/modules/market-intelligence/application/translate-raw-record.js`, `application/market-observation-service.js`, `infrastructure/market-observation-repository.js`, `domain/market-observation.js`

## Verification

- TC-088-001 — Translation + persistence idempotency (see [verification.md](../verification.md))
