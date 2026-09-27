---
id: SDD-043
title: "PDPA consent attestation — design"
---

# SDD-043 — PDPA consent attestation design

- **Components:** CMP-081 — `customer-consent-service.js#recordCustomerConsent`; CMP-082 — `conversation-consent-reader.js#readConversationConsentStatus`.
- **Data owned:** `Customer.consentStatus/consentRecordedAt/consentRecordedByPersonId/consentNote`.
- **Contracts exposed:** API-112, API-103.
- **Contracts consumed:** viewer resolution and `assertDomainVisible`/`ownsBusiness` (DOM-IAM); audit recorder.
- **Main sequence:** parse → domain gate → owner gate → load Business → find Customer in Business's Tenant → transaction(audit, update) → summary + `auditEventId`.
- **Failure modes:** gate order is deliberate (domain 404 before owner 403) so non-members cannot probe Business existence.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-043-001 | apps/server/prisma/schema.prisma (Customer consent columns); apps/server/supabase/migrations/20260826080000_customer_consent.sql; apps/server/src/lib/validation/enums.js |
| FR-043-002 | apps/server/src/modules/crm/customer-consent-service.js; apps/server/src/app/api/crm/customers/[customerId]/consent/route.js |
| FR-043-003 | apps/server/src/modules/crm/conversation-read-model.js; apps/server/src/modules/crm/conversation-consent-reader.js; apps/server/src/app/(pm)/customer/conversations/page.jsx |
