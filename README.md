# zuri-next

The next-generation zuri system. This repository starts from its specification:
the behaviour and design of the current zuri-ai system, rewritten in a new
document structure where every feature, requirement and decision has one
canonical file and a stable ID.

| Path | Holds |
|---|---|
| [`docs/`](docs/README.md) | The specification: product, architecture, domains, features (one requirement per file), services, operations and the governance standards |
| `registry/` | Hand-maintained metadata: domain and service registries, and the crosswalk from zuri-ai IDs to the IDs used here |
| `tools/` | Documentation validator, domain-view generator and the SQL schema of the engineering graph |

Start with [`docs/README.md`](docs/README.md), then the standards in
[`docs/governance/standards/`](docs/governance/standards/).

```bash
node tools/validate-docs.mjs                   # identity and traceability checks (STD-002 R8)
node tools/validate-docs.mjs --scope FEAT-042  # the same, reported for one feature, domain or path
node tools/tests-for.mjs FR-042-003            # tests that prove an ID, and the command to run only them
node tools/generate-views.mjs                  # regenerate each domain's feature index (STD-003 R2)
```

Requires Node.js 22 or later; the tools use only the standard library.
