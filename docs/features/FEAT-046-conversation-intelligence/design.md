---
id: SDD-046
title: "Conversation intelligence — design"
---

# SDD-046 — Conversation intelligence design

- **Components:** CMP-083 — `conversation-analysis-service.js` (`recordConversationAnalysis`, `getConversationAnalyses`).
- **Data owned:** ConversationAnalysis (built); CustomerProfile, DailyBrief (declared, not in schema).
- **Contracts exposed:** none public — in-process functions only; no route or UI exists.
- **Contracts consumed:** viewer authority (DOM-IAM); consent fields (FEAT-043); erasure deletes analyses (DOM-IAM `erase-principal.js`); snapshot backup/restore (DOM-PRJ backup service).
- **Main sequence (write):** transaction → owned Businesses → tenant-correlated scope → consented conversation → create → audit.
- **Failure modes:** tenant columns of Conversation and Customer disagree → treated as not found (fail closed).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-046-001, FR-046-002 | apps/server/src/modules/crm/conversation-analysis-service.js; apps/server/src/lib/validation/enums.js; apps/server/src/modules/identity/erase-principal.js |
| FR-046-003 | — (declared) |
| FR-046-004 | — (declared) |
