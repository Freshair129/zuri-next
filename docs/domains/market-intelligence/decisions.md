# Decisions — Market Intelligence

### ADR-081 — Market Intelligence is a first-class domain, boundary with Integration/Knowledge/Procurement
Owner: DOM-MKI
**Status:** Accepted (architecture boundary; runtime implementation gated behind approved requirement IDs).

**Context:** Zuri needs to observe external markets (listings, prices, promotions,
availability, supplier candidates, competitor changes, demand/category signals) without
duplicating Integration's raw-ingestion ownership, Knowledge/GKS's canonical identity
authority, or Commerce/Procurement's purchasing execution. Two rejected decompositions
(a domain per source; one module owning acquisition + canonical knowledge + purchasing)
both violate existing boundaries.

**Decision:**
- Market Intelligence is one first-class Business capability domain (`DOM-MKI`), a peer
  of Commerce, CRM, Marketing — not six separate domains for its six intelligence
  families (Price/Demand/Supplier/Competitive/Category Intelligence, Market Research).
- Integration keeps sole ownership of raw acquisition/ingestion/credentials/cursors;
  Market Intelligence consumes eligible raw records through a translation contract only
  and never stands up a second ingestion stack.
- Market Intelligence owns translated observations and derived signals
  (`MarketObservation` and future candidate concepts); Knowledge/GKS remains canonical
  identity authority — an unresolved candidate is a valid terminal state.
- "Supplier Intelligence" (who appears able to supply, at what observed terms) stays
  here; "Procurement Intelligence" (what we should buy, given inventory/demand/policy)
  stays under Procurement and consumes this domain's read contracts.
- A worker process may execute long-running translation/polling work but is an
  execution topology, not a separate service, absent a real operational trigger.

**Consequences:**
- A market-facing intelligence lane exists without introducing microservices per
  source; existing Integration/Knowledge investment is reused rather than duplicated.
- Source failures degrade market freshness without affecting CRM/Commerce/Projects.
- Runtime navigation and routes stay disabled until an implementation requirement
  makes each one truthful — not authorized by architecture alone.

Legacy: ADR-038

### ADR-082 — Market Intelligence service extraction on the ownership trigger
Owner: DOM-MKI
**Status:** Approved for local implementation (2026-09-24); production cutover, the
core façade routes, the restricted database role and CI wiring are separate, later,
operator-gated steps not authorized by this decision alone.

**Context:** ADR-081 permits extracting Market off the in-process module only for a
real operational trigger (independent load, deployment cadence, security/compliance,
availability, ownership). The owner chose **ownership**: one team-owned process should
be the sole writer of Market-owned state and sole executor of Market logic. A pure
Market core already exists in `services/market-intelligence/`, kept behavior-equal to
the legacy module by shared golden vectors (M1).

**Decision:**
- Persistence is one port (`ObservationStore`) with a Postgres adapter (production) and
  a `node:sqlite` adapter (local/test only), both proven against one conformance suite
  (replay idempotency, exact UTC timestamps, scope refusal, concurrent-insert races,
  restart durability). No Prisma inside the service.
- During transition the service uses the *same* Postgres table with a restricted role
  (`SELECT, INSERT` only, no `UPDATE`/`DELETE`, no other table) applied later by an
  operator — ownership is declared before it is enforced; the legacy Prisma writer keeps
  writing until cutover.
- Core stays the only identity/authority root: the service authenticates to core's
  private façade and never resolves a viewer itself or stores the subject.
- Single-writer routing is gated twice: a per-deployment `MARKET_EXECUTOR` flag
  (default `legacy`) on the two Market routes, AND the service's own refusal
  (409 `MARKET_NOT_EXECUTION_OWNER`) unless core confirms execution ownership.
- Failure semantics are explicit: core-unreachable is 503 `CORE_UNAVAILABLE` on both
  reads and writes with no cached/stale fallback; observations commit before the audit
  event, and an audit-phase failure is a distinguishable, logged 503, never a silent
  loss; `insertIfAbsent` is the only concurrency boundary (no advisory locks).
- No new requirement IDs are declared: the service changes *where* FR-088-001, FR-088-002, FR-088-003 executes, not
  what it does; existing FR-088-001, FR-088-002, FR-088-003/NFR-018/SDD-049/SEC-017 annotations carry over.

**Consequences:**
- Ownership can be enforced without a data migration, backfill or schema split — same
  table, same IDs, same lineage key.
- Introduces a second production writer path that must be gated twice before cutover;
  until `MARKET_EXECUTOR=service` and core confirms execution ownership, this ADR
  changes nothing observable in production.
- Any reversal of the M2 scoping decisions here is an amendment to this ADR, not a
  silent change.

Legacy: ADR-108
