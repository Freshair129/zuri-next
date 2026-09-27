---
id: NFR-001-001
title: "Authority is evaluated before input is parsed"
delivery: live
legacy: []
---

# NFR-001-001 — Authority is evaluated before input is parsed

Every scope-creation request SHALL resolve the viewer before reading the body, so an
unauthenticated caller learns nothing (not even accepted entity names). Measured by
integration tests issuing unauthenticated requests (expect 401, no body parsing side effects).
