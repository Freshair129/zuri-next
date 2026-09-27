---
id: STD-005
title: Implementation Unit & Packet Standard
status: proposed
version: 0.1.0
owner: governance
relations:
  depends_on: [STD-001, STD-002, STD-003]
  decided_by: [ADR-100]
---

# STD-005 — Implementation Unit & Packet

**Principle: code is produced in units small enough for a narrow worker to finish
alone, and only after the interfaces between units are fixed.** A worker may be a
person, a hosted model or a small local model; the rules are the same. What makes
units assemble is not the worker but the lock on the design and the tests that
prove each acceptance criterion.

The workflow that applies these rules (who does what, in what order, with which
tools) is a procedure, [PROC-001](../procedures/PROC-001-local-multi-agent-implementation.md),
and may change without changing this standard.

## R1 — Units

| Unit | Size | Produced by | Proven by |
|---|---|---|---|
| **Skeleton** | one per feature: components (CMP), exported service signatures, data model, ports, contract adapters as stubs | the Architect role, from the feature's SDD | `validate-docs`; every FR of the feature maps to one component |
| **Packet** | one FR × one layer (`schema` · `service` · `contract` · `ui` · `test`) | one worker, one call | the packet's verification commands |
| **AC test** | one automated test per acceptance criterion, named by the AC id | a worker (layer `test`) | it fails before the behaviour exists and passes after |
| **TC** | the feature-level test bound in `verification.md` | the Architect role, from AC tests | `tests-for` reports it |

Nothing smaller than a packet is planned or tracked. Nothing larger than a
feature is given to a single worker.

## R2 — Interface lock

Before any packet of a feature is issued, its SDD names, for every FR of the
feature: the component (CMP) that owns the behaviour, the exported function or
handler signature, the data it owns or reads, and the API/EVT contract it
exposes or consumes. A packet that would need to change a signature is not
completed: the worker reports `DESIGN_GAP` and the SDD is amended first. An SDD
below the STD-001 minimum cannot issue packets.

## R3 — Packet contents

A packet is a JSON document, produced by `tools/packet.mjs`, and is the only
thing the worker sees. It carries, verbatim from the canonical files:

- the requirement: statement, every acceptance criterion, delivery state;
- the feature: id, title, owner, runtime;
- the design excerpt of the SDD relevant to the FR;
- every API/EVT contract the FR is `specified_by` or the feature `depends_on`;
- every BR/SEC/ADR the FR or feature is `derived_from` or `decided_by`;
- the guard rails (ADR-100, ARCH-001 layering, STD-002 R6 `@trace`, the
  no-secrets rule, the no-refactor rule);
- the TCs that verify the FR;
- the allowed paths the worker may write under, and the current content of
  the files there;
- the output contract (files only, each as a fenced block `path=<relative path>`,
  or a single `DESIGN_GAP.md`);
- the verification commands; and a token estimate.

A packet never carries a secret, a hostname, personal data or a file outside the
allowed paths.

## R4 — Definition of done for a packet

1. Every file the worker returned lies under an allowed path (a path that
   escapes is refused, never moved).
2. Every returned source file starts with `@trace implements <FR>`; every
   returned test with `@trace verifies <AC>`.
3. The packet's verification commands exit 0; for a `test` packet, the tests
   fail on the skeleton and pass once the matching `service` packet is applied.
4. `validate-docs` still reports 0 errors and 0 warnings.
5. A run record exists (R6).

Style, naming beyond the SDD, and refactoring outside the allowed paths are not
review criteria for a packet.

## R5 — Order and exclusivity

- Foundation domains first (DOM-PRJ scope chain, DOM-IAM viewer gate), then
  features in `depends_on` order; `tools/impact.mjs` gives the dependents.
- Within a feature: FRs ascending; for each FR the `test` layer before the
  `service` layer (test-first), then `contract`, then `ui`; `schema` packets
  precede the first `service` packet that needs them.
- Two packets never write the same component at the same time. A queue stops
  at the first failed packet; continuing is an explicit choice.

## R6 — Evidence

Every packet run leaves a record: packet id, FR, layer, model (or person),
prompt hash, files returned, files refused and why, verification results,
timestamps. The record is lineage for the feature's TC, not a log: it is kept
where the runner keeps its data, never inside the specification repository,
and is cited from `verification.md` when a TC is bound to the test it produced.

## R7 — Escalation

A worker escalates, and a packet is not retried blindly, when: the SDD does not
give a needed signature (`DESIGN_GAP`); an acceptance criterion cannot be
turned into a test as written (ambiguous AC → the FR is revised, STD-003 R7);
verification fails twice on the same packet. Escalation goes to the Architect
role, which changes the design or the requirement, never the packet.
