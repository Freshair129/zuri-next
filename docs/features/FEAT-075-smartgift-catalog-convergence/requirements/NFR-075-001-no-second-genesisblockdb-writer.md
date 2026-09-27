---
id: NFR-075-001
title: "No second GenesisBlockDB writer"
delivery: building
legacy: []
---

# NFR-075-001 — No second GenesisBlockDB writer

Neither the SmartGift adapter (FR-075-001) nor the edge query path
(FR-075-003) SHALL ever write GenesisBlockDB or the v4 store directly; the only
write path for SmartGift catalog data is Stage 13 by the GenesisBlock worker, under a
GKS decision and a Stage 17 gate. Measured by ADR-064's grep-verifiable absence of
any direct substrate client in `src/`.
