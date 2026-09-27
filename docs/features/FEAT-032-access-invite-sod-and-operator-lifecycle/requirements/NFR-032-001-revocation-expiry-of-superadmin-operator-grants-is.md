---
id: NFR-032-001
title: "Revocation/expiry of Superadmin/operator grants is effective on the next request"
delivery: implemented
legacy: []
---

# NFR-032-001 — Revocation/expiry of Superadmin/operator grants is effective on the next request

No cached authority outlives a revoked or expired grant, including an
already signed-in browser session (`NFR-018`).
