---
id: FR-096-001
title: "Publisher-configured grounding mode selects the evidence read"
part: FEAT-096-P01
owner: DOM-LOA
delivery: implemented
legacy: [FR-235]
relations:
  specified_by: [SDD-096]
  decided_by: [ADR-071]
---

# FR-096-001 — Publisher-configured grounding mode selects the evidence read

The system SHALL let a Business OWNER configure a LINE OA account's `knowledgeGrounding` mode to
exactly one of `BUSINESS_KNOWLEDGE` (default), `GKS_CORPUS` or `GKS_THEN_BUSINESS_KNOWLEDGE`, and
SHALL default every account to `BUSINESS_KNOWLEDGE` until a publisher switches it. The system SHALL
resolve a missing or unrecognised mode to `BUSINESS_KNOWLEDGE`, never to a corpus read. In a corpus
mode, the system SHALL read the Business's published GKS corpus generation through an in-process
reader before deciding whether to fall back to the business-knowledge reader, and SHALL trace every
hop it attempts. The system SHALL never invoke a model when no evidence is found from any source the
mode allows.

## Acceptance criteria

- AC-096-001-01 — Given a newly connected LINE OA account, when it is created, then its `knowledgeGrounding` is `BUSINESS_KNOWLEDGE`.
- AC-096-001-02 — Given a Business OWNER, when they apply `CONFIGURE_KNOWLEDGE_GROUNDING` with a recognised mode and the account's current version, then the mode changes, the write is versioned, and an audited `LINE_OA_ACCOUNT_KNOWLEDGE_GROUNDING_CONFIGURED` event is recorded whose payload contains no secret and no customer content.
- AC-096-001-03 — Given a non-owner member of the Business, when they attempt the same action, then the request is refused and the account's mode is unchanged.
- AC-096-001-04 — Given mode `GKS_CORPUS` and a corpus read that returns no records, when the turn is answered, then the reply is the existing deterministic no-evidence reply and no model is called, with no fallback attempted.
- AC-096-001-05 — Given mode `GKS_THEN_BUSINESS_KNOWLEDGE` and a corpus read that times out or throws, when the turn is answered, then the hop is traced `GKS_UNAVAILABLE`, the reader falls back to the business-knowledge reader, and that hop is traced too with the fallback's own result.
- AC-096-001-06 — Given mode `BUSINESS_KNOWLEDGE` (the untouched default path), when any turn is answered, then the trace and the answer are byte-identical to the pre-existing (pre-FR-235) behaviour.

## Implementation

- `apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js`; `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`; `apps/server/src/modules/agent/line-knowledge-grounding.js`; `apps/server/src/modules/agent/server-line-answer.js`; `apps/server/src/modules/agent/grounded-business-answer.js`; `apps/server/src/modules/agent/line-execution-trace.js`; `apps/server/src/modules/knowledge/corpus-knowledge-reader.js`; `apps/server/src/lib/validation/enums.js` (`KNOWLEDGE_GROUNDING_MODES`)

## Verification

- TC-096-001 — LINE answer grounding mode: default, publisher control, mode-gated fallback, no-evidence gate (see [verification.md](../verification.md))
