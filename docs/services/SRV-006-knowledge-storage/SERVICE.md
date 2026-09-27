---
id: SRV-006
title: Knowledge object storage
kind: storage
status: draft
delivery: implemented
legacy: [docker-compose.knowledge-storage.yml, TASK-ZAI-049]
relations:
  decided_by: [ADR-091]
---

# SRV-006 — Knowledge object storage

## Responsibility
Self-hosted S3-compatible object store for knowledge artefacts (source files and
catalogue objects admitted to the ingestion pipeline). The application stores and
reads objects through a provider-neutral storage port with its own access key, never
the provider's root credential.

## Domains hosted
DOM-KNW (artefact bytes); DOM-INT/DOM-PRJ file identity remains in the relational
database.

## Entrypoints
S3 API (9000) and admin console (9001) exposed on the application network only;
neither is published through the host or the tunnel.

## Configuration (names only)
Deployment: `ZURI_KNOWLEDGE_STORAGE_IMAGE` (must be pinned by digest),
`ZURI_KNOWLEDGE_STORAGE_ADMIN_ENV_FILE_HOST`, `ZURI_KNOWLEDGE_STORAGE_DATA_DIR_HOST`,
`ZURI_KNOWLEDGE_STORAGE_LICENSE_FILE_HOST`. Application side (knowledge env file):
`ZURI_KNOWLEDGE_STORAGE_ENABLED`, `ZURI_KNOWLEDGE_STORAGE_ENDPOINT`,
`ZURI_KNOWLEDGE_STORAGE_REGION`, `ZURI_KNOWLEDGE_STORAGE_ACCESS_KEY`,
`ZURI_KNOWLEDGE_STORAGE_SECRET_KEY`, `ZURI_KNOWLEDGE_STORAGE_BUCKET`,
`ZURI_KNOWLEDGE_CATALOG_BUCKET`, `ZURI_KNOWLEDGE_STORAGE_BINDING_ID`,
`ZURI_KNOWLEDGE_STORAGE_BINDING_REVISION`.

## Dependencies
A dedicated primary data path on the host; a backup target on a separate host (a
second container on the same host is not a backup failure domain).

## Scaling and state
Stateful single node; data on a dedicated bind-mounted path (not created implicitly).
Measured RPO/RTO, restore rehearsal and separate-host backup are activation gates.

## Deploy unit
Compose overlay `docker-compose.knowledge-storage.yml`, profile `knowledge-storage`;
a deployment template with no defaults — the operator records the pinned image digest
and target in a private receipt before use. See RB-001.
