---
id: NFR-076-001
title: "Committed-projection freshness"
delivery: implemented
legacy: []
---

# NFR-076-001 — Committed-projection freshness

`docs:check` SHALL fail when the generated projection is stale relative to the
registry, and CI SHALL fail when the committed `runtime/data-pipeline-map.json` drifts
from what the generator would produce. Measured by the `docs:graph`/`docs:check`
governance chain running on every pull request.
