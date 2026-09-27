---
id: SDD-096
title: "LINE grounding and knowledge candidates — design"
---

# SDD-096 — LINE grounding and knowledge candidates design

**Components:**
- `CMP-109` — owns `LineOaAccount.knowledgeGrounding` and its versioned, audited
  `CONFIGURE_KNOWLEDGE_GROUNDING` writer (`line-oa-account-service.js`, `line-oa-account.js`).
- `CMP-117` — composes rich-menu/LIFF-app/bot-profile description copy
  and calls knowledge admission/withdrawal on the owning services' own publish/unpublish points
  (`line-oa-studio-description-admission.js`, hooked from `line-oa-rich-menu-jobs.js`,
  `line-oa-liff-app-service.js`, `line-oa-account-service.js`).
- `CMP-167` — the mode-gated, budgeted, traced fallback reader
  (`line-knowledge-grounding.js`).
- `CMP-161` — evidence verification and the deterministic no-evidence /
  no-model-call gate, now also formatting a `CORPUS_CHUNK` evidence record
  (`grounded-business-answer.js`).
- `CMP-178` — orchestrates one turn: resolves the grounding mode, composes
  knowledge evidence with MSP slices under one shared budget, and decides the single
  `ContextReceipt` (`server-line-answer.js`).
- `CMP-166` — the one `EVIDENCE_SELECTED`/`CONTEXT_RECEIPT` trace writer, now
  per-hop-tagged with `mode`/`source`/`reason`/`retrievalRefs`/`budgetMs` (`line-execution-trace.js`).
- `CMP-192` — the in-process `knowledge.query` implementation over
  `queryKnowledgeCorpus`, built from a frozen, single-Business read capability
  (`corpus-knowledge-reader.js`).
- `CMP-203` — the sole `KnowledgeCandidate` writer: draft, edit, decide,
  consent re-check, Zero-PII gate and the admission call on APPROVE
  (`application/knowledge-candidate-service.js`).
- `CMP-204` — the one candidate prose policy entry point, shared
  byte-for-byte between the candidate service and Stage 5 classify
  (`knowledge-candidate-zero-pii.js`).
- `CMP-202` — the existing ADR-067 admission writer, extended with the
  `LINE_FAQ_CANDIDATE` and `LINE_STUDIO_DESCRIPTION` source kinds (`knowledge-admission-service.js`).
- `CMP-206` — the computed-on-read `NO_EVIDENCE` aggregation
  (`application/knowledge-gap-report-service.js`).
- `CMP-007` (dependency, not owned here) — the
  `knowledgeCandidatesEnabled` toggle writer (`business-knowledge-candidates-service.js`).
- `CMP-084` (dependency, not owned here) — the narrow internal consent
  read P02's decision step re-checks (`conversation-consent-reader.js`).

**Data owned:**
- DOM-LOA: `LineOaAccount.knowledgeGrounding` (string enum column, default `BUSINESS_KNOWLEDGE`).
- DOM-KNW: `KnowledgeCandidate` (new model: status, question/answer, `sourceRefJson`
  `{conversationId, messageIds}` only, `consentStatusAtDraft`, `admittedSourceId`/
  `admittedIngestionId`, `tombstonedAt`, version); the existing `KnowledgeSource`/
  `KnowledgeIngestion` rows, now also created under the `LINE_FAQ_CANDIDATE` and
  `LINE_STUDIO_DESCRIPTION` kinds.

**Contracts exposed:**
- `API-262` — `GET/POST /api/knowledge/candidates`,
  `GET/PATCH /api/knowledge/candidates/{id}`, `POST /api/knowledge/candidates/{id}/decision`.
- `API-263` — `GET /api/knowledge/gap-report`.
- `API-264` (DOM-PRJ, dependency) —
  `PATCH /api/businesses/{id}/knowledge-candidates-toggle`.

**Contracts consumed:**
- The existing `knowledge.query` port (P01's `answerBusinessQuestion` already depends on it; P01
  adds a second in-process implementation over `queryKnowledgeCorpus`, never an HTTP self-call).
- The existing ADR-067 admission service contract (`admitKnowledge`/`withdrawKnowledgeSource`) — P02
  and P04 both call it as their only write path into the corpus.
- CRM's narrow consent projection and viewer-facing conversation read model (DOM-CRM, dependency).

**Main sequence (grounding read, P01):**
1. A publisher sets `LineOaAccount.knowledgeGrounding` (audited write, DOM-LOA).
2. A LINE turn resolves the account's mode, failing closed to `BUSINESS_KNOWLEDGE` on anything
   unrecognised.
3. For a corpus mode, the turn wraps the existing business-knowledge reader in the mode-gated
   reader, backed by the in-process corpus reader.
4. The corpus reader queries `queryKnowledgeCorpus` under the job's own server-derived Tenant/
   Business scope, ranks and truncates hits to the top-K/byte budget, and returns
   `{records, retrievalRefs}`.
5. On success with records: return; trace `EVIDENCE_SELECTED{source: GKS_CORPUS}`.
6. On timeout/thrown error: resolve to `GKS_UNAVAILABLE` (the original error, and anything it might
   carry, is discarded); on an empty result: `NO_EVIDENCE`.
7. `GKS_CORPUS` mode: trace `{source: NONE, reason: NO_EVIDENCE}` and stop — no fallback.
   `GKS_THEN_BUSINESS_KNOWLEDGE` mode: query the business-knowledge reader and trace that hop too.
8. `answerBusinessQuestion` decides solely from `evidence.records.length`: empty means the
   deterministic reply and zero model calls; non-empty means generate, verify against the evidence,
   and fall back to the deterministic reply if the model's claim is unsupported.

**Main sequence (candidate lifecycle, P02):** draft (consent + enablement + Zero-PII gate) → OWNER/
publisher edits (Zero-PII re-run) → decide REJECT (audited, stop) or APPROVE (consent re-checked,
Zero-PII re-run on the exact admitted text, `admitKnowledge` called with a candidate-scoped
idempotency key, row flipped to `APPROVED` under compare-and-set).

**Failure modes:**
- `GKS_UNAVAILABLE` — corpus hop timeout, MSP-spawn failure, worker error or authorization refusal;
  always resolved before it can leak SQL, a stack trace or a credential onto the trace.
- `NO_EVIDENCE` — empty corpus result (or empty final evidence after any allowed fallback);
  deterministic reply, no model call, by the same rule `answerBusinessQuestion` already enforced.
- `KNOWLEDGE_CANDIDATES_DISABLED` (403) — a per-Business gate, checked before any authority check.
- `KNOWLEDGE_CANDIDATE_CONSENT_NOT_GRANTED` (409) — at draft and again, independently, at decision.
- `KNOWLEDGE_CANDIDATE_ZERO_PII_DENIED` (422) — at creation, edit and decision, naming the field and
  matched term.
- Best-effort admission failure (P04) — most commonly the knowledge runtime being unconfigured for
  the Business; swallowed, not separately audited (there is no source or ingestion to record), and
  never allowed to fail or undo the publisher's own action.
- A detached in-flight corpus call — `queryKnowledgeCorpus` accepts no cancellation signal, so a
  budget timeout stops *waiting* but cannot stop the call; its late result is simply discarded (code
  comment, `corpus-knowledge-reader.js`; see Open issues).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-096-001 | `apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js`; `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`; `apps/server/src/modules/agent/line-knowledge-grounding.js`; `apps/server/src/modules/agent/server-line-answer.js`; `apps/server/src/modules/agent/grounded-business-answer.js`; `apps/server/src/modules/agent/line-execution-trace.js`; `apps/server/src/modules/knowledge/corpus-knowledge-reader.js`; `apps/server/src/lib/validation/enums.js` (`KNOWLEDGE_GROUNDING_MODES`) |
| FR-096-002 | `apps/server/src/modules/knowledge/application/knowledge-candidate-service.js`; `apps/server/src/modules/knowledge/knowledge-candidate-zero-pii.js`; `apps/server/src/modules/knowledge/knowledge-admission-service.js`; `apps/server/src/modules/crm/conversation-consent-reader.js`; `apps/server/src/modules/business/application/business-knowledge-candidates-service.js`; `apps/server/src/lib/business-knowledge-candidates.js`; `apps/server/src/app/api/knowledge/candidates/**`; `apps/server/src/app/api/businesses/[id]/knowledge-candidates-toggle/route.js`; `apps/server/src/modules/knowledge/ui/KnowledgeCandidateReview.jsx`; `apps/server/src/app/(pm)/knowledge/candidates/page.jsx` |
| FR-096-003 | `apps/server/src/modules/knowledge/application/knowledge-gap-report-service.js`; `apps/server/src/app/api/knowledge/gap-report/route.js`; `apps/server/src/modules/knowledge/ui/KnowledgeGapReport.jsx`; `apps/server/src/app/(pm)/knowledge/gap-report/page.jsx` |
| FR-096-004 | `apps/server/src/modules/line-oa-studio/application/line-oa-studio-description-admission.js`; `apps/server/src/modules/line-oa-studio/application/line-oa-rich-menu-jobs.js`; `apps/server/src/modules/line-oa-studio/application/line-oa-liff-app-service.js`; `apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js`; `apps/server/src/modules/knowledge/knowledge-admission-service.js` |
