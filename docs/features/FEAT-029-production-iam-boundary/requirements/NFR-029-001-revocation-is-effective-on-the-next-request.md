---
id: NFR-029-001
title: "Revocation is effective on the next request"
delivery: building
legacy: []
---

# NFR-029-001 — Revocation is effective on the next request

Session/Membership revocation SHALL take effect on the very next request
across process restarts once they share the database — no cached authority
outlives it (`NFR-018`).
