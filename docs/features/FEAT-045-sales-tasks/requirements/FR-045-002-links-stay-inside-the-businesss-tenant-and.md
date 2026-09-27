---
id: FR-045-002
title: "Links stay inside the Business's tenant and the viewer's sight"
delivery: implemented
legacy: [FR-161 (split 2/4)]
relations:
  specified_by: [SDD-045]
  derived_from: [BR-046]
---

# FR-045-002 — Links stay inside the Business's tenant and the viewer's sight

The system SHALL accept an optional Customer and Conversation only when they belong to
the Business's Tenant and, when bound to a Business, one the viewer can see (else 422
`CUSTOMER_NOT_FOUND` / `CONVERSATION_NOT_FOUND`); a Conversation supplies its Customer
when none is named and SHALL be refused when it names a different one (422
`CONVERSATION_CUSTOMER_MISMATCH`); an assignee SHALL hold an ACTIVE Membership covering
the Business (422 `ASSIGNEE_NOT_MEMBER`).

## Acceptance criteria

- AC-045-002-01 — Given a Conversation of another Tenant, when linked, then 422 and no task is created.
- AC-045-002-02 — Given a Conversation and no Customer, when created, then the task's Customer is the Conversation's Customer.

## Verification

- TC-045-002 — Service authorization, links and CAS (see [verification.md](../verification.md))
