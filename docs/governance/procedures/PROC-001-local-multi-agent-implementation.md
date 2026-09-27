---
id: PROC-001
title: Local multi-agent implementation workflow
status: proposed
version: 0.1.0
owner: governance
relations:
  depends_on: [STD-005, STD-002]
  decided_by: [ADR-100]
---

# PROC-001 — Local multi-agent implementation workflow

How a feature of this specification is turned into code by an orchestrating model
plus small local models, under the rules of [STD-005](../standards/STD-005-IMPLEMENTATION-UNIT-AND-PACKET.md).
The standard fixes what must hold; this procedure fixes who does it and with
which commands, and is expected to change as tools change.

## Roles

| Role | Runs on | Does | Never |
|---|---|---|---|
| **Architect** | Claude Code or Codex CLI (large model), or a person | reads the SDD, writes the feature skeleton and locks every signature (STD-005 R2); decides escalations (R7); binds TCs in `verification.md` | writes packet bodies |
| **Tester** | local model via RWANG Forge | one `test` packet: one test per AC | reads anything outside the packet |
| **Coder** | local model via RWANG Forge | one `service` / `contract` / `ui` / `schema` packet | changes a signature; touches files outside allowed paths |
| **Gate** | tools, not a model | `forge` path guard, `@trace` check, verification commands, `validate-docs`, `impact --changed` | judges style |

Model access goes through one gateway (LiteLLM, or Ollama directly) so every
packet run is logged once with model, prompt hash and result (STD-005 R6).

## Tools

| Repository | Command | Purpose |
|---|---|---|
| this one | `node tools/packet.mjs FR-042-003 --layer service` | build one packet (R3) |
| this one | `node tools/packet.mjs --queue FEAT-042 --layers test,service --out-dir .packets/FEAT-042` | every packet of a feature in R5 order plus `queue.json` |
| this one | `node tools/impact.mjs FEAT-042` · `node tools/tests-for.mjs FR-042-003` | dependents; TC bindings |
| rwang-local-assistant | `pnpm forge models` | which local models are loaded |
| rwang-local-assistant | `pnpm forge estimate <packet>` | does the packet fit the model's context (≤ 75 % of `--num-ctx`) |
| rwang-local-assistant | `pnpm forge run <packet> --model <m> [--apply]` | one worker call; staged under RWANG's data directory; `--apply` writes into `RWANG_WORKSPACE_DIR` and runs the packet's verification |
| rwang-local-assistant | `pnpm forge queue <queue.json> --model <m> --apply` | the feature's packets in order; stops at the first failure (R5) |

`RWANG_WORKSPACE_DIR` points at the code repository the packets target. The
specification repository is never the workspace.

## Steps

1. **Choose the feature.** Approved status, SDD at the STD-001 minimum, AC
   coverage complete (`tests-for`). Foundation features first (R5).
2. **Architect: skeleton.** From the SDD, create the components, exported
   signatures (throwing `NotImplemented`), data model and contract stubs in the
   workspace; commit them. Every FR now has a home; nothing behaves yet.
3. **Build the queue.** `packet.mjs --queue FEAT-nnn --layers test,service`
   (add `schema`, `contract`, `ui` as the feature needs). Check every
   `token_estimate` with `forge estimate`; split an FR whose packet does not
   fit (STD-003 R7: retire, declare two FRs with `supersedes`) rather than
   trimming the packet.
4. **Run the queue.** `forge queue … --apply`. Per packet the gate runs
   automatically: path guard → `@trace` → verification commands. A `test`
   packet must fail on the skeleton; the following `service` packet must make
   it pass.
5. **On a stop.** `design_gap` → Architect amends the SDD (bump version), rebuild
   that FR's packets, resume. `failed` twice → Architect reads the run record
   and the reply, fixes the design or the requirement, never the packet by hand.
   `no_files` or refused paths → usually a model that ignored the output
   contract; try a stronger model before touching the packet.
6. **Close the feature.** Architect binds each TC in `verification.md` to the
   test files the `test` packets produced, citing the run record ids; runs
   `validate-docs`, `generate-views --check`, `impact --changed`; opens the
   pull request in the code repository with the spec commit it implements.

## Defaults for local models

- Runner: RWANG Forge over Ollama (`OLLAMA_URL`), `--num-ctx` at least 16384;
  raise it before shrinking a packet.
- Choose the model by measured AC pass rate on a small feature (FEAT-001 has
  16 packets), not by benchmark; record the choice in the run records.
- Throughput or several workers in parallel: put vLLM or llama.cpp behind the
  same gateway; the procedure does not change.
- An agentic harness (OpenCode, Codex `--oss`) is a fallback for a packet that
  legitimately spans several files in one layer; the default is one call, files
  in, files out, because small models fail more often in tool loops than in
  single answers.

## What this procedure does not cover

Reviewing the skeleton, merging to `main`, deployment (RB-005), and any change
to a requirement's meaning (STD-003 R7). Those stay with people.
