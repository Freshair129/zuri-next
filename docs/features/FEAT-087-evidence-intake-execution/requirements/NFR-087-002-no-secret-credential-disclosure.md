---
id: NFR-087-002
title: "No secret/credential disclosure"
delivery: live
legacy: []
---

# NFR-087-002 — No secret/credential disclosure

Object storage credentials, provider API keys and public bucket URLs never appear in
any response, log or canary artifact (ADR-080 D7). Measured by
`asset-evidence-storage-contract.test.js`.

## Verification

- TC-087-005 — Production activation contract (env/bucket/migration presence) (see [verification.md](../verification.md))
