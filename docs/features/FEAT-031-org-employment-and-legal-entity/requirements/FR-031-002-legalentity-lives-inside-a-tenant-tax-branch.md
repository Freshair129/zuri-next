---
id: FR-031-002
title: "LegalEntity lives inside a Tenant; tax branch registration is split from Branch"
delivery: implemented
legacy: [FR-194]
relations:
  specified_by: [SDD-031]
  decided_by: [ADR-024]
---

# FR-031-002 — LegalEntity lives inside a Tenant; tax branch registration is split from Branch

`LegalEntity` SHALL carry `tenantId` (not `portfolioId`), with `UNIQUE(id,
tenantId)` and a composite FK from `Business.legalEntityId`, so a Business
can reference a LegalEntity only within its own Tenant.
`TaxRegistrationBranch` (`legalEntityId`, `branchCode`, `name`, `address`)
SHALL hold the legal entity's VAT branch registrations; `Branch` SHALL gain
`kind` (`SITE`/`WAREHOUSE`/`KITCHEN`/`OFFICE`, default `SITE`) and an
optional `taxRegistrationBranchId`, replacing the free-text
`taxBranchCode`. Creating a `LegalEntity` SHALL remain an installation-
operator act.

## Acceptance criteria

- AC-031-002-01 — Given a Business in Tenant A, when it attempts to reference a LegalEntity that belongs to Tenant B, then the reference is refused by the composite foreign key.
- AC-031-002-02 — Given a warehouse Branch with no tax registration, when it is read, then it is a valid, complete Branch row — no tax branch code is required or implied.

## Implementation

- `apps/server/prisma/seed.js`, `apps/server/src/lib/validation/{entities.js,enums.js}`, `apps/server/src/modules/commerce/{application/billing-invoice-service.js,domain/billing.js,application/pos-cashier-service.js}`, `apps/server/src/modules/project-manager/application/scope-service.js`

## Verification

- TC-031-002 — LegalEntity Tenant ancestry and tax branch split (see [verification.md](../verification.md))
