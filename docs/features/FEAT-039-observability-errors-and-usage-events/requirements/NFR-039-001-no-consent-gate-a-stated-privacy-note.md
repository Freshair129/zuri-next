---
id: NFR-039-001
title: "No consent gate; a stated privacy note instead"
delivery: building
legacy: []
---

# NFR-039-001 — No consent gate; a stated privacy note instead

`UsageEvent`/`ErrorEvent` require no separate consent screen or opt-out —
the same discipline `AuditEvent` and access history already apply to every
signed-in account — but the operator-facing page SHALL state what is
collected, at what level, and for how long (`ADR-037` D4).
