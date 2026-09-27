---
id: FR-061-001
title: "Agent read-only context contract (Gate E)"
delivery: implemented
legacy: [FR-025]
relations:
  specified_by: [none]
  decided_by: [ADR-060]
---

# FR-061-001 — Agent read-only context contract (Gate E)

The system SHALL assemble a read-only agent context for one resolved
principal (`assembleAgentContext`) by first resolving identity, Membership
and MSP-authorization facts through the one authorization seam
(`resolveAgentAuthorization`, FR-067-001), keying private-memory recall
by the resolved principal — never by the raw LINE channel handle — reading
knowledge through an injectable reader (a Prisma relation reader by default,
or a GenesisBlockDB-backed reader when configured), and exposing only the
Gate E read-only tool registry. The system SHALL refuse, at registration
time rather than at call time, any tool descriptor whose `readOnly` field is
not exactly `true` — the Gate E→F boundary.

## Acceptance criteria

- AC-061-001-01 — Given a caller registers a tool descriptor with `readOnly` unset or `false` on the Gate E registry, when `register()` is called, then it throws `Gate E forbids write tools: "<name>" must be readOnly:true` and the descriptor is never added to the registry.
- AC-061-001-02 — Given a principal whose policy denies private-memory read (`policy.privateMemoryAllowed !== true` or `mspAuthorization.read !== true`), when `assembleAgentContext` runs, then a `RETRIEVAL_DENIED` audit event is recorded and the returned `memory` is `{ key, entries: [] }` rather than any stored entries.
- AC-061-001-03 — Given a thread-memory-enabled call made first with `deferThreadRecall: true` and then again with `currentExchangeId` set, when the second call runs, then the returned `threadMemory` packet is built from the thread context that includes that exchange (two-pass recall, matching `turn.js`'s own two-call pattern).

## Implementation

- `apps/server/src/modules/agent/context.js`, `apps/server/src/modules/agent/tools.js`, `apps/server/src/modules/agent/memory-port.js`, `apps/server/src/modules/agent/msp-memory-port.js`, `apps/server/src/modules/agent/msp-thread-memory-port.js`
