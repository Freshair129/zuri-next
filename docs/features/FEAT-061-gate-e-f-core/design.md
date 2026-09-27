---
id: SDD-061
title: "Gate E/F core — read context, write/action gate, end-to-end turn, tool authorization — design"
---

# SDD-061 — Gate E/F core — read context, write/action gate, end-to-end turn, tool authorization design

- **Components:**
  - `CMP-155` — `context.js` / `auth-context.js`: assembles the Gate E
    context and resolves the AuthContext.
  - `CMP-181` — `tools.js`: the Gate E read-only registry and its
    `readOnly:true` registration guard.
  - `CMP-148` — `action-gate.js` / `write-tools.js` /
    `step-up.js`: the Gate F registry, `authorizeAgentAction`,
    `executeAgentAction`, step-up issuance/consumption.
  - `CMP-180` — `identity/agent-tool-authorizer.js`: the
    shared tool-call authorization boundary (owned jointly with DOM-IAM;
    physically lives in the identity module).
  - `CMP-182` — `turn.js`: the end-to-end orchestrator.
- **Data owned:** none directly — writes go through `project-manager`'s
  `recordAudit`, `identity`'s `IdentityLinkToken` (step-up), and CRM's
  `Conversation`/`Customer` (Gate F demo actions).
- **Contracts exposed:** none as HTTP today (previously reached only through
  `API-173`, now retired — see §9).
- **Contracts consumed:** `FR-003-009` (404-shaped scope refusal pattern),
  identity's `resolveAuthorizationContext`/`authorizeScope`.
- **Main sequence:** 1. `handleAgentTurn` ingests the inbound message. 2.
  `assembleAgentContext` resolves AuthContext, policy and the Gate E tool
  list. 3. An optional `action` runs through `executeAgentAction`
  (authorize → step-up → one transaction → audit). 4. The turn returns one
  `response`.
- **Failure modes:** unauthorized/step-up-needed degrades gracefully inside
  `handleAgentTurn`; an unknown action name propagates as a real fault; a
  write-classified descriptor registered on the Gate E registry throws at
  *registration* time, never silently reaching Gate E at call time.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-061-001 | `apps/server/src/modules/agent/context.js`, `apps/server/src/modules/agent/tools.js`, `apps/server/src/modules/agent/memory-port.js`, `apps/server/src/modules/agent/msp-memory-port.js`, `apps/server/src/modules/agent/msp-thread-memory-port.js` |
| FR-061-002 | `apps/server/src/modules/agent/action-gate.js`, `apps/server/src/modules/agent/write-tools.js`, `apps/server/src/modules/agent/step-up.js`, `apps/server/src/modules/agent/line-project-work-tools.js` |
| FR-061-003 | `apps/server/src/modules/agent/turn.js`, `apps/server/src/modules/agent/index.js` |
| FR-061-004 | `apps/server/src/modules/agent/tools.js`, `apps/server/src/modules/agent/action-gate.js`, `apps/server/src/modules/identity/agent-tool-authorizer.js`, `apps/server/src/modules/identity/authorization-context.js` |
