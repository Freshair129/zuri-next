---
id: SDD-088
title: "Market translation core — design"
---

# SDD-088 — Market translation core design

- **Components:**
  - `CMP-278` — `application/translate-raw-record.js`: pure translation +
    lineage-key derivation, no I/O.
  - `CMP-276` — `application/market-observation-service.js`:
    application seam (persist, feed read, translation-run orchestration, authorization).
  - `CMP-275` — `infrastructure/market-observation-repository.js`:
    atomic `insertIfAbsent`/`listRecent`/`findTranslatedRawRecordIds` over
    `MarketObservation`.
  - `CMP-277` — `infrastructure/market-raw-record-repository.js`:
    trusted, scoped read port over Integration's `RawExternalRecord` (read-only).
  - `CMP-274` — `infrastructure/gks-market-identity-resolver.js`: injected
    canonical Product resolution port.
  - `CMP-273` — `application/generic-candidate-extractor.js`:
    default provider-neutral extractor used by the production trigger route.
- **Data owned:** `MarketObservation` (see DOMAIN.md Owned data).
- **Contracts exposed:** `API-243`, `API-244`.
- **Contracts consumed:** `FR-053-001, FR-053-002, FR-053-003, FR-053-004` scoped raw-record read port; Knowledge/GKS
  resolver port (both injected, not imported).
- **Main sequence** (translation run):
  1. `POST /api/market/translations` resolves the viewer and validates input.
  2. `runMarketTranslationForBusiness` loads the Business, checks `market` domain
     visibility then `ownsBusiness` (both 404-shaped on refusal).
  3. Untranslated candidates are listed from the raw-record repository (bounded scan).
  4. Each eligible candidate is translated and persisted via the atomic
     `insertIfAbsent` boundary; failures are collected per-record, not fatal to the run.
  5. One audit event is recorded with counts only.
- **Failure modes:** missing/invalid raw record fields refused before write; concurrent
  replay resolved to one row by the repository's atomic constraint, never a thrown
  unique-violation; viewer without domain/Business visibility refused 404 (existence
  never disclosed); a per-record translation failure is captured in `failed[]` without
  aborting the run; `CORE_UNAVAILABLE`/execution-ownership failures are only relevant
  once `MARKET_EXECUTOR=service` is set (ADR-082 D6/D7) — not yet active in
  production.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-088-001 | `apps/server/src/modules/market-intelligence/application/translate-raw-record.js`, `application/market-observation-service.js`, `infrastructure/market-observation-repository.js`, `domain/market-observation.js` |
| FR-088-002 | `apps/server/src/app/api/market/observations/route.js`, `application/market-observation-service.js#getMarketObservationFeed`, `components/MarketDashboard.jsx` |
| FR-088-003 | `apps/server/src/app/api/market/translations/route.js`, `application/market-observation-service.js#runMarketTranslationForBusiness`, `application/generic-candidate-extractor.js`, `infrastructure/market-raw-record-repository.js` |
