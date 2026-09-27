---
id: FR-096-002
title: "LINE FAQ knowledge candidates enter the corpus only as reviewed, locator-only Q/A"
part: FEAT-096-P02
owner: DOM-KNW
delivery: implemented
legacy: [FR-236]
relations:
  specified_by: [SDD-096]
  decided_by: [ADR-071]
  depends_on: [[FEAT-096-P02-toggle]]
---

# FR-096-002 — LINE FAQ knowledge candidates enter the corpus only as reviewed, locator-only Q/A

The system SHALL let a Business OWNER or LINE OA publisher draft a `KnowledgeCandidate` — a
canonical question-and-answer pair carrying only product locators, policy names and amounts — from
messages of a LINE conversation whose Customer's consent status is exactly `GRANTED`, and only when
the Business has explicitly enabled candidate drafting. The system SHALL deny the candidate's
composed content, at creation, at every edit and again at decision, when it matches the candidate
prose Zero-PII policy (a personal name, a phone number, a LINE user id, or quoted customer wording).
The system SHALL admit an APPROVED candidate as exactly one immutable TEXT source of kind
`LINE_FAQ_CANDIDATE` through the existing admission service, SHALL never admit a REJECTED candidate,
and SHALL never promote any candidate automatically.

## Acceptance criteria

- AC-096-002-01 — Given a Business whose candidate drafting is not enabled, when a draft is attempted by any caller including its OWNER, then it is refused before any authority check is reached.
- AC-096-002-02 — Given a conversation whose Customer consent is not exactly `GRANTED`, when a draft is attempted, then it is refused and no candidate row is created.
- AC-096-002-03 — Given candidate text containing a Thai personal name, a phone number, a LINE user id, or quoted wording, when it is drafted, edited or decided, then it is refused, naming the offending field and term; given ordinary approved-shaped FAQ prose that contains the words "ลูกค้า" or "ใบเสนอราคา" but names no person, phone number or quoted wording, then it is NOT refused by this policy (distinct from the unrelated structured-record policy, which still denies those same words for a different source kind).
- AC-096-002-04 — Given a `PENDING_REVIEW` candidate, when an OWNER or LINE OA publisher decides APPROVE, then it is admitted as one `LINE_FAQ_CANDIDATE` TEXT source, the row records the admitted source and ingestion ids, and the decision is audited; when the decision is REJECT, then no admission call is made and the row is marked `REJECTED`.
- AC-096-002-05 — Given consent was withdrawn between draft and decision, when APPROVE is attempted, then the decision is refused and nothing is admitted.
- AC-096-002-06 — Given a candidate already decided, when a second decision call races the first, then only one succeeds and the admission is made at most once (idempotent on the admission service's own key).

Note — `depends_on` above is descriptive, not a registered contract id: drafting is additionally
gated by `Business.knowledgeCandidatesEnabled`, a boolean owned and written by DOM-PRJ's `business`
module (`business-knowledge-candidates-service.js`, OWNER-only, versioned and audited the same way
as `Business.capabilitiesJson`). This part reads it through
`businessHasKnowledgeCandidatesEnabled()` (`apps/server/src/lib/business-knowledge-candidates.js`)
and treats anything other than the literal boolean `true` as disabled — a content-safety default,
distinct from a capability flag, defaulting OFF for every Business including one that already holds
the `knowledge` domain grant.

## Implementation

- `apps/server/src/modules/knowledge/application/knowledge-candidate-service.js`; `apps/server/src/modules/knowledge/knowledge-candidate-zero-pii.js`; `apps/server/src/modules/knowledge/knowledge-admission-service.js`; `apps/server/src/modules/crm/conversation-consent-reader.js`; `apps/server/src/modules/business/application/business-knowledge-candidates-service.js`; `apps/server/src/lib/business-knowledge-candidates.js`; `apps/server/src/app/api/knowledge/candidates/**`; `apps/server/src/app/api/businesses/[id]/knowledge-candidates-toggle/route.js`; `apps/server/src/modules/knowledge/ui/KnowledgeCandidateReview.jsx`; `apps/server/src/app/(pm)/knowledge/candidates/page.jsx`

## Verification

- TC-096-002 — Knowledge candidate lifecycle: enablement gate, consent, Zero-PII, decision and admission (see [verification.md](../verification.md))
