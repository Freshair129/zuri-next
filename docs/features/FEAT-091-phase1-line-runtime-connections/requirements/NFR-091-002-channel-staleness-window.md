---
id: NFR-091-002
title: "Channel staleness window"
delivery: building
legacy: []
---

# NFR-091-002 — Channel staleness window

A channel connection without arrival evidence for 24 h is not reported CONNECTED; verified by connection-health unit tests.

## Verification

- TC-091-004 — Integrations management and health (see [verification.md](../verification.md))
