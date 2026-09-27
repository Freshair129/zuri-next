# zuri-ai — System Specification Blueprint

This folder is the specification of the system, written in the document
structure defined by the standards in `governance/standards/`. Hand-maintained
metadata lives in `../registry/` and the tooling in `../tools/`.

It was derived from the zuri-ai repository at commit `9e5b104e` — from its code,
tests, PRD, feature registry, domain charters and ADRs — and describes what the
system **does today**: every requirement is traced to current code and tests,
or marked `declared` / `building` when it is not built yet. Where the old
documents and the code disagreed, the blueprint follows the code and records the
difference under *Open issues* in the feature.

## How it is organised

| Folder | Holds | Governed by |
|---|---|---|
| `product/` | `BRD-001` business requirements, `PRD-001` product requirements, glossary | STD-001 |
| `architecture/` | `ARCH-001` system overview, system-wide decisions, system business rules / NFRs / security requirements | STD-001, STD-003 R1 |
| `domains/<slug>/` | one folder per domain: `README.md` (definition + **generated** feature index), `decisions.md`, `contracts.md` | STD-003 R2 |
| `features/<FEAT-ID>-<slug>/` | **every** feature, domain-owned or cross-domain: `feature.md`, `requirements/` (one FR or NFR per file), `parts/` (cross-domain only), `design.md`, `verification.md` | STD-003 R3 |
| `services/<SRV-ID>-<slug>/` | one folder per deployable | STD-003 R4 |
| `operations/` | runbooks | STD-001 |
| `governance/` | the standards themselves, governance decisions | — |
| `templates/` | one template per artifact type | — |

The folder tree is only one view. Ownership and participation live in each
feature's metadata (`owner`, `type: cross-domain-feature`, `participants`), and
each domain's feature index is generated from it — nothing is copied.

## IDs

An ID is the artifact type plus a number, never a domain or a name
([STD-002](governance/standards/STD-002-IDENTITY-AND-TRACEABILITY.md)):

```
FEAT-042            feature                FR-042-003      requirement 3 of FEAT-042
FEAT-042-P02        part 2 of FEAT-042     AC-042-003-01   acceptance criterion 1 of FR-042-003
NFR-042-001 / NFR-007  feature / system NFR   TC-042-012   test case of FEAT-042
SDD-042             design of FEAT-042     ADR-017 · API-031 · BR-008 · SRV-001 · RB-005
DOM-CRM             domain (the code is the domain's identity and is frozen)
```

Titles and folder names are names: change them freely, the ID stays. Old IDs
from the previous repository appear only in `legacy:` fields and in
`registry/crosswalk/`; look one up there to find where it went.

## Reading order

1. `governance/standards/` — STD-001 (artifact types, hierarchy, ownership),
   STD-002 (IDs and relations), STD-003 (structure), STD-004 (SQL graph schema).
2. `product/BRD-001-*.md` → `product/PRD-001-product.md` → `product/GLOSSARY.md`.
3. `architecture/ARCH-001-system-overview.md` → `architecture/decisions.md` →
   `architecture/requirements/`.
4. The domain you work in: `domains/<slug>/README.md`, then its decisions and contracts.
5. A feature: `features/<FEAT-ID>-*/feature.md` → `requirements/` → `design.md` →
   `verification.md`.
6. `services/` and `operations/` for runtime and operations.

## Size (at derivation)

| Artifact | Count | Artifact | Count |
|---|---|---|---|
| Domains | 14 | Features (7 cross-domain) | 97 |
| Feature parts | 35 | Functional requirements | 411 |
| Non-functional requirements | 101 | Acceptance criteria | 961 |
| Test cases | 348 | Decisions (ADR) | 105 |
| API contracts | 261 | Components | 287 |
| Business rules | 89 | Security requirements | 35 |
| Services | 9 | Runbooks | 5 |
| Legacy IDs crosswalked | 647 (all but FR-090, which has no behavior) | | |

## Checking and regenerating

```bash
node tools/generate-views.mjs   # rewrite each domain's generated feature index
node tools/validate-docs.mjs     # STD-002 R8 checks; exits 1 on any error
```

`tools/graph-schema.sql` + `tools/graph-seed.sql` are the SQL index (STD-004).
`tools/migration/` holds the one-time scripts that produced this tree; they ran
against the pre-move layout and are kept only as a record.

## Known open items

- `API-265` and `API-266` (FEAT-097, self-hosted inference) are declared but not
  implemented, as are FR-025-004 (Google sign-in) and FR-063-002 (ladder quotation).
- Gaps between this specification and the zuri-ai code are tracked outside
  this repository (ADR-106 D8).
