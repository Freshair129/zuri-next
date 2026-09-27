---
title: Governance decisions
status: draft
owner: governance
legacy: [ADR-001, ADR-002, ADR-003, ADR-004, ADR-005, ADR-009, ADR-024, ADR-025, ADR-039, ADR-051, ADR-081]
---

# Governance decisions

Process decisions for this repository. ADR-101..105 carry forward the durable ideas
of the previous repository's governance ADRs (the rest are crosswalked as retired or
dropped in `registry/crosswalk/GOV.csv`); ADR-106 records how this repository itself
was founded and amends ADR-102 and ADR-103 where the new structure differs. The
standards (STD-001..004) are the rule text; these records say why.

### ADR-101 — The product is standalone; legacy vocabulary and IDs are provenance only
**Status:** approved
**Context:** The legacy repository described this product as "V2" of another product
and planned module lifts and tenant cutovers that never happened. That framing kept
re-appearing as instructions.
**Decision:**
- Zuri is a standalone product; it does not replace, extend or migrate any other
  product, and no other product's repository is modified from here.
- Legacy identifiers (FR-xxx, ADR-xxx, ZV2-CR-xxx, FEAT-xxx …) survive only in
  `legacy:` fields and `registry/crosswalk/`; they are keys for provenance, never
  vocabulary for new work and never renamed.
- Historical records are stamped (superseded/retired), not rewritten.
- A prior system's schema MAY be read as prior art when designing a new domain;
  ancestry is never claimed.
**Consequences:** the blueprint contains no migration or parity work; words such as
"V1/V2", "cutover", "lift" in legacy sources are labels, not instructions.
Legacy: ADR-024 (D1–D4, D7); supersedes the intent of ADR-001, ADR-002, ADR-003, ADR-005

### ADR-102 — Generated views and the trace graph are build outputs
**Status:** approved
**Context:** Hand-written indexes drift from their sources; committed generated files
conflicted on most merges and hid staleness.
**Decision:**
- Feature maps, domain maps, trace matrices, link indexes and the relation graph are
  generated from authored files (IDs, frontmatter, headings, `@trace` tags) and are
  never hand-edited or committed.
- CI regenerates them before anything reads them and fails on validation errors
  (STD-002 R8); a regenerate-and-compare step checks that generators are reproducible.
- A generated file may be committed only when a build constraint requires it (e.g. a
  runtime artefact the container build cannot regenerate), with that reason recorded.
- The graph is an index derived from files; nothing writes to it except the indexer.
**Consequences:** reviewers read authored sources; a CI artefact serves readers without
a checkout.
Legacy: ADR-081, ADR-004 D5, ADR-009 D2–D3

### ADR-103 — Every model has one owning domain, and the lane exists before the code
**Status:** approved
**Context:** Without machine-checked ownership, two lanes (human or agent) write the same
table and nobody owns its lifecycle.
**Decision:**
- Every persisted model, route family and module is claimed by exactly one domain
  (the domain `README.md` owned data; see ADR-106); a second claim or an unclaimed module fails CI.
- A domain may write only data it owns; other domains go through its API/EVT contracts
  (STD-001 R4). Known shared-write exceptions are recorded as debt in the owning domain,
  not hidden.
- A new domain gets its `DOMAIN.md` before its first feature lands.
- An FR is a precise behavior; a FEAT is a product capability that bundles FRs; the two
  ID families are never conflated.
**Consequences:** assigning work is one pointer (a domain folder); ownership collisions
surface as CI failures rather than incidents.
Legacy: ADR-025 (D1–D4, D10–D11), ADR-004 D3–D4

### ADR-104 — Identifiers are keys whose subject is pinned
**Status:** approved
**Context:** Requirement rows are long prose edited often; renumbering or silently
repurposing an ID breaks every plan, test and annotation keyed on it, and exact-text
hashing produced mostly false alarms.
**Decision:**
- IDs are never renumbered, reused or recycled; retiring keeps the number burnt
  (STD-002 R3).
- A ledger pins each declared ID's subject anchor (the leading phrase of its title/
  statement, normalized). CI fails when an anchor moves, when a new ID takes over an
  existing anchor, or when a pinned ID disappears without a retirement record.
- Rewording is free; changing meaning is retire + new ID with `supersedes`.
- Only an explicit, human-run command writes the ledger; the validation gate never
  writes it.
**Consequences:** a meaning change is always visible as a new ID in review.
Legacy: ADR-039, ADR-004 D9, ADR-024 D4

### ADR-105 — Every writing lane works in its own worktree; shared runtime is shared
**Status:** approved
**Context:** Several concurrent sessions sharing one checkout lost uncommitted work
(stash/reset) and moved each other's branches; runtime resources (containers, volumes)
were deleted while in use.
**Decision:**
- The primary checkout is a read-only reference (detached at the main line); every lane
  that writes creates its own worktree. Refreshing the primary is the one sanctioned
  mutation and only on a clean tree.
- A lane that runs tests has its own dependency install; a shared install is only for
  documentation-only lanes.
- Runtime resources are not isolated by git: the deployment's container project is
  global per host. Before deleting a shared resource (worktree, container, volume,
  disk image), check who is using it, not whether it is tidy.
- An invariant enforced by construction carries a written reason next to the construct,
  so a later change does not "fix" it away.
**Consequences:** tooling hooks may deny writing git commands in the primary; they are
defence in depth, not a replacement for the rule.
Legacy: ADR-051

### ADR-106 — The next system starts from a specification repository with opaque IDs and one canonical location per artifact
Relations: relates_to: ADR-102, ADR-103, ADR-104
**Status:** approved (owner, 2026-09-27)
**Context:** The previous repository accumulated a document system shaped by its
history: requirement IDs in one registry file, features nested under the domain that
happened to own them, IDs that could not say which domain or part they belonged to,
and relations spread across annotations and prose. A new repository was chosen so
the next system could start from an explicit specification instead of inheriting
that shape. The specification had to be derived from what the running system
actually does, not from what its documents claimed.
**Decision:**
- **D1 — Specification first, derived from code.** The repository starts from a
  specification of the zuri-ai system at commit `9e5b104e`, derived from its code,
  tests and documents. Where documents and code disagreed, the specification follows
  the code and records the difference as an open issue (D8).
- **D2 — One canonical location; everything else is a view.** Every feature, domain
  or cross-domain, lives in `docs/features/<ID>-<slug>/`. A domain folder defines the
  domain and carries a generated index of what it owns and where it participates.
  Ownership and participation are metadata (`owner`, `type`, `participants`), never
  folder position (STD-003).
- **D3 — Opaque IDs.** An ID is type + number (+ container number): `FEAT-042`,
  `FR-042-003`, `ADR-017`. It never encodes a domain, owner, scope or name, so none of
  those changes can force a rename. Domains are the one exception: `DOM-CRM` is the
  domain's identity and its code is frozen (STD-002 R1, R3).
- **D4 — One requirement per file.** Each FR and NFR is its own file with its
  acceptance criteria inside, so a requirement has a stable locator, its own history
  and its own review.
- **D5 — A small relation vocabulary.** Relations are written only where they cannot
  be inferred from the ID, in frontmatter, `Relations:` lines or `@trace` code tags,
  using the fourteen names of STD-002 R4. Embeddings are discovery, never evidence.
- **D6 — The engineering graph is a rebuildable SQL index.** Documents write prefixed
  IDs; the index joins on integer keys and is rebuilt from a git revision (STD-004).
- **D7 — Legacy IDs are provenance only.** Previous IDs appear only in `legacy:`
  fields and `registry/crosswalk/`; every one of the 647 is accounted for.
- **D8 — The repository is public; weaknesses are not.** The specification states
  what the system SHALL do and may be read by anyone. Differences between it and the
  running code, and anything describing an unfixed weakness in a running system, are
  kept out of every committed file and out of git history: they live in `private/`
  (gitignored) or a private tracker, and a feature's *Open issues* section holds only
  a pointer. A contract describes the behavior the specification requires, never a
  weaker behavior the current code happens to have.
- **Amends ADR-102:** the generated feature index inside each domain `README.md` *is*
  committed, because a reader browsing the repository must see it without a build.
  It stays machine-owned: only `tools/generate-views.mjs` writes it, and
  `generate-views --check` fails when it is stale. All other views stay uncommitted.
- **Amends ADR-103:** a domain is defined by `docs/domains/<slug>/README.md` (not
  `DOMAIN.md`), and assigning work is a pointer to a feature folder or a domain, not
  a domain folder that contains features.
**Alternatives rejected:**
- Domain-coded IDs (`FR-<domain>-<feature>-<n>`): moving ownership would force a rename.
- An `X`/`XFEAT` namespace for cross-domain features: a feature that becomes
  cross-domain later would have to change its ID.
- Bare numbers in documents (`042`): not self-describing and not searchable.
- Features stored under their owning domain: a participating domain cannot find them.
- Relations stored only in a database: not reviewable and not rebuildable from git.
- A private repository: first chosen, then reversed by the owner (2026-09-27) in
  favor of a public specification with the weakness backlog kept outside it.
**Consequences:**
- The validator (`tools/validate-docs.mjs`) is the gate: zero errors is required.
- The subject-anchor ledger of ADR-104 is not implemented here yet; until it is,
  reviewers enforce "retire, don't repurpose" by hand.
- Code arriving in this repository annotates its boundaries with `@trace` from the
  first commit (STD-002 R6).
