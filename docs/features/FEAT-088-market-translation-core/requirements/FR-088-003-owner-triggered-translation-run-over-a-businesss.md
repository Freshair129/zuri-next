---
id: FR-088-003
title: "Owner-triggered translation run over a Business's backlog"
delivery: implemented
legacy: [FR-092 (split 3/3 — `POST /api/market/translations`, added 2026-09-03), SEC-017]
relations:
  specified_by: [SDD-088]
  decided_by: [ADR-081]

---

# FR-088-003 — Owner-triggered translation run over a Business's backlog

The system SHALL let a Business owner explicitly run translation over that Business's
already-ingested, untranslated `MARKET_INTELLIGENCE` raw backlog (bounded scan and
result `limit`, default 20, max 100), record one audit event per run (counts only,
never raw candidate payloads), and refuse an existing-but-unowned Business with the
same 404 an nonexistent Business gets. This is a trigger over existing evidence, never
a scheduler and never a second acquisition path.

## Acceptance criteria

- AC-088-003-01 — Given a Business owner and untranslated eligible raw records in the `MARKET_INTELLIGENCE` lane, when a run is requested, then up to `limit` new observations are created, already-translated raw records are skipped, and exactly one `MARKET_TRANSLATION_RUN` audit event is recorded with counts of candidates, eligible, translated, unchanged and failed.
- AC-088-003-02 — Given a viewer who sees but does not own the Business, when they request a run, then it is refused 404, identical to a nonexistent Business.
- AC-088-003-03 — Given one raw record in the eligible batch fails translation (e.g. invalid payload), when the run executes, then that record is recorded in `failed` with a reason and the run still completes for the remaining eligible records.

## Implementation

- `apps/server/src/app/api/market/translations/route.js`, `application/market-observation-service.js#runMarketTranslationForBusiness`, `application/generic-candidate-extractor.js`, `infrastructure/market-raw-record-repository.js`

## Verification

- TC-088-003 — Owner-triggered translation run and audit (see [verification.md](../verification.md))
