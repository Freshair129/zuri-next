---
id: PRD-001
title: Zuri — product requirements (system level)
status: draft
owner: product
legacy: [PRODUCT.md v1.3.0b, PRD-SDD-v1.0.md §1.1–1.2, ERP-MODULE-MAP.md, SYSTEM-DIAGRAM.md, ROADMAP.md]
relations:
  derived_from: [BRD-001]
  decided_by: [ADR-085, ADR-093, ADR-095, ADR-098]
---

# PRD-001 — Zuri product requirements (system level)

What the product is and the rules every feature inherits. Feature behavior lives in
the domain feature files; this document never restates it.

## 1. Surfaces

Two primary surfaces, deliberately unequal, plus machine interfaces.

| Surface | Role | Users | Notes |
|---|---|---|---|
| **LINE** (primary) | AI-native intake and interaction | customers, staff | multi-account per Business (LINE OA Studio); answers grounded in the Business's published knowledge; staff commands (catalogue, work) go through preview + confirm by the same verified sender; one reply owner per event |
| **Web console** (back office) | detail, complex edits, reconciliation, audit, configuration | owners, staff, operator | Thai UI copy; responsive to 375 px; keyboard palette; staged entry → Business Routing → BusinessShell |
| **Enterprise API** | upsert and resolve by external ids through the intake pipeline | integrators | Tenant-bound API keys; OpenAPI description |
| **Plugin / MCP** | agent clients acting for a signed-in person | agent tools | PKCE public-client authorization; capabilities from the person's authority |
| **Internal service façades** | private ports for extracted services | SRV-003, SRV-007 | not public; never accept model-supplied scope |
| **Customer-premise device** | retired as a connection surface | — | pairing, heartbeat, device extraction and device LINE forwarding are retired (ADR-095); the desktop app survives only as an optional local knowledge/RAG runtime |

## 2. Scope chain

```text
Portfolio (UI: Group, เครือ) ─ Tenant (UI: Organization; isolation boundary, never a branch)
   └─ Business (ธุรกิจ; the selectable operating node)
        ├─ Workspace (operating unit) ─ Project ─ Workstream ─ WorkContainer / WorkItem / Milestone / Gate
        └─ Branch (สาขา; a location)
```

- The schema carries the full chain; the UI shows only levels that offer a real
  choice (a single-business owner never sees Group).
- The operating shell always has exactly one selected Business; Group and
  Organization are ancestry labels and the Business Routing grouping.
- People without Business access start from a Profile and may wait (Waiting Room) or
  join a collaboration Workspace before any Business grant exists.
- Decisions: ADR-093 (vocabulary), ADR-085 (entry and shell layers).

## 3. Product-wide rules

| Rule | ID |
|---|---|
| Tenant is the isolation and sharing boundary; branch is a location | BR-046 |
| External ids are never primary keys (UUID + human code + ExternalRef) | BR-047 |
| Scope is server authority; request bodies never select Tenant/Business | BR-057, SEC-001 |
| Every intake surface uses one pipeline: validate → dry run → preview → single transaction → audit | BR-054, ADR-098 |
| Plans and envelopes are data; nothing in them executes | BR-052, SEC-002 |
| AI never writes directly; agent tools add no authority | ADR-083, ADR-100 |
| One reply owner per LINE event; execution is server-owned | BR-056, ADR-095 |
| Every significant mutation is audited, append-only, with scope columns | SEC-003, BR-081 |
| Authorization is recomputed per request and per agent turn | NFR-018 |
| Credentials are write-only and never displayed, logged or exported | SEC-028 |
| Personal data has consent, retention and erasure for every copy | SEC-004, SEC-029 |
| Money is integer satang | BR-072 |
| Progress and ATP are recomputed, never trusted from a cache | BR-050, BR-076, NFR-005 |
| Enum vocabularies have one source of truth | ADR-096 |
| Thai copy in user-facing surfaces; English for code, IDs and technical documents | convention |

## 4. Domain map

Codes from `registry/domains.yaml`, which also carries each domain's subdomain type
(core / supporting / generic) and role (foundation / business / platform) and, in
`registry/relations.yaml`, the context map between domains (ADR-107); each domain's
README shows its own entry. ERP grouping in the domain bar: **SCM** groups
Inventory, Warehouse (reserved), Procurement and Order Management (Commerce); **CRM**
groups Customer and Market Intelligence. A group is navigation only and is never
granted; each module keeps its own route key and grant.

| Code | Domain | Purpose |
|---|---|---|
| DOM-PRJ | Projects & Work | Scope chain administration, projects, workstreams in seven execution modes, strategy-based progress, business roadmap/goals/OKR, plan import, files, execution trace, audit seam and snapshot backup |
| DOM-IAM | Identity & Access | Person, channel identity linking, sessions, MFA/passkeys, Membership/RoleBinding/PlatformGrant lifecycle, invites, segregation of duties, API/plugin/data-plane keys, viewer gate, erasure, employment and legal entities |
| DOM-PLT | Platform Control | Installation-operator-only projections: programme board, health, error/usage telemetry, navigation shell configuration |
| DOM-CRM | Customer & Conversation | Customers, conversations and messages from every channel, sessions, consent, sales tasks, conversation analysis, retention, cold evidence archive |
| DOM-LOA | LINE OA Studio | Multi-account LINE OA management, native webhook admission, durable conversation jobs, rich menus, LIFF, transport health |
| DOM-INT | Integrations | Provider connections, write-only secret stores, provider transports (LINE, model, Notion), raw external evidence, pipeline execution ledger |
| DOM-AGT | Agent Runtime | Grounded answer adapters, context composer, memory ports, tool registries, activation readiness, model credential resolution |
| DOM-KNW | Knowledge | 17-stage ingestion (Tier-1 stages), admission and publication of corpus generations, business knowledge reads |
| DOM-INV | Inventory & Catalogue | Catalogue identity (master/SKU/bundle/lot/serial), SKU governance, append-only located stock ledger, reservations/ATP, work orders, catalogue intake |
| DOM-PRC | Procurement | Suppliers, purchase orders, goods receipts posted to the stock ledger |
| DOM-COM | Commerce | Sales orders, payments and refunds with second-person verification, pricing rules, fulfilment through Inventory |
| DOM-AST | Asset Management | Physical asset identity and lifecycle, evidence intake with OCR candidates and human review, custody/location/project allocation, depreciation candidates |
| DOM-MKI | Market Intelligence | Translation of raw external evidence into provider-neutral market observations |
| DOM-MKT | Marketing | Strategy and plan evidence, initiatives, content approval, marketing operations, insights |

Cross-domain features (`features/FEAT-X-*`) combine parts owned by these domains.

## 5. Release status overview

Delivery vocabulary per STD-001 R6. "Local" means implemented and tested but not
activated in production; production gates are operator steps.

| Area | Delivery | Open gates |
|---|---|---|
| Projects & work (MVP, intake surfaces, views, business strategy, OKR phase 1) | live | KPI/4DX phases declared |
| Identity & access (sessions, onboarding/invites, RBAC, MFA, passkeys, API keys, operator grants) | live | provider-evidence hardening |
| CRM (inbox, reply receipt, consent, erasure, sales tasks, sessions) | live | cold-archive production mount; legal hold |
| LINE server runtime (admission, jobs, worker, rich menus, LIFF) | implemented | channel owner switch, live provider key, canary |
| Conversation Runtime service | implemented | production cutover |
| Integrations (secret stores, model-provider keys, raw evidence, Notion) | implemented | live secret-store provisioning per Business |
| Knowledge ingestion & publication (17 stages) | implemented (isolated profile running on the production host) | product-wide metrics; broader corpus rollout |
| Inventory, Procurement, Commerce, SCM navigation | implemented | warehouse bins/picking, fulfilment states |
| Asset Management & evidence | implemented | production activation, registration handoff |
| Market Intelligence (translation; extracted service) | implemented | executor switch to the service |
| Marketing (strategy, initiatives, content, operations, insights read surface) | building | insights repository, provider bindings |
| Platform control, observability, delivery telemetry | live | — |
| Self-hosted inference pool | declared | design approved |
| Device pairing, device extraction, harness pairing | retired | removal from running deployment |

## 6. Non-goals

- Replacing or migrating any other product (ADR-101).
- Microservices without an operational trigger; runtime domain events/outbox before a
  consumer needs them.
- Automatic promotion of conversation content into canonical knowledge.
- Accounting books/journals, payroll, general manufacturing (not chartered).
