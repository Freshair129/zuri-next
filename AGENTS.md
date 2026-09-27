# AGENTS.md — how to work in zuri-next

Rules for every contributor, human or agent. The standards in
`docs/governance/standards/` are the rule text; this file says how to apply them.
When the two disagree, the standard wins and this file is corrected.
[CLAUDE.md](CLAUDE.md) is the one-page summary.

## 1. Orientation

1. Read STD-001..004, then `docs/README.md`.
2. **Find by ID before you search by words** (STD-002 R9): exact ID → the file that
   declares it → its relations → code search → full-text. Similarity search is a lead,
   never evidence. Every claim you make cites an ID and a path.
3. The folder tree is a projection. Who owns what is in metadata
   (`owner`, `type`, `participants`); never infer it from a folder.

## 2. Lanes (parallel work)

- **A lane is one feature folder, or one domain's definition files** (`README.md`,
  `decisions.md`, `contracts.md`). Say which lane you hold before you write.
- Write only inside your lane. To change something another lane owns, name it in
  your feature's *Open issues* or a `depends_on` relation, and leave the edit to that
  lane's owner.
- **Shared files need an explicit instruction from the owner:** `docs/governance/**`,
  `docs/architecture/**`, `docs/product/**`, `registry/**`, `tools/**`, `CLAUDE.md`,
  `AGENTS.md`.
- A cross-domain feature has one feature owner; each part is edited by, or with the
  agreement of, that part's owning domain.
- **Allocating numbers is where parallel lanes collide.** Take `max + 1` from `main` at
  the moment you declare. If CI reports a duplicate, the branch that merges later
  renumbers before merging.
- Each writing lane works in its own branch and worktree (ADR-105). Do not delegate
  a lane to sub-agents unless asked. If you do delegate, write your own results to
  disk as you go so that work is never lost when a helper stops.

## 3. Workflows

Each workflow ends with `node tools/generate-views.mjs` and
`node tools/validate-docs.mjs` (0 errors).

| Task | Do | Never |
|---|---|---|
| **New domain** | Add the code to `registry/domains.yaml` → `docs/domains/<slug>/README.md` (purpose, language, owned data, rules, contracts) → record why in an ADR if it splits an existing domain | Create a domain folder before the code is registered, or reuse a retired code |
| **New feature** | Next `FEAT-nnn` → `docs/features/FEAT-nnn-<slug>/feature.md` from `docs/templates/feature.md.template` → `requirements/`, `design.md`, `verification.md` | Put it under a domain folder |
| **New requirement** | Next number in the feature → `requirements/FR-<f>-<nnn>-<slug>.md` from `requirement.md.template` → ≥1 AC | Two requirements in one file; a requirement without an AC |
| **Cross-domain feature** | `type: cross-domain-feature`, `participants` (domain, part, role), `parts/Pnn-<domain>.md`; each cross-domain FR names its `part` and `owner` | Copy the feature into each domain |
| **Decision** | Owned by one domain → that domain's `decisions.md`. System-wide → `docs/architecture/decisions.md`. Process → `docs/governance/decisions.md`. Heading `### ADR-nnn — …`, then `Owner:`, Status, Context, Decision, Alternatives, Consequences | Embed a decision inside a feature file |
| **Contract** | The owning domain's `contracts.md`: `### API-nnn — …` or `### EVT-nnn — …` with method/path or event name, auth, request/response, errors, `Implements:` | Declare one contract under several IDs in a single heading |
| **Transfer ownership** | Edit `owner` or the `participants` entry; add an ADR if the domain boundary moves | Rename the ID or move files to "match" |
| **Part becomes a feature** | Only when STD-001 R3 holds: new FEAT, new FRs with `supersedes`, retire the part | Keep the old FR IDs under the new feature |
| **Retire** | `delivery: retired` + a reason line; the file stays | Delete the file or reuse the number |
| **Change a requirement's meaning** | Retire it; declare a new FR with `supersedes` | Edit the statement into a different behavior |

## 4. Writing requirements

- One behavior per FR, stated as **"The system SHALL …"**. An NFR is measurable and
  says how it is measured.
- Acceptance criteria are `Given … when … then …`, specific enough to write a test from.
- Two separate fields: `status` records the document's state (`draft → proposed →
  approved → superseded | retired`) and `delivery` records the behavior's state
  (`declared → building → implemented → live → retired`).
- `delivery` is evidence-based. Mark a requirement `implemented` or `live` only when
  code exists, and at least one TC binds it to a real test.
- When the specification and the code disagree, the specification says what the
  system **should** do, and the gap goes in `private/open-issues/<feature-folder>.md`
  with the path you read. That folder is gitignored because this repository is public
  (ADR-106 D8): never write a gap or weakness into a committed file, a commit message
  or a pull request. Do not quietly adjust either the specification or the code to
  match the other.

## 5. Relations and annotations

- Vocabulary (STD-002 R4): `part_of`, `owned_by`, `runtime`, `participates_in`,
  `derived_from`, `depends_on`, `decided_by`, `specified_by`, `implements`, `verifies`,
  `exposes`, `consumes`, `supersedes`, `relates_to`. There are no other relation names.
- `part_of` is inferred from the ID and `participates_in` from the parts, so never
  write either one. `relates_to` is for navigation only and never counts as evidence.
- Code annotates **boundaries only**: service entrypoints, API handlers, domain use
  cases, core algorithms, migrations and critical tests.

  ```js
  /** @trace implements FR-042-003 */
  export async function resolveTenant(channel) { … }
  // @trace verifies FR-042-003, AC-042-003-01
  ```

  Do not use JSDoc `@implements` for this, because it already means something else.
  Do not annotate helpers or formatters.

## 6. The previous system (zuri-ai)

- zuri-ai is read-only prior art. Read it to learn how something works, but never
  write to it from this repository.
- Its IDs appear here only as `legacy:<ID>` or in `legacy: [...]` frontmatter. Look
  one up in `registry/crosswalk/*.csv`, and never use a bare legacy ID in prose,
  because `FEAT-009` means something different in each repository.
- When porting behavior, port what its **code** does and cite the path you read.

## 7. Testing one part at a time

Check and test only what you touched while you work. Run the full checks once,
before you merge.

**Documentation: `validate-docs --scope`.** The tool still reads the whole tree, so
references outside the scope resolve. It reports and fails only on findings inside
the scope.

| Scope | Covers |
|---|---|
| `--scope FEAT-042` (or `FR-042-003`, `AC-…`, `TC-…`, `SDD-042`) | that feature's folder |
| `--scope DOM-CRM` | the domain's folder, plus every feature it owns or participates in |
| `--scope docs/architecture` (any path under `docs/`) | that file or folder |

```bash
node tools/validate-docs.mjs --scope FEAT-042
node tools/validate-docs.mjs --scope DOM-CRM --scope FEAT-095   # repeatable
```

**Code: `tests-for`.** `tests-for` lists the test cases and test files that prove an ID,
then prints the command that runs only those tests. It reads two sources: each
feature's `verification.md` (`Verifies:` plus `Test:`) and `@trace verifies` tags in code.

```bash
node tools/tests-for.mjs FR-042-003      # TCs that verify the FR or any of its ACs
node tools/tests-for.mjs AC-042-003-01   # TCs that verify that AC; falls back to its FR
node tools/tests-for.mjs FEAT-042        # every TC of the feature
node tools/tests-for.mjs DOM-CRM         # every TC of the features CRM owns or participates in
node tools/tests-for.mjs FR-042-003 --json
```

The output separates two kinds of test file:
- Test files that exist in this repository. It prints the command to run them here,
  e.g. `npx vitest run …`.
- Test files bound to the zuri-ai tree the specification was derived from. It prints
  the command to run them in a zuri-ai checkout, e.g.
  `npm --prefix apps/server exec -- vitest run tests/…`. Use these to confirm what the
  current system does before you port a behavior.

The command exits with code 1 when nothing verifies the ID. That means the
requirement has no proof yet: add a TC before you mark it `implemented`.

**While porting a feature, work in this order:**
1. `tests-for FEAT-nnn` to see the legacy tests.
2. Write this repository's tests with `@trace verifies`.
3. Run `tests-for FEAT-nnn` again. The new tests appear under "Run here".
4. `validate-docs --scope FEAT-nnn`.
5. Before merging, the full `validate-docs` and `generate-views --check`.

## 8. Review checklist

- [ ] `validate-docs` reports 0 errors and the warning count did not grow.
- [ ] `generate-views --check` passes.
- [ ] `node tools/impact.mjs --changed` was run and every listed document was re-read for a
      statement the change invalidates (ARCH, PRD, STD and domain READMEs first).
- [ ] Every new ID is declared exactly once, and no ID was renumbered or reused.
- [ ] Each FR has ACs. Every FR marked implemented or live has a TC with a real test path.
- [ ] Owners and participants are set, and no feature sits under a domain folder.
- [ ] Every cross-domain write goes through a declared API or EVT.
- [ ] No secrets, credentials, personal data, hostnames or IP addresses.
- [ ] No committed file, commit message or PR text describes an unfixed weakness or a
      spec-vs-code gap; those are in `private/`.

## 9. Known open items at founding

`validate-docs` reports 0 errors and 0 warnings. Keep it there: a new warning is a
review blocker (§8).

The gaps between the specification and the zuri-ai code it was derived from are in
`private/open-issues/` on the owner's machine, one file per feature. Treat that list as
the backlog. Do not treat it as proof that the behavior is correct.
