---
id: SDD-057
title: "Connector catalog and GitHub repository projection — design"
---

# SDD-057 — Connector catalog and GitHub repository projection design

- **Components:** CMP-124 — `core/connector-catalog.js` (`CONNECTOR_CATALOG`, `deriveConnectorStatus`, `deriveConnectorCatalog`) using `core/connection-health.js`.
- **Data owned:** none new (reads IntegrationConnection health from the FEAT-091 read model).
- **Contracts exposed:** catalog block of API-140.
- **Contracts consumed:** Repository metadata (DOM-PRJ) for the declared projection.
- **Failure modes:** a connector with no implementation can never be shown as connected.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-057-001 | apps/server/src/platform/integrations/core/connector-catalog.js; apps/server/src/app/(pm)/platform/integrations/page.jsx |
| FR-057-002 | — (declared, blocked) |
