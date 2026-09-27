---
title: System business rules (BR-SYS)
status: draft
owner: architecture
legacy_source: docs/PRD-SDD-v1.0.md §1.5 (zuri-ai @ 9e5b104e)
---

# BR-SYS — System business rules

Invariants of the business that hold independently of any screen. Each rule names
the domains it binds (`Applies to`). Numbering mirrors the legacy row
(see `registry/crosswalk/SYS.csv` for the legacy → new mapping); no legacy BR row was
retired. Domain features cite these rules with `decided_by`/`derived_from`
relations; they never restate them.

## Scope, identity and authority

### BR-046 — Tenant is the isolation and sharing boundary; a branch is never a tenant
`tenantId` SHALL be the only data-isolation and data-sharing boundary. Businesses in
the same Tenant MAY share CRM (customer master, conversations); Businesses in
different Tenants SHALL NOT share any operational data. A branch (สาขา) is a location
under a Business and SHALL never be modelled as a Tenant.
Applies to: DOM-IAM, DOM-PRJ, DOM-CRM, DOM-INV, DOM-COM, DOM-PRC
Relations: decided_by: ADR-093, ADR-086
Legacy: BR-001

### BR-047 — External identifiers are never primary keys
Every persisted entity SHALL be keyed by an internal UUID and SHALL expose a unique
human `code`. Identifiers issued by outside systems (tax id, LINE user id, GitHub id,
ERP/SAP id, FlowAccount item code) SHALL be stored as attributes or `ExternalRef`
mappings and SHALL never be a primary or foreign key.
Applies to: DOM-PRJ, DOM-IAM, DOM-INT, DOM-CRM, DOM-INV, DOM-AST
Relations: decided_by: ADR-096
Legacy: BR-002

### BR-057 — Tenant and Business scope are server authority
Tenant and Business scope SHALL be derived by the server from a server-owned binding
or session. A production caller MAY present only binding identity, destination and a
binding-scoped credential; an inbound `tenantId`/`businessId` SHALL never authorize
access. A missing, mismatched, inactive, expired or database-unavailable binding SHALL
fail closed before any model or persistence work.
Applies to: DOM-AGT, DOM-INT, DOM-LOA, DOM-IAM
Relations: decided_by: ADR-086
Legacy: BR-012

### BR-060 — Transport authentication proves origin only
Verifying a LINE (or other channel) signature SHALL establish only that an event came
from the channel. Principal, Tenant, Business, thread audience, capability,
sensitivity and memory-vault access SHALL come from server-owned identity and policy;
thread membership MAY attenuate access but SHALL never elevate it.
Applies to: DOM-AGT, DOM-IAM, DOM-LOA
Relations: decided_by: ADR-088
Legacy: BR-015

### BR-061 — Authority layers are distinct and never widen upward
Profile, WorkspaceMembership, Tenant/Business Membership and Project assignment SHALL
be separate authority layers. A lower-level membership SHALL never widen a
higher-level scope; roles, domain grants and target identities SHALL be decided by
the server and never accepted as self-asserted client input.
Applies to: DOM-IAM, DOM-PRJ
Legacy: BR-016

### BR-063 — Team membership is never an authorization input
A Team SHALL group people only. It SHALL NOT grant, widen or imply any scope, role or
domain visibility, and the identity resolver SHALL NOT read Team data. `Membership`
is the authority record.
Applies to: DOM-IAM
Legacy: BR-018

### BR-065 — Person is the canonical principal
`Person` SHALL be the canonical internal principal; provider and channel subjects
SHALL be namespaced external attributes of it. Only an ACTIVE Membership and a
scope-valid RoleBinding SHALL grant authority. Client, prompt, model or tool values
MAY attenuate but SHALL never widen server-owned scope.
Applies to: DOM-IAM, DOM-AGT
Legacy: BR-020

### BR-078 — A grant is withdrawn only by an explicit, attributed act
A grant (Membership, RoleBinding, PlatformGrant) SHALL be withdrawn only by an
explicit act that records who withdrew it and why. No cascade, referential action or
other database side effect SHALL change or widen a grant's scope; deleting a parent
row that would reshape a grant SHALL be refused until the grant is withdrawn. Every
status value a resolver branches on SHALL have a service that writes it.
Applies to: DOM-IAM
Legacy: BR-033

### BR-079 — Employment and access are independent facts
An HR assignment (`Employment`) and an access grant (`Membership`) SHALL never derive
one another: ending one SHALL write no change to the other. A `LegalEntity` SHALL
belong to exactly one Tenant and a Business MAY reference a LegalEntity only within
its own Tenant. A VAT branch code SHALL belong to the legal entity's tax
registration, never to an operating site.
Applies to: DOM-IAM, DOM-PRJ
Legacy: BR-034

### BR-080 — Segregation of duties for money and stock
A cycle that touches money or stock SHALL require two different people. A role that
both records and confirms the same class of fact SHALL be refused at assignment
unless a Tenant owner overrides it with a recorded reason, and SHALL be refused again
at the transaction when the same person would record and confirm the same instance —
an OWNER does not bypass this. A one-person Business exemption SHALL be an explicit,
audited attestation.
Applies to: DOM-IAM, DOM-COM, DOM-PRC, DOM-INV
Legacy: BR-035

### BR-081 — Audit events carry their scope as data
An audit event for a mutation that touches a Tenant or Business SHALL record that
Tenant/Business id (and the reason, when one is given) as queryable columns, not only
inside a free-form payload. Adding scope columns SHALL never require rewriting existing
rows; an older row states its scope as absent, never as an inferred value.
Applies to: DOM-PRJ, DOM-IAM (all writers of `AuditEvent`)
Legacy: BR-036

## Intake, planning and progress

### BR-048 — Projects start from a goal, not a template
The product SHALL NOT offer a project template picker. A Project starts from its goal;
the execution mode belongs to each Workstream.
Applies to: DOM-PRJ
Legacy: BR-003

### BR-049 — Exactly seven canonical execution modes
Workstreams SHALL use one of the seven canonical execution modes (Software Sprint,
Data Migration, B2B Sales, B2C Campaign, Product Launch, Operations, Business
Expansion). Adding a mode is a product decision, not a configuration change.
Applies to: DOM-PRJ
Legacy: BR-004

### BR-050 — Progress is strategy-based and weighted
`tasks_done / tasks_total` SHALL NOT be used as a universal progress measure. Each
Workstream's progress SHALL come from its declared progress strategy and the Project
figure SHALL be the weighted roll-up `Σ(workstream% × weight) / Σ(weight)`.
Applies to: DOM-PRJ
Legacy: BR-005

### BR-051 — An open required gate caps progress at 99 %
While any required Gate is not passed, reported progress SHALL be capped at 99 % and
SHALL carry a warning naming the gate.
Applies to: DOM-PRJ
Legacy: BR-006

### BR-052 — Imported plans are data, never code
A plan or envelope received through any surface SHALL be treated as data only; the
system SHALL never execute code, queries or commands carried in it.
Applies to: DOM-PRJ, DOM-AGT, DOM-INV, DOM-AST
Relations: decided_by: ADR-098
Legacy: BR-007

### BR-053 — Snapshot restore always previews and confirms
Restoring a snapshot SHALL always show a preview (counts, conflicts) and require an
explicit confirmation; silent overwrite SHALL never happen.
Applies to: DOM-PRJ, DOM-PLT
Legacy: BR-008

### BR-054 — One intake pipeline for every surface
Every intake surface (UI form, Excel, agent/JSON, enterprise API, LINE command, canvas
gesture) SHALL converge on one envelope and one pipeline: validate → semantic check →
dry run → preview → single transaction → audit. A new surface SHALL add a converter,
never a second write path.
Applies to: DOM-PRJ, DOM-INV, DOM-AST, DOM-AGT
Relations: decided_by: ADR-098
Legacy: BR-009

### BR-062 — No bare dependency edge
A dependency edge SHALL NOT be created without a declared Handoff Contract, and a
declared but unsatisfied contract SHALL NOT release its successor. This domain
contract is distinct from the transport envelope of BR-054.
Applies to: DOM-PRJ
Legacy: BR-017

### BR-088 — At most two Wildly Important Goals per Business
A Business SHALL hold at most two non-archived goals with `isWig = true`. The limit
SHALL be enforced per Business (not per roadmap) inside the transaction that sets the
flag.
Applies to: DOM-PRJ
Legacy: BR-043

### BR-089 — Goal progress has exactly one writer
A `BusinessGoal`'s progress SHALL be either manual or derived from its Key Results,
never both: once a goal has a non-archived Key Result, a manual progress update SHALL
be refused and every reader SHALL show the derived value.
Applies to: DOM-PRJ, DOM-MKT
Legacy: BR-044

## Files and knowledge

### BR-055 — The relational store is the only authority for file identity
The relational database SHALL be the sole authority for file identity, scope and
links. Filesystem content and the local cache (`.zuri/cache`) SHALL be storage or
disposable projections, never a second writable relationship store. Business-level
file views SHALL aggregate by IDs/links and never duplicate a file to show it.
Applies to: DOM-PRJ
Legacy: BR-010

### BR-066 — Knowledge ingestion is idempotent on four keys
Knowledge ingestion SHALL be idempotent on (source identity, source version, content
hash, pipeline version) together: reprocessing the same event SHALL NOT create a
second copy, while a change in any one key SHALL be a new derivation. Raw re-delivery
identity at the integration boundary stays `sha256(tenantId, connectionId,
entityType, externalId, payloadHash)`.
Applies to: DOM-KNW, DOM-INT
Legacy: BR-021

### BR-067 — Failed knowledge objects are quarantined, never lost
An object that fails an ingestion stage SHALL be quarantined with its failure envelope
(`job_id`, `artifact_id`, `stage`, `error_code`, `error_message`, `retry_count`,
`first_failed_at`, `last_failed_at`, `pipeline_version`) and classified as
retryable, non-retryable or review-required. Silent loss SHALL never occur.
Applies to: DOM-KNW
Legacy: BR-022

### BR-064 — Raw integration evidence is immutable provenance
Raw external records SHALL be immutable evidence of acquisition. Derived observations
(e.g. Market) MAY be computed from them but SHALL never rewrite, re-own or trust
payload fields as Tenant/Business/connection/source scope.
Applies to: DOM-INT, DOM-MKI
Legacy: BR-019

## LINE channel

### BR-056 — One reply owner per LINE event
Each inbound LINE event SHALL have exactly one reply owner at any instant. For a
server-enabled account that owner is the server admission/job system, with one
executor cohort (`SERVER` or `CONVERSATION_RUNTIME`) snapshotted per job. Any other
process receiving the same channel's webhook SHALL NOT answer it; moving a channel
between owners SHALL be one operator step (webhook repoint and credential together).
Applies to: DOM-LOA, DOM-INT, DOM-AGT
Relations: decided_by: ADR-095
Legacy: BR-011 (rewritten: the original split between an external transport and
zuri-ai's answer policy was retired with the legacy forwarding seam)

### BR-058 — Readiness is not activation
Evaluation, isolation probes and canary planning MAY run while a channel binding is
`PENDING`; only a separately approved operator action MAY install binding hashes or
enable a canary. `ACCEPTED_BY_LINE` SHALL never be reported as displayed or read.
Applies to: DOM-AGT, DOM-LOA
Relations: decided_by: ADR-087
Legacy: BR-013

### BR-059 — One activation correlation, one mutation, one canary
An activation correlation id SHALL own at most one binding mutation and one LINE
canary send. A replay SHALL return the existing redacted result or fail closed; it
SHALL never cause a second send.
Applies to: DOM-AGT
Legacy: BR-014

### BR-087 — Catalogue changes from LINE need a verified staff previewer
A LINE message MAY change the catalogue only when sent by a verified staff member
with Inventory write authority, in a direct chat, after a preview that the same
person confirms. Anyone else (customer, unverified sender, member without write
authority, group chat) SHALL be answered as an ordinary question; a confirm/cancel
from anyone but the previewer SHALL be refused as not found.
Applies to: DOM-INV, DOM-AGT, DOM-LOA
Legacy: BR-042

## Assets

### BR-068 — Asset truth has one writer per fact
Asset Management SHALL own physical asset identity, lifecycle, temporal
responsibility/location/Project allocation and evidence review. Procurement owns
PR/PO/GRN, Identity owns Person/Membership, file management owns `FileAsset`
content, Project Manager owns requests and the read inventory, Finance owns books.
References and projections SHALL never transfer write authority.
Applies to: DOM-AST, DOM-PRC, DOM-IAM, DOM-PRJ
Legacy: BR-023

### BR-069 — Procurement-origin asset approval requires typed evidence
A procurement-origin Asset SHALL NOT be approved without active asset-photo and
payment evidence plus typed PR and PO references; expiry-controlled categories also
require lot and expiry; warranty evidence is required only when a warranty document
exists. Values from OCR/vision, workbooks, sheets, agents or LINE are candidates and
SHALL NOT satisfy authorization or approval.
Applies to: DOM-AST
Legacy: BR-024

### BR-070 — Asset evidence has three non-overwriting layers
Asset evidence SHALL keep three independently attributable layers: original
FileAsset, provider candidate, and human review/correction; no layer overwrites the
one before it. Only deterministic validation plus required reviewed evidence MAY set
`READY_FOR_REGISTRATION`, which neither creates a RegisteredAsset nor asserts
Procurement/Finance acceptance.
Applies to: DOM-AST
Legacy: BR-025

## Stock, catalogue and money

### BR-071 — Located stock moves only by an atomic transfer pair
A located stock change SHALL be a transfer: the issue at the source and the receipt at
the target written together in one transaction through the stock-ledger writer.
Business-wide on-hand is therefore unchanged by a transfer; a located sum SHALL be
reported beside, never instead of, the Business-wide total.
Applies to: DOM-INV
Legacy: BR-026

### BR-072 — Ledger money is integer satang; single-drop freight is absorbed
Money in the stock ledger SHALL be integer satang (THB × 100); floats SHALL never be
stored. Shared batch costs (sea freight, duty, inbound truck) SHALL be divided by batch
quantity and rounded up to the satang into unit landed cost. A standard single-drop
delivery is absorbed into valuation; additional drops are a Commerce service charge.
Applies to: DOM-INV, DOM-PRC, DOM-COM
Legacy: BR-027

### BR-073 — Customization is irreversible
Branded (customized) stock SHALL become a customer-dedicated product
(`itemKind = CUSTOM_COMPONENT` with dedicated customer and sales order) and SHALL
never return to generic stock, be issued for another customer, be transferred into a
raw-stock location or be kitted for another order. The only exit is an explicit,
reasoned ADJUSTMENT write-off.
Applies to: DOM-INV
Legacy: BR-028

### BR-074 — BOM scrap allowance is declared and issued up front
A recipe SHALL declare `scrapAllowanceFactor` in [0, 0.20] (default 0); the gross issue
for net requirement Q SHALL be `ceil(Q × (1 + factor))`. Unused buffer is reconciled at
completion; an uncovered shortage SHALL block the work order (`BLOCKED_SHORTAGE`);
scrap SHALL be issued to the quarantine/scrap location as a movement.
Applies to: DOM-INV
Legacy: BR-029

### BR-075 — Storage-degrading lots are guarded on issue
For a product declaring `maintenanceIntervalDays` and/or `maxStorageDays`, a lot's age
SHALL run from `lastMaintainedAt ?? manufacturedAt`. A lot past the maintenance
interval is surfaced as a task but stays issuable; a lot past `maxStorageDays` SHALL be
refused for issue and kitting until maintenance is recorded.
Applies to: DOM-INV
Legacy: BR-030

### BR-076 — Available-to-promise subtracts promises first
`ATP = onHand − Σ committed reservations − Σ live quote reservations`. Quote
reservations are soft and expire (default 7 days); order reservations are committed
against a confirmed sales order. Reservations SHALL never write the stock ledger and
SHALL never be deleted (only `RELEASED`, `CONVERTED`, `EXPIRED`); expiry SHALL be
evaluated on read.
Applies to: DOM-INV, DOM-COM
Legacy: BR-031

### BR-077 — Tradeable sets carry a validated external item code
A kitting work order SHALL be refused when its output lacks a FlowAccount item code
matching `^[A-Z0-9]+-[0-9]+\([A-Z0-9_-]+\)$`. The code SHALL be stored as an attribute
unique per (Tenant, code), never as `Product.code` and never as a key.
Applies to: DOM-INV
Legacy: BR-032

### BR-082 — Pack size is a unit conversion, not a SKU
A pack size SHALL be a `ProductUnitConversion` (integer factor of base units) on the
SKU. The ledger SHALL count base units only; a movement naming another unit SHALL be
converted before append; a fraction is a different base unit.
Applies to: DOM-INV
Legacy: BR-037

### BR-083 — A service is never a variant of a good
The nature (GOOD or SERVICE) SHALL be declared once on the product master and
inherited by every SKU; a SKU whose policy disagrees SHALL be refused at creation and
pre-existing disagreements reported until corrected.
Applies to: DOM-INV
Legacy: BR-038

### BR-084 — One physical variant, one SKU; consolidation never deletes
The normalized variant key SHALL be unique per master; an exact lookalike SHALL be
refused unless a person overrides it on the record. A duplicate found later SHALL be
merged: stock moves through the ledger, references move to the survivor, and the
duplicate remains archived pointing at the survivor.
Applies to: DOM-INV
Legacy: BR-039

### BR-085 — A SKU with stock or a live promise cannot leave the catalogue
ARCHIVE SHALL be refused while a counted SKU has on-hand or an active reservation.
PHASE_OUT is the sell-down state and SHALL refuse every receipt.
Applies to: DOM-INV
Legacy: BR-040

### BR-086 — Intake resolves before it creates and never overwrites
Every intake item SHALL be resolved by its active identifiers and SKU code (following
merges) before a create is planned. A match SHALL only add missing identifiers and
unit conversions and report other differences as warnings. A commit SHALL apply
exactly the previewed plan (hash-matched) in one transaction, or nothing.
Applies to: DOM-INV
Relations: decided_by: ADR-098
Legacy: BR-041
