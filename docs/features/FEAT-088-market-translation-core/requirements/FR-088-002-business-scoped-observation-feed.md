---
id: FR-088-002
title: "Business-scoped observation feed"
delivery: implemented
legacy: [FR-092 (split 2/3 — `GET /api/market/observations`, added 2026-09-02), SEC-017]
relations:
  specified_by: [SDD-088]
  decided_by: [ADR-081]

---

# FR-088-002 — Business-scoped observation feed

The system SHALL let a viewer who can see a Business (not necessarily own it) read that
Business's translated `MarketObservation`s, newest-observed first, scoped to exactly
that Tenant and Business — Tenant-shared (`businessId: null`) observations are never
folded into a Business's feed, and a viewer without Market Intelligence domain
visibility or without Business visibility is refused with the same 404 shape used
elsewhere in this system so existence is never disclosed by status code alone.

## Acceptance criteria

- AC-088-002-01 — Given a viewer who sees the Business and the Market domain is visible to them, when they call the feed, then they receive that Business's observations (bounded by `limit`, default 50, max 200), newest `observedAt` first, with per-provider and per-resolution-status counts.
- AC-088-002-02 — Given a viewer who cannot see the Business, or for whom the `market` domain is not granted, when they call the feed, then the response is a 404 ("Business not found") indistinguishable from a nonexistent Business.
- AC-088-002-03 — Given a stored `candidateJson` that fails to parse or is not an object, when it is rendered, then that one row degrades to null candidate fields rather than failing the whole feed.

## Implementation

- `apps/server/src/app/api/market/observations/route.js`, `application/market-observation-service.js#getMarketObservationFeed`, `components/MarketDashboard.jsx`

## Verification

- TC-088-002 — Business-scoped feed and access refusal (see [verification.md](../verification.md))
