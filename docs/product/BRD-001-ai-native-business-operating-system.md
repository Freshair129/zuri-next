---
id: BRD-001
title: Zuri — AI-native business operating system (business requirements)
status: draft
owner: product
legacy: [PRODUCT.md v1.3.0b, README.md, llms.txt, ROADMAP.md rev 2.136.1b, ERP-MODULE-MAP.md v1.4.0b, GAP-ANALYSIS-ZURI-GOVIBE.md]
relations:
  decided_by: [ADR-101, ADR-083, ADR-090]
---

# BRD-001 — Zuri: AI-native business operating system

## 1. Problem

Owners of small and mid-size Thai businesses run their companies through chat. Customers
ask, order and complain on LINE; staff coordinate on LINE; the facts that matter
(stock, orders, payments, projects, customers) live in spreadsheets and several
disconnected tools. Three consequences follow:

1. **Conversation is not business data.** What a customer asked, what was promised
   and what stock was reserved are not connected; answers depend on whoever is online.
2. **One owner, several businesses, no shared view.** Tools that equate "account" with
   "one shop" cannot express an owner with a group of businesses, a shared customer
   base inside a group, or strict isolation between groups.
3. **AI without governance is a liability.** A chatbot that answers from unverified
   text, remembers by channel id, or can write to business records without review
   leaks data across customers and makes irreversible mistakes.

## 2. Vision

One system where **LINE is the primary surface** (AI-native intake and interaction for
customers and staff) and a **web console is the back office** (detail, complex edits,
reconciliation, audit), over one governed model of the business:

```text
Portfolio (group) → Tenant (isolation boundary) → Business → Workspace → Project
```

AI is an operator that reads governed knowledge and business facts and proposes
changes; people approve every change that matters.

## 3. Business outcomes

| # | Outcome | Indicator |
|---|---|---|
| O1 | Customers get correct, grounded answers on LINE at any hour without exposing other customers' or other businesses' data | answers cite published knowledge; zero cross-tenant disclosure; fail-closed on missing scope or credentials |
| O2 | An owner runs several businesses from one login, sharing customers only where intended | one Person with Memberships across Businesses; CRM shared inside a Tenant only |
| O3 | Plans, stock, purchasing, orders and assets are recorded once and reconciled | one writer per fact; on-hand/ATP always recomputed; money in integer satang |
| O4 | Every AI- or import-originated change is previewed and confirmed | all intake through one validate → dry-run → preview → commit → audit pipeline |
| O5 | The business can prove what happened | append-only audit with scope columns; per-person access history; correlation from message to record |
| O6 | Personal data obligations (PDPA) are met | consent per Business, erasure paths for every copy, bounded retention |
| O7 | The owner controls the infrastructure | self-hostable container deployment; secrets write-only; optional self-hosted models |

## 4. Stakeholders and users

| Stakeholder | Interest |
|---|---|
| Business owner (single business) | sees work immediately, starts projects from goals, no structural jargon |
| Group owner (several businesses) | cross-business overview, one-click switching, isolation between businesses, shared work |
| Staff member | answers and commands on LINE, console for detail; only the domains granted |
| Customer | fast, correct LINE answers; consent and erasure respected |
| Installation operator | runs the deployment, grants time-boxed operator access, reads operational telemetry |
| Enterprise integrator | upserts through an API using its own external ids |
| Planning/operations agent | submits plans and commands as envelopes that humans confirm |
| Spreadsheet user | downloads a template, fills it, uploads, sees a row-level dry run |

## 5. Scope

**In (current product):** Projects & work execution (seven execution modes, strategy
progress, goals/OKR), identity & access (sessions, MFA/passkeys, grants, invites,
segregation of duties), CRM (customers, conversations, consent, erasure, cold
archive, sales tasks), LINE OA Studio (multi-account, admission, job execution, rich
menus, LIFF), integrations (secret stores, provider connections, raw evidence,
pipeline ledger, Notion), agent runtime (grounded answers, context composer, tools),
knowledge ingestion (17-stage pipeline with external memory/knowledge tiers),
inventory, procurement, commerce (orders, payments, pricing), asset management,
market intelligence, marketing, platform control.

**Out / not chartered yet:** accounting books and journals (Finance), HR payroll,
manufacturing beyond kitting/customization work orders, warehouse bins/picking,
fulfilment shipping states, distributed microservices without an operational trigger.

## 6. Constraints

| Constraint | Source |
|---|---|
| External identifiers are never primary keys | BR-047 |
| Tenant is the only isolation boundary; a branch is never a tenant | BR-046 |
| AI never writes directly; every AI-derived change is previewed and confirmed | BR-052, BR-054, ADR-083 |
| One reply owner per LINE event; LINE availability must not depend on a customer device | BR-056, ADR-095 |
| Memory, knowledge and business state are separate authorities (four-tier stack) | ADR-090 |
| Channel/provider credentials are write-only; never displayed or exported | SEC-028 |
| Production runs on PostgreSQL with forced row-level security; migrations are operator-applied | ADR-086, ADR-094 |
| Thai copy in user-facing surfaces; English for code, IDs and technical documents | product convention |
| Self-hostable on one owner-controlled host with a public tunnel; VPS later without app change | ADR-091 |

## 7. Assumptions and risks

- LINE Messaging API terms, quotas (push consumes allowance) and retry semantics
  shape delivery; an ambiguous send is reported as unknown, never resent blindly.
- Model providers may fail or change contracts; answers fail closed rather than fall
  back silently.
- The memory/knowledge tiers are separate products with their own release cycles;
  production knowledge is limited to published corpus generations.
- Production activation of several built capabilities (LINE canary, live secret-store
  provisioning, cold archive mount, inference pool) is gated on operator evidence.

## 8. Success measures

- LINE answer path: every answer grounded or explicitly refused; no answer without a
  resolved Business scope; correlation id from webhook to message row.
- Data integrity: zero cross-tenant rows in isolation probes; stock ledger balances;
  audit row for every mutation.
- Operations: deploy, migrate and restore follow runbooks with recorded receipts
  (RB-005, RB-002, RB-001).
