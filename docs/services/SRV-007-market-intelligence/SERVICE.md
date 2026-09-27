---
id: SRV-007
title: Market Intelligence service
kind: service
status: draft
delivery: implemented
legacy: [services/market-intelligence, ADR-108, FR-092, NFR-018, SDD-049, SEC-017]
relations:
  decided_by: [ADR-092, ADR-097]
---

# SRV-007 — Market Intelligence service

## Responsibility
Extracted single writer of Market-owned state: translates raw external evidence
(fetched through core) into provider-neutral `MarketObservation` rows and serves the
observation feed. Identity, raw evidence and audit remain core authorities reached
through a private façade. Not yet routed: SRV-001 executes Market requests until the
deployment executor flag selects the service.

## Domains hosted
DOM-MKI.

## Entrypoints
- `GET /healthz` (process up); `GET /readyz` (store answers, core answers and the
  execution-ownership answer has arrived; production is never ready against a
  non-remote core).
- `GET /v1/observations` (feed version 1.0); `POST /v1/translations` (64 KiB body cap,
  strict schema). Error bodies `{ error, issues? }`.
- Outbound core façade `/api/internal/market-intelligence/v1/*`: `authorize`,
  `raw-candidates`, `audit`, `execution-ownership`, `health`. The end user's credential
  is forwarded opaquely; the service holds no viewer logic and never logs the subject.

## Configuration (names only)
`MARKET_ENV`, `MARKET_PORT`, `MARKET_STORE` (`pg` in production; `sqlite` refused in
production), `MARKET_DATABASE_URL`, `MARKET_SQLITE_PATH` (local/test),
`MARKET_STORE_ENSURE_SCHEMA` (refused in production), `MARKET_API_TOKEN`,
`MARKET_CORE_URL`, `MARKET_CORE_TOKEN`, `MARKET_TEST_ASSUME_EXECUTION_OWNER` (refused
in production). Core side: `MARKET_EXECUTOR` (`legacy` | `service`),
`MARKET_SERVICE_URL`, `MARKET_SERVICE_TOKEN`.

## Dependencies
SRV-009 through a restricted role (`SELECT, INSERT` on `MarketObservation` only; no DDL
in production; role provisioned by the operator); SRV-001 core façade.

## Scaling and state
Stateless process; serialization only through the unique-lineage insert
(`insertIfAbsent`). Core unavailable ⇒ 503 `CORE_UNAVAILABLE` (reads and writes) and
not ready; audit is sent after commit and an audit outage returns 503 with
`phase`/`committed`. Translation writes are refused (409) unless core says the
service owns execution. A cross-scope lineage collision is a server fault.

## Deploy unit
Own image (`services/market-intelligence/Dockerfile`, copies only its package). A
rehearsal Compose project with loopback ports exists for image-start proof and must
never be layered onto the live project. Switching the executor flag is an operator
step after the restricted role exists.
