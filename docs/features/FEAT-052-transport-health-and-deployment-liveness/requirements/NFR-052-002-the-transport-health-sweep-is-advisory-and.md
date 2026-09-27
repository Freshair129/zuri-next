---
id: NFR-052-002
title: "The transport-health sweep is advisory and restart-safe"
delivery: live
legacy: []
---

# NFR-052-002 — The transport-health sweep is advisory and restart-safe

`LineOaWorkerCheckpoint` is a durable compare-and-set row; a process restart
mid-sweep leaves the checkpoint reclaimable rather than stuck, consistent with
the stateless-application-tier decision (`ADR-048`).
