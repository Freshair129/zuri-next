---
id: FR-047-005
title: "Owner retrieval at AAL2 with a case reference"
delivery: building
legacy: [FR-245 (split 3/4)]
relations:
  specified_by: [SDD-047, API-102]
  depends_on: [FR-094-004]
  decided_by: [ADR-042]
---

# FR-047-005 — Owner retrieval at AAL2 with a case reference

The system SHALL accept `POST /api/crm/customers/{customerId}/chat-evidence/retrieve`
with `{businessId, startDate, endDate, caseReference (1–500)}` only from a Business
owner in the Customer's Tenant who passes the AAL2 credential-write step-up gate; it
SHALL verify the Tenant's whole manifest chain (with files) before trusting any
manifest, use only self-consistent manifests whose file hash verifies, return that
Customer's archived messages in the date range grouped by session with the manifests
used and any `missingMessageIds`, and write one `ARCHIVE_RETRIEVED` audit event with
the case reference and counts. No page lists or browses the archive.

## Acceptance criteria

- AC-047-005-01 — Given a session below AAL2, when retrieving, then the step-up refusal is returned and no file is read.
- AC-047-005-02 — Given one archive file offline, when retrieving, then available messages are returned and the missing ones are listed in `missingMessageIds`.

## Implementation

- apps/server/src/modules/crm/chat-evidence-retrieval-service.js; apps/server/src/app/api/crm/customers/[customerId]/chat-evidence/retrieve/route.js

## Verification

- TC-047-003 — Retrieval (see [verification.md](../verification.md))
