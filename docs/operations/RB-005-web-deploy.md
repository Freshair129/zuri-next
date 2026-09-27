---
id: RB-005
title: Deploy and release the application stack
status: draft
owner: operations
legacy: [docs/deployment/docker-ngrok.md v1.3.0b, ADR-058, ADR-062, ADR-104 D4, CLAUDE.md deploy notes]
relations:
  decided_by: [ADR-091, ADR-092, ADR-094]
---

# RB-005 — Deploy and release the application stack

Operates SRV-001 and the services in its Compose project (SRV-002,
SRV-004, SRV-003, SRV-005, SRV-006) plus the
public tunnel. Database changes are a separate gate (RB-002); a deploy
never mutates an external database.

## 0. Preconditions (stop if any fails)

1. The release commit is reviewed and merged; build the image from a clean checkout
   of that commit, never from a working tree with uncommitted changes.
2. Every migration the release needs is already applied and its receipt accepted.
3. The host's app-directory env file exists and names the production overlays:
   `COMPOSE_FILE` lists the base file plus every production overlay (LINE server,
   cold archive, knowledge web image, optional GKS HTTP) and `COMPOSE_PROFILES`
   lists `line-server` (and `knowledge` where the knowledge worker runs).
   A root-level env file is invisible to Compose.
4. Nobody else is operating the same Compose project: the project name is pinned, so a
   command from any checkout acts on the live stack. A lane that only needs a test
   stack uses its own project name (`-p`), its own env file and never the production
   tunnel domain.
5. Secrets (session secret, worker token, reply-sealing key, KEKs, tunnel authtoken,
   database URLs, credential files) exist on the host only; none is passed on the
   command line or printed.

## 1. Build and start

```bash
cd apps/server
docker compose build            # or pull an immutable image digest when a private registry is used
docker compose up -d            # COMPOSE_FILE / COMPOSE_PROFILES from the env file apply
```

Never pass `-f` unless you list **all** production overlay files and profiles
yourself: an explicit `-f` replaces `COMPOSE_FILE`, silently dropping the LINE server
overlay (web then answers every LINE delivery and worker call with 503).

## 2. Verify (all must pass before announcing the release)

1. `docker compose ps`: `web` healthy; `ngrok` running (starts only after `web` is
   healthy); `line-worker` running; knowledge worker healthy after its start period.
2. The web container's Compose config-files label lists every production overlay, and
   the LINE-server flag inside the container reads `true`.
3. `GET /api/health` locally and through the public origin returns `status=ok`,
   `db=ok`; note `dbLatencyMs` (session pooling expected).
4. Worker logs show tick records (`line.worker.tick`) with non-error status.
5. If `web` was recreated and the knowledge worker shares its network namespace,
   recreate `genesis-worker` too (same image) and run the read-only relay smoke check;
   a stale-healthy worker in a dead namespace answers `pipeline_worker_unavailable`.
6. Route-level checks for the features the release changes (health 200 proves only
   process and database reachability).
7. Read the tunnel's own request log/inspection API for the webhook path, not only the
   provider console's "verify" button.

## 3. Rollback

Application rollback is an image rollback: set the previous image tag/digest and
`docker compose up -d`. Do not roll back while LINE jobs are `SENDING`/`UNKNOWN` or an
unconfirmed push is unresolved; resolve them first (RB-004 §4). Database
structural rollback is never automatic.

## 4. Moving to a VPS

No application change: publish images to a private registry and deploy by digest, put
a domain and TLS terminator in front of `web:3000`, set `PUBLIC_BASE_URL`, and scale
the tunnel to 0. Keep the Host header unchanged at the proxy.

## Evidence to record

Release commit, image digest, overlay list, health output (redacted), worker tick
sample, route checks performed, operator and time. Never include secrets, URLs with
credentials, tokens or customer content.
