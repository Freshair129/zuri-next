---
id: SRV-005
title: Knowledge service (GKS) over private HTTP
kind: service
status: draft
delivery: implemented
legacy: [docker-compose.ki17-gks-http.yml, docker-compose.ki17-gks-http-canary.yml, ADR-042, ADR-075 D10]
relations:
  decided_by: [ADR-089, ADR-090]
---

# SRV-005 — Knowledge service (GKS)

## Responsibility
Tier-3 canonical knowledge authority for this installation: entity resolution and
knowledge decisions for stages 9–14, the stage-17 publication gate, and governed
retrieval planning. Its code is the external Genesis-Knowledge-System at a pinned
revision; this deployment exposes it over a private HTTP transport as an alternative
to the default stdio transport spawned by MSP.

## Domains hosted
DOM-KNW (external authority; Zuri reaches it only through MSP).

## Entrypoints
- HTTP on the private network only (`gks-private`, internal), port 8787 exposed to the
  network, never published to the host or tunnel.
- `GET /healthz`.
- Callers must present relay credentials (MSP relay, pipeline relay) supplied as
  Docker secrets; authentication is required.

## Configuration (names only)
`GKS_DB_PATH`, `GKS_HTTP_HOST`, `GKS_HTTP_PORT`, `GKS_MSP_AUTH_REQUIRED`,
`GKS_MSP_RELAY_CREDENTIAL_FILE`, `GKS_PIPELINE_RELAY_CREDENTIAL_FILE`. Host-side
secret file paths: `ZURI_GKS_MSP_RELAY_CREDENTIAL_FILE_HOST`,
`ZURI_GKS_PIPELINE_RELAY_CREDENTIAL_FILE_HOST`. Callers select it with
`MSP_GKS_TRANSPORT=http` and `MSP_GKS_HTTP_URL`.

## Dependencies
Shared knowledge state volume (GKS SQLite); pinned MSP/GKS/GenesisBlock sources at
build.

## Scaling and state
Single instance; state in the shared knowledge state volume. Hardened container:
read-only root filesystem, small tmpfs, all capabilities dropped, no new privileges.

## Deploy unit
Image target `gks-http`; Compose overlay `docker-compose.ki17-gks-http.yml` (opt-in).
A canary run uses a distinct project name with fresh env files and volumes and
disables the public tunnel. Without the overlay, GKS runs as an MSP stdio child.
