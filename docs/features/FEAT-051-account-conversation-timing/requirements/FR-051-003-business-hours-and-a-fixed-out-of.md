---
id: FR-051-003
title: "Business hours and a fixed out-of-hours reply answer without a model call"
delivery: building
legacy: [FR-244 (business-hours half, split 1/1 — the edge-residency half is retired, see §9)]
relations:
  specified_by: [API-121, API-131]
  decided_by: [ADR-044]
---

# FR-051-003 — Business hours and a fixed out-of-hours reply answer without a model call

The system SHALL let a publisher declare business hours ("HH:MM" 24h,
same-day windows only, Asia/Bangkok) and a fixed out-of-hours reply text
together (or clear all three together), through `CONFIGURE_BUSINESS_HOURS`;
an account with no declared hours SHALL be treated as always open (today's
behavior). A message admitted while the account is outside its declared hours
SHALL be answered with the fixed reply text, created directly at `READY`, and
SHALL NOT reach model execution.

## Acceptance criteria

- AC-051-003-01 — Given declared hours 09:00–18:00 and a message admitted at 20:00 account-local time, when admission runs, then the job is created `READY` with `answerText` equal to the configured out-of-hours text and `executionEvidence: 'OUT_OF_HOURS_RULE'`, and no execution is claimed.
- AC-051-003-02 — Given `CONFIGURE_BUSINESS_HOURS` with `businessHoursOpen >= businessHoursClose`, when applied, then the write is refused (same-day windows only).
- AC-051-003-03 — Given an account with all three fields null, when a message arrives at any hour, then it is treated as within hours (no shed).

## Implementation

- `apps/server/src/modules/line-oa-studio/application/line-conversation-jobs.js` (lines implementing `isAccountWithinBusinessHours` short-circuit), `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js`

## Verification

- TC-051-003 — Business hours validation and out-of-hours short-circuit (see [verification.md](../verification.md))
