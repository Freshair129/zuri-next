---
id: DOM-MKI
title: Market Intelligence
status: proposed
version: 0.1.0
owner: governance
relations:
  decided_by: [ADR-081, ADR-082]
---

# DOM-MKI — Market Intelligence

## Purpose
Owns Zuri's **translated external market state and derived market intelligence**: what
external markets appear to be doing, with source lineage and confidence sufficient for
another domain or a human to act on. It is the layer between raw external evidence
(owned by Integration) and business action (Procurement, Commerce, Marketing) — it
never acquires evidence itself and never executes a purchase, sale or campaign.

## Ubiquitous language
- **MarketObservation** — one translated, provider-neutral fact derived from a single
  Integration-owned `RawExternalRecord`; the only model this domain currently persists.
- **Lineage key** — a deterministic sha256 identity (`rawRecordId + payloadHash +
  translationSchemaVersion + observationType`) that makes replay of the same raw
  evidence resolve to the same logical observation instead of a duplicate.
- **Resolution status** — `UNRESOLVED` is a valid, truthful terminal state, not an
  error; canonical Product/Category identity is never invented to look complete.
- **Translation run** — an explicit, owner-triggered batch that translates a Business's
  already-ingested backlog; not a scheduler and not an acquisition path.
- **Execution ownership** — which process (in-process module vs. the extracted
  `services/market-intelligence` process) is currently authorized to write
  `MarketObservation` rows (ADR-082).

## Owned data
- `MarketObservation` — translated market fact: tenant/business scope, source lineage
  (raw record, connection, provider, external id, payload hash), translation schema
  version, observation type, JSON candidate payload, resolution status/confidence,
  canonical product/category refs, observed/translated timestamps, unique `lineageKey`.

No other model is currently persisted; `ExternalOffer`, `PriceObservation`,
`SupplierCandidate`, `WatchRule`, `MarketResearchRun` etc. are chartered candidate
concepts (see Legacy sources) that land only with their own approved requirement.

## Business rules
No domain-specific rule beyond the legacy PRD set was found that is not already a
legacy row. The governing invariants are the existing `BR-064` (translation
core) and `SEC-016` (provenance scope fails closed) — both referenced, not
re-declared, per this pass's instructions.

## Public contracts
- `API-243`
- `API-244`

## Capabilities
Not used — one feature, no epic grouping warranted yet.

## Depends on
- `FR-053-001, FR-053-002, FR-053-003, FR-053-004` (Integration's raw external ingestion / `RawExternalRecord`,
  `IntegrationConnection`, scoped read port) — Market Intelligence never creates a
  second ingestion/secret/cursor/dead-letter stack; it reads eligible raw records only
  through Integration's trusted scoped repository.
- `legacy:` Knowledge/GKS canonical resolution contract (governed Product identity) —
  injected as `knowledgeResolver`; an absent or null result is a truthful `UNRESOLVED`,
  never a fabricated canonical identity.

## Legacy sources
- Charter: `docs/domains/market-intelligence/CHARTER.md`, `CONTEXT-MAP.md`, `SRS.md`
- `docs/FEATURES.md` (no legacy FEAT bundle covers FR-088-001, FR-088-002, FR-088-003)
- `docs/PRD-SDD-v1.0.md` rows FR-088-001, FR-088-002, FR-088-003, SEC-016
- ADRs: ADR-081, ADR-082

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (1)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-088](../../features/FEAT-088-market-translation-core/feature.md) | Market translation core | implemented | 4 |

### Participating in cross-domain features (0)

_None._

### Hosted by services (2)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)
- [SRV-007](../../services/SRV-007-market-intelligence/SERVICE.md)

<!-- END GENERATED -->
