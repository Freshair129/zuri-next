---
id: NFR-092-001
title: "Inbox size bound"
delivery: live
legacy: []
---

# NFR-092-001 — Inbox size bound

An inbox response contains at most 200 conversations (`INBOX_ROW_LIMIT`); verified by read-model unit tests.

## Verification

- TC-092-001 — Inbox scope and thread read (see [verification.md](../verification.md))
