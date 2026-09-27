---
id: NFR-093-001
title: "Webhook acknowledgement latency"
delivery: implemented
legacy: []
---

# NFR-093-001 — Webhook acknowledgement latency

LINE is acknowledged after capture and the `ADMITTING` marker only; admission (≈25–30 queries) never runs on the response path. Measured by the after-ack unit test and production redelivery counts.

## Verification

- TC-093-003 — Webhook ingress and after-ack admission (see [verification.md](../verification.md))
