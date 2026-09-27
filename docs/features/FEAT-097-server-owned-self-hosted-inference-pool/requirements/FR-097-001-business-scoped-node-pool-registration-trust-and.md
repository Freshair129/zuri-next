---
id: FR-097-001
title: "Business-scoped node/pool registration, trust and qualification"
part: FEAT-097-P01
owner: DOM-INT
delivery: declared
legacy: [FR-255]
relations:
  decided_by: [ADR-062]
---

# FR-097-001 — Business-scoped node/pool registration, trust and qualification

The system SHALL provide Business-scoped registration, write-only credential
references, an operator-approved private-destination allowlist, and explicit
qualification and lifecycle management for self-hosted inference nodes and
pools, reusing the existing `IntegrationConnection` and secret-resolution
abstractions rather than introducing a second credential store.

## Acceptance criteria

- AC-097-001-01 — Given an authorized manager registers a node within their own Business's scope, when registration completes, then exactly one connection record SHALL be created, scoped to that Business, and no raw credential SHALL ever appear in a read response, audit payload, log or model context.
- AC-097-001-02 — Given a registered node and its operator-approved endpoint, when qualification runs, then the system SHALL validate the network-target allowlist, DNS/TLS identity and permitted destination before opening any socket, and SHALL reject cloud-metadata addresses, loopback management targets, redirects and DNS rebinding.
- AC-097-001-03 — Given a qualification receipt bound to endpoint, credential version, model-profile hash and configuration epoch, when any of those change, then the node SHALL become ineligible for dispatch until it is requalified.
- AC-097-001-04 — Given an administrative lifecycle transition (drain, disable, revoke or archive), when it is applied, then it SHALL be a versioned, audited transition, and an archived or revoked node SHALL never be implicitly resurrected or re-enabled.

## Implementation

- Not implemented — approved design only (legacy `FR-097-001`, `code: []`, `tests: []`)
