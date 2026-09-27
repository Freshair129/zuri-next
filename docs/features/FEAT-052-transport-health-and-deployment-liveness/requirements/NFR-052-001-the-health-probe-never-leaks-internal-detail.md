---
id: NFR-052-001
title: "The health probe never leaks internal detail"
delivery: live
legacy: []
---

# NFR-052-001 — The health probe never leaks internal detail

`GET /api/health`'s response body contains only the two documented states;
measured by absence of stack traces, hostnames or credentials in its output
under a simulated database failure.
