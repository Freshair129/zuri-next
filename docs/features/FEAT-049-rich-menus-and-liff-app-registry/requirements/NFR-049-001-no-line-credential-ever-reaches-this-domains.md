---
id: NFR-049-001
title: "No LINE credential ever reaches this domain's code"
delivery: implemented
legacy: []
---

# NFR-049-001 — No LINE credential ever reaches this domain's code

Neither the rich-menu service nor the worker holds a channel secret or access
token; every LINE call happens through Integration's rich-menu port, which
resolves the credential per attempt and never returns it.
