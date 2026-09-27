---
id: FR-017-006
title: "Capability-gated local reveal"
delivery: live
legacy: [FR-045 (split 5/7 — reveal)]
relations:
  specified_by: [API-029]
  decided_by: [ADR-006]
  derived_from: [SEC-006]
---

# FR-017-006 — Capability-gated local reveal

The system SHALL reveal an ACTIVE LOCAL_FILE in the OS file explorer only when the local bridge
capability is enabled (`ZURI_LOCAL_FILE_BRIDGE=1`), the request states explicit reveal intent, and
it arrives on a loopback host with a same-origin loopback `Origin`; the caller must own the asset's
Business, the path must resolve inside the mount, and the reveal is audited. Hosted mode SHALL always
deny it, and the UI SHALL disable the action with the capability explanation.

## Acceptance criteria

- AC-017-006-01 — Given a non-loopback host, then reveal is refused and no process is launched.

## Implementation

- application/local-file-reveal-service.js; api/files/[id]/reveal/route.js

## Verification

- TC-017-004 — Reconcile, cache and reveal (see [verification.md](../verification.md))
