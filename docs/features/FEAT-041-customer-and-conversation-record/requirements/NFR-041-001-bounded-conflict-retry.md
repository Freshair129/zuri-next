---
id: NFR-041-001
title: "Bounded conflict retry"
delivery: live
legacy: []
---

# NFR-041-001 — Bounded conflict retry

A standalone ingestion retries at most 3 attempts on Prisma `P2002`/`P2034` and then
surfaces the error; measured by the integration tests for concurrent first contact.
