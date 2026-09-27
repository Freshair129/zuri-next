---
id: SRV-004
title: Knowledge ingestion worker (GenesisRAG17 Tier 4)
kind: worker
status: draft
delivery: implemented
legacy: [compose service genesis-worker, ADR-073, ADR-075 Phase 3]
relations:
  decided_by: [ADR-090, ADR-089]
---

# SRV-004 — Knowledge ingestion worker

## Responsibility
Runs the Tier-4 side of the 17-stage knowledge pipeline for this installation: claims
batches through MSP, performs physical graph writes (stage 13), embeddings and
indexing (stages 15–16), builds candidate snapshots and atomically publishes corpus
generations after the GKS gate, and answers scoped queries on its loopback port. It
is the only process that holds the GenesisBlock native store and the embedding model.

## Domains hosted
DOM-KNW (Tier 2–4 execution packaged as a sidecar; the logic belongs to the external
MSP, GKS and GenesisBlock systems at pinned revisions).

## Entrypoints
- Loopback listener inside SRV-001's network namespace on `GENESIS_WORKER_PORT`;
  unreachable from the host, other containers or the tunnel.
- MSP invoked as a child process (`GENESIS_WORKER_MSP_COMMAND`, `…_ARGS`, `…_CWD`).
- Health check: TCP connect only (liveness); relay correctness is proven by a
  separate smoke check, not the health check.

## Configuration (names only)
Only the knowledge env file is loaded (so web's database, LINE and model credentials
never reach it): `GENESIS_WORKER_PORT`, `ZURI_KNOWLEDGE_ENABLED`,
`ZURI_KNOWLEDGE_BINDINGS`, `MSP_PIPELINE_PRINCIPALS`, `MSP_GKS_TRANSPORT`,
`MSP_GKS_HTTP_URL`, `GKS_MSP_RELAY_CREDENTIAL_FILE`, `MSP_GKS_PIPELINE_CREDENTIAL_FILE`,
`GENESIS_WORKER_MSP_*`, knowledge storage names (`ZURI_KNOWLEDGE_STORAGE_*`).

## Dependencies
SRV-001 (network namespace and MSP relay), SRV-005 (when the HTTP transport overlay is
selected), SRV-006 (artefacts), pinned MSP/GKS/GenesisBlock sources
verified at image build.

## Scaling and state
Single instance by design ("one process holds the native store"). Named volumes:
shared MSP/GKS SQLite state, the GenesisBlock native store (candidate and published
snapshots, publication pointer, durable outbox) and a read-only embedding model whose
file hashes are verified at start (start period ~3 min). Volumes are never deleted by
routine operations; `down -v` destroys published generations and is forbidden.
Crash safety relies on transaction intents and a durable outbox; 60 s stop grace.

## Deploy unit
Image target `genesis-worker` of `apps/server/Dockerfile` with three pinned source
contexts; Compose service `genesis-worker`, profile `knowledge`, `network_mode:
service:web`. Recreated whenever `web` is recreated. See RB-005 and
RB-003.
