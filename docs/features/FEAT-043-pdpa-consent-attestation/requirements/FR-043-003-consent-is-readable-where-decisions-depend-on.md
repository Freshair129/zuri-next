---
id: FR-043-003
title: "Consent is readable where decisions depend on it"
delivery: live
legacy: [FR-103 (split 3/3)]
relations:
  specified_by: [SDD-043, API-103, API-108]
---

# FR-043-003 — Consent is readable where decisions depend on it

The system SHALL expose the current consent fields on the inbox thread's customer, and
SHALL provide an internal, viewer-free reader that, given Tenant, Business and
Conversation ids, returns only the Customer's `consentStatus` — or `null` on any scope
mismatch or missing row — for another lane's decision.

## Acceptance criteria

- AC-043-003-01 — Given a conversation of Business A, when the reader is asked with Business B's id, then it returns `null`.
- AC-043-003-02 — Given an opened thread, when rendered, then the customer's consent status is shown without a second request.

## Implementation

- apps/server/src/modules/crm/conversation-read-model.js; apps/server/src/modules/crm/conversation-consent-reader.js; apps/server/src/app/(pm)/customer/conversations/page.jsx

## Verification

- TC-043-003 — Consent readers (see [verification.md](../verification.md))
