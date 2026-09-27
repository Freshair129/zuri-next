# CLAUDE.md — working guide for zuri-next

Read this first, then [AGENTS.md](AGENTS.md) for the full rules. This file is the
short version: what the repository is, what to read, what to run, what never to do.

## What this repository is

**zuri-next** is the next-generation zuri system. Right now it contains its
**specification only** — no application code yet. The specification was derived
from the zuri-ai repository (commit `9e5b104e`) and describes what that system does,
rewritten in this repository's document structure
([ADR-106](docs/governance/decisions.md)).

## Hard rules

| Rule | Why |
|---|---|
| **This repository is public. Never commit a description of an unfixed weakness or a spec-vs-code gap.** Put it in `private/open-issues/<feature-folder>.md` (gitignored); *Open issues* in `feature.md` holds only the pointer | Anyone can read the history, and a commit cannot be taken back (ADR-106 D8) |
| **Never write to the zuri-ai repository from here.** It is read-only prior art | It is a different, public repository with its own governance |
| **IDs are never renumbered, reused or repurposed.** Retire and declare a new ID with `supersedes` | Plans, tests and code annotations key on IDs (ADR-104) |
| **One artifact, one canonical file.** Never copy content; link to the ID | Copies drift (STD-003) |
| **Never hand-edit a generated block.** The domain feature index is written only by `tools/generate-views.mjs` | ADR-106 amends ADR-102 |
| **No secrets, credentials or personal data in any file.** Configuration is named, never valued | Runbooks and service docs describe settings by name only |

## Read before working

1. [`docs/governance/standards/`](docs/governance/standards/): STD-001 (artifact types, hierarchy, ownership),
   STD-002 (IDs and relations), STD-003 (where things live, how to change the structure),
   STD-004 (the SQL graph).
2. [`docs/README.md`](docs/README.md): the map and the reading order.
3. For a task in one area: the domain's `docs/domains/<slug>/README.md`, then the feature
   folder `docs/features/<FEAT-ID>-<slug>/`.

## IDs in one screen

```
FEAT-042        feature (domain-owned or cross-domain — the ID does not say which)
FEAT-042-P02    part 2 of a cross-domain feature
FR-042-003      requirement 3 of FEAT-042      → docs/features/FEAT-042-*/requirements/FR-042-003-*.md
NFR-042-001     feature NFR · NFR-007 system NFR
AC-042-003-01   acceptance criterion (a list item inside the FR file)
TC-042-012      test case (heading in the feature's verification.md)
SDD-042         the feature's design.md
ADR-017 · API-031 · EVT-002 · BR-008 · SEC-004 · CMP-120 · SRV-001 · RB-005
DOM-CRM         domain — the only ID that carries a name; its code is frozen
legacy:FR-252   an ID from zuri-ai — look it up in registry/crosswalk/
```

A new number is `max + 1` of its type on `main` (per feature for FR/NFR/AC/TC).
Titles and folder slugs are names: change them freely.

## Commands

```bash
node tools/validate-docs.mjs                     # STD-002 R8 over everything: must report ERRORS 0
node tools/validate-docs.mjs --scope FEAT-042    # only the part you touched (FEAT/FR/DOM/path; repeatable)
node tools/tests-for.mjs FR-042-003              # which tests prove it, and the command that runs only those
node tools/generate-views.mjs                    # rewrite the domain feature indexes
node tools/generate-views.mjs --check            # fails when an index is stale
node tools/impact.mjs FEAT-042                   # every document that references it + transitive dependents
node tools/impact.mjs --changed                  # ids whose declaration you changed, and the documents to review
node tools/spec-tree.mjs                         # rewrite docs/governance/plans/spec-tree.json (graph views)
node tools/sitemap.mjs                           # rewrite docs/governance/plans/sitemap.json (navigation map; run after spec-tree)
node tools/pipeline-map.mjs                      # validate registry/pipeline.yaml and rewrite docs/governance/plans/pipeline.json
node tools/readiness.mjs FEAT-042                # can this feature issue packets? gates G1–G8 (PROC-001 step 1); --all for a summary
node tools/packet.mjs FR-042-003 --layer service # one implementation packet (STD-005); --queue FEAT-042 for a whole feature
```

Packets are run by RWANG Forge (`pnpm forge …` in rwang-local-assistant) against a local
model; the workflow is [PROC-001](docs/governance/procedures/PROC-001-local-multi-agent-implementation.md).

Before opening a pull request run `impact --changed`: every file it lists is one to
re-read for a statement the change invalidates.

Use `--scope` and `tests-for` while working; run the full checks once before
merging. Details: [AGENTS.md §7](AGENTS.md#7-testing-one-part-at-a-time).

Node.js 22+; the tools use only the standard library. There is no install step.

## Definition of done (documentation change)

1. `validate-docs` reports **0 errors and 0 warnings**.
2. `generate-views --check` passes (run `generate-views` and commit if not).
3. Every new FR has at least one AC; every implemented FR has a TC bound to a test.
4. Relative links resolve; nothing links into zuri-ai as if it were part of this repository.

## Git

- `main` is protected by habit: work on a branch, open a pull request.
- Commit messages: `docs(<area>): …`, `feat(<domain>): …`, `fix(<domain>): …`.
- Line endings are LF (`.gitattributes`); do not commit CRLF.
