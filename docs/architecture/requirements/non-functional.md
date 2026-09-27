---
title: System non-functional requirements (NFR-SYS)
status: draft
owner: architecture
legacy_source: docs/PRD-SDD-v1.0.md §1.4, NFR-006, ADR-083, ARCH-001, NFR-025 (zuri-ai @ 9e5b104e)
---

# NFR-SYS — System non-functional requirements

Measurable quality constraints that hold across features. Numbering mirrors the
legacy row (`NFR-nnn` ⇐ `NFR-nnn`); NFR-018 was merged into
NFR-018, so number 014 is intentionally left unused. `NFR-025` is new (from legacy
NFR-025). Each entry states the target, how it is measured, and its current status
where the legacy registry recorded a gap. `Status: declared` marks an approved
constraint with no implementation yet.

## Portability, build and data

### NFR-001 — Local runtime works offline
After dependency installation, the development/local runtime SHALL run with no
network dependency: SQLite store, no cloud service, CDN or externally hosted font.
Measure: start the app with networking disabled; every console route renders.
Applies to: SRV-001
Legacy: NFR-001

### NFR-002 — The production build is clean
The production build of every deployable SHALL complete with zero errors on the
release commit. Measure: CI build job exit status.
Applies to: SRV-001, SRV-003, SRV-007
Legacy: NFR-002

### NFR-006 — Persistence is provider-portable without semantic change
The domain model SHALL run on SQLite (dev/test) and PostgreSQL (production) with
identical semantics: string-persisted enums, application-generated UUIDs, JSON
validated at the boundary, no provider-specific SQL in application code. The
PostgreSQL schema SHALL be generated from the canonical model, and data SHALL move
between providers by a UUID-preserving snapshot export/import, never by file copy.
Measure: the integration suite passes on both providers; snapshot round-trip test.
Applies to: SRV-001, SRV-009
Relations: decided_by: ADR-096
Legacy: NFR-006, FR-030 (portability part)

### NFR-007 — Seed data is idempotent and resettable
Seeding SHALL be idempotent (running it twice yields the same rows) and a reset SHALL
drop and reseed. Measure: double-run seed test.
Applies to: SRV-001
Legacy: NFR-007

### NFR-011 — Production schema changes are migration-first and reversible
Production tenancy and schema changes SHALL be delivered as idempotent, additive
migrations applied by an operator under bounded lock/advisory timeouts; reserved
code/UUID collisions SHALL abort; schema history and a backup SHALL be inspected
before apply. No runtime secret or service-role key SHALL appear in source,
migration SQL, logs or browser code. Measure: operator receipt (preflight, snapshot
hash, dry run, post-apply catalog check) per ADR-094.
Applies to: SRV-009
Relations: decided_by: ADR-094, ADR-086
Legacy: NFR-011

### NFR-025 — Database pooling mode follows deployment topology
For a managed-Postgres pooler host, a long-running process SHALL use session pooling
(one stable small connection set, one round trip per query) and only a serverless
platform SHALL use transaction pooling; an explicit operator override SHALL exist for
topologies auto-detection cannot see (several replicas sharing one database). A
direct or non-pooler connection SHALL pass through unchanged. Measure: the health
endpoint's `dbLatencyMs`; unit tests of the pool-mode resolver. Reference
measurement: session mode ≈ network RTT; transaction mode ≈ 5× slower per trivial
query from a single container.
Applies to: SRV-001, SRV-009
Relations: decided_by: ADR-091
Legacy: FR-145

## User interface

### NFR-003 — Responsive to 375 px
Every console page SHALL render at 375 px width with no horizontal scroll.
Measure: end-to-end viewport test.
Applies to: SRV-001
Legacy: NFR-003

### NFR-004 — Keyboard and assistive-technology access
The console SHALL provide a full keyboard command palette, accessible names on
interactive controls and `progressbar` roles on progress indicators.
Measure: end-to-end keyboard tests and role assertions.
Applies to: SRV-001
Legacy: NFR-004

### NFR-008 — UI uses semantic tokens, declares states, meets WCAG 2.2 AA
New or changed UI SHALL use semantic/component design tokens (never primitive
colours directly), define its loading/empty/error/forbidden states, and meet the
WCAG 2.2 AA baseline. Measure: design-token tests and visual route checks.
Applies to: SRV-001
Relations: decided_by: ADR-084
Legacy: NFR-008 (legacy-module parity clause dropped)

## Determinism and recovery

### NFR-005 — Progress calculators are deterministic
Progress calculators SHALL be pure functions (no clock, randomness or I/O); a cached
progress value is advisory and always recomputable. Measure: unit tests over fixed
inputs.
Applies to: DOM-PRJ
Legacy: NFR-005

### NFR-009 — Local file operations are crash-recoverable and portable
Authoritative file metadata SHALL survive restart and remount; the cache SHALL be
fully rebuildable; absolute device paths SHALL never become identity; canonical
results SHALL be available when the cache is stale or absent. Measure: remount and
cache-parity tests.
Applies to: DOM-PRJ
Legacy: NFR-009

### NFR-017 — Market translation is deterministic and replay-safe
The same immutable raw evidence, payload hash, translation schema and observation type
SHALL resolve to one logical observation, including under concurrent workers (atomic
unique lineage). A translation failure SHALL leave raw evidence unchanged and
replayable. Measure: persistence concurrency test (8 concurrent inserts → 1 row).
Applies to: DOM-MKI, SRV-007
Legacy: NFR-018

### NFR-020 — Asset intake is deterministic and explainable
The same versioned normalized envelope SHALL yield the same validation codes and
depreciation schedule; evidence and candidates remain addressable; previews expose
conflicts/truncation; adapters use bounded timeouts and a provider failure SHALL never
become approval or partial asset truth.
Applies to: DOM-AST
Legacy: NFR-021

### NFR-021 — Evidence execution is bounded
Evidence uploads SHALL be at most 20 MiB and allow-listed by verified content type;
sheet/workbook rows are capped; provider calls have a bounded timeout and strict
output validation; source correlation is payload-hash idempotent; failure never sets
`REVIEWED`/`READY_FOR_REGISTRATION` or leaves an untracked public object.
Applies to: DOM-AST
Legacy: NFR-022

## LINE runtime and activation

### NFR-010 — LINE answers fail closed within a bounded deadline
Every network call on the LINE answer path SHALL have an explicit timeout and
cancellation; duplicate delivery SHALL be idempotent; a provider failure SHALL never
expose secrets or raw data; offline evaluation SHALL be possible through an injected
adapter. Measure: timeout, redelivery and contract tests.
Applies to: DOM-AGT, DOM-LOA, SRV-001, SRV-002, SRV-003
Legacy: NFR-010

### NFR-012 — Activation evidence is deterministic and redacted
Activation evidence SHALL be versioned and reproducible; credentials SHALL come only
from process environment or an approved secret store; reports SHALL contain hashes
and assertion results, never raw authorization material, database URLs, reply tokens
or PII. Measure: contract and secret-scan gates.
Applies to: DOM-AGT
Legacy: NFR-012

### NFR-013 — Binding activation and rollback are atomic and bounded
Activation SHALL lock and compare exact row/version/evidence hashes; one correlation
id SHALL produce at most one state change; activation SHALL expire; rollback SHALL
disable routing before any secondary remediation.
Applies to: DOM-AGT
Legacy: NFR-013

### NFR-014 — Runtime secret resolution is explicit, bounded and redacted
Model/channel secret resolution SHALL be explicit and asynchronous with bounded
timeouts; production SHALL accept only an approved secret-store port (never a local
file vault or raw model credential in env); selection SHALL be binding/Business
scoped; cache entries SHALL be versioned, scoped by Tenant/Business with hard expiry,
and purged on rotation/revocation; provider failure SHALL never trigger implicit
fallback. Measure: contract, failure and security tests.
Applies to: DOM-INT, DOM-AGT
Legacy: NFR-015

### NFR-015 — Integration management is bounded and secret-safe
Integration management UI/API SHALL use trusted Business scope, explicit async
loading/error states, idempotency/version checks and redacted responses; raw secret
material SHALL never cross browser responses, ORM values, logs or audit events; an
unavailable secret manager SHALL never report success.
Applies to: DOM-INT
Legacy: NFR-016

### NFR-016 — End-to-end correlation for LINE ingress
Every inbound batch SHALL carry one correlation id (accepted from a trusted transport
when well-formed, otherwise generated) present on every structured log record, the
HTTP response and the durable audit row of each message produced. Records SHALL be
emitted only through the allowlisted emitter; message text, display names, bearer
tokens, binding ids and reply tokens SHALL never reach a log line; every rejected
batch or failed event SHALL emit a record naming the failing stage.
Applies to: SRV-001, DOM-AGT, DOM-CRM, DOM-INT
Relations: decided_by: ADR-099
Legacy: NFR-017

## Authorization

### NFR-018 — Authorization is recomputed per request and per turn
Identity/authorization decisions SHALL be recomputed from trusted server state on
every request and every agent turn; they SHALL remain correct across restart,
horizontal instances, session revocation and Membership revocation (effective on the
next request/turn); no protected read or write SHALL occur after a deny.
Applies to: DOM-IAM, DOM-AGT
Legacy: NFR-019, NFR-014 (merged: per-turn agent authorization)

## Observability and retention

### NFR-019 — Knowledge ingestion reports per-stage metrics
Each ingestion stage SHALL report `records_in`, `records_out`, `records_failed`,
`records_quarantined`, `processing_time`, `retry_count`; the pipeline SHALL report
ingestion lag, pipeline and publication latency, error rate, quarantine rate, entity
resolution rate and retrieval quality. A stage that reports nothing is a defect.
Status: partial — per-stage counters exist for the isolated 17-stage profile; product
wide aggregates are not all produced.
Applies to: DOM-KNW, SRV-004
Legacy: NFR-020

### NFR-022 — Person-attributed usage data is retained 90 days
Raw usage events carrying a person id SHALL be retained 90 days, then replaced by a
daily `(date, route or action, count)` rollup without person id. Error events carry
no person id. Both are operator-only reads, and the operator view states what is
collected and for how long.
Status: implemented locally; the rollup schedule is an operator step.
Applies to: DOM-PLT
Legacy: NFR-023

## Self-hosted inference (declared)

### NFR-023 — Inference recovery never duplicates business effects
Restarts, node failures, deadline expiry and ambiguous transport outcomes SHALL
preserve fenced attempts, committed tool effects and LINE delivery reconciliation;
automatic whole-turn replay and hidden change of processing authority SHALL NOT
occur.
Status: declared (approved design, not implemented).
Applies to: DOM-AGT
Legacy: NFR-024

### NFR-024 — Inference observations are fresh and bounded
Inference-node observations SHALL carry current configuration identity, explicit age
and provenance, and bounded parsing/labels/storage; stale or absent data SHALL be
treated as unknown; the monitoring UI SHALL NOT be in the routing correctness path.
Status: declared (approved design, not implemented).
Applies to: DOM-AGT
Legacy: NFR-025
