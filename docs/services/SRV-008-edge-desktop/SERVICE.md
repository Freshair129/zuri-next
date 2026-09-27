---
id: SRV-008
title: Edge desktop runtime (customer-premise app)
kind: desktop
status: draft
delivery: implemented
legacy: [apps/edge (Tauri desktop + CLI "zuri-agent"), ADR-041, ADR-059, ADR-061, ADR-110]
relations:
  decided_by: [ADR-095, ADR-092]
---

# SRV-008 — Edge desktop runtime

## Responsibility
An optional, independently released application for a customer-premise machine. After
ADR-095 it is **not** a connection surface of the product: it does not pair with
the cloud, send heartbeats, claim extraction jobs, hold LINE credentials, receive LINE
webhooks or answer LINE events. What remains is a local runtime that a Business may run
on its own hardware:

- a local knowledge/RAG runtime (catalogue ingestion, local retrieval, evaluation
  tools) and a local model worker;
- local operator tooling (CLI, MCP tools, diagnostics).

A self-hosted model is connected to the product only through the write-only
model-provider key flow (e.g. a Private Runtime Platform client key); a device
identity or old device key is not a substitute.

## Domains hosted
None of the product's domains; it consumes published wire contracts only and never
imports server source or reads server tables.

## Entrypoints
Desktop application and `zuri-agent` CLI; local RAG serve and optional local pricing
service on the machine's loopback. No cloud-facing endpoint.

## Configuration (names only)
Local settings managed by the desktop app (no dotenv in the managed desktop); CLI uses
its own working-directory configuration. No product secret is configured here.

## Dependencies
Local disk and, optionally, a local model runtime. No dependency from any product
service on this app.

## Scaling and state
Single machine; local data partitions. Retired device records in the product database
(device credentials, extraction jobs, harness devices) are preserved as history and
never written again.

## Deploy unit
Independently versioned desktop/CLI build from `apps/edge` (own lockfile and
toolchain); never deployed with SRV-001.
