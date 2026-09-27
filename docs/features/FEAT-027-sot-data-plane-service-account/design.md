---
id: SDD-027
title: "SoT Data-Plane Service Account — design"
---

# SDD-027 — SoT Data-Plane Service Account design

- **Components:** `CMP-055` (`sot-data-plane-auth.js`,
  `mint-sot-data-plane-key-cli.js`).
- **Data owned:** `SotDataPlaneKey`.
- **Contracts exposed:** `API-094` (consumed by another
  domain's routes; no HTTP surface of its own in this slice).
- **Contracts consumed:** none.
- **Main sequence:** 1. Operator mints a key for Tenant T via CLI. 2. Raw key
  shown once; only its hash and prefix persist. 3. SoT data plane presents
  the bearer token on every submit/export call. 4.
  `resolveSotDataPlaneViewer` checks the hash, confirms `status: ACTIVE`,
  touches `lastUsedAt`, and returns a Tenant-scoped, non-Person identity.
- **Failure modes:** unknown/malformed/revoked key → one generic refusal;
  key for Tenant A presented against Tenant B's data → refused at the
  consuming endpoint (Tenant mismatch), not at this resolver.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-027-001 | `apps/server/src/modules/identity/sot-data-plane-auth.js` |
