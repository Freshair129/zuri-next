---
id: FR-079-008
title: "Console and route surface for the SCM lane"
delivery: building
legacy: [FR-182, FR-170]
relations:
  specified_by: [SDD-079]
  decided_by: [ADR-072]

---

# FR-079-008 — Console and route surface for the SCM lane

The system SHALL expose 13 thin `/api/inventory/**` route handlers (each resolving
the viewer, calling the one exported service and returning its result — never
touching Prisma directly) and 3 console pages (`/inventory/locations`,
`/inventory/work-orders`, `/inventory/reservations`) as in-canvas tabs alongside the
existing `/inventory` catalogue/ledger page. Work-order action dispatch
(`PATCH .../customization-work-orders/{id}` and `.../kitting-work-orders/{id}`)
SHALL use a Zod-validated `action` vocabulary (RELEASE | COMPLETE | CANCEL) declared
once in the domain, never a string a route branches on.

## Acceptance criteria

- AC-079-008-01 — Given a route handler in this family, when inspected, then it contains no direct Prisma call — only viewer resolution + one service call.
- AC-079-008-02 — Given an unrecognized `action` value on a work-order PATCH, when submitted, then Zod validation refuses it before the domain layer runs.

## Implementation

- 13 route files under `apps/server/src/app/api/inventory/**`, `INVENTORY_TABS`, `apps/server/src/app/(pm)/inventory/locations/page.jsx`, `.../work-orders/page.jsx`, `.../reservations/page.jsx`

## Verification

- TC-079-008 — Route thinness and action-vocabulary validation (see [verification.md](../verification.md))
