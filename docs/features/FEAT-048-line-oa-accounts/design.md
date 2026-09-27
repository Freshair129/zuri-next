---
id: SDD-048
title: "LINE OA accounts — design"
---

# SDD-048 — LINE OA accounts design

- **Components:** `CMP-099` (`line-oa-account-service.js`,
  the only writer) · `CMP-098` (`line-oa-account.js`, pure
  vocabulary/status-machine rules).
- **Data owned:** `LineOaAccount`.
- **Contracts exposed:** `API-123`, `API-121`.
- **Contracts consumed:** Integration's connection-health read contract
  (FR-091-006); the agent lane's binding-status read contract
  (`FR-064-003`/`FR-064-004`) for `effectiveStatus`.
- **Main sequence:** 1. viewer resolved and scoped to a visible Business. 2.
  service validates the action/body against the pure domain schema. 3. status
  transition checked against `STORED_STATUS_TRANSITIONS`. 4. compare-and-swap
  on `version`; audit row appended. 5. health computed from referenced
  read contracts at response time, never stored.
- **Failure modes:** stale version → conflict; unauthorized/unknown Business or
  account → 404; an invalid action for the current status → 400.

## Implementation map

| Requirement | Current code |
|---|---|
| FR-048-001 | `apps/server/src/app/api/line-oa/accounts/route.js`, `apps/server/src/modules/line-oa-studio/application/line-oa-account-service.js` |
| FR-048-002 | `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js` |
| FR-048-003 | `apps/server/src/lib/validation/enums.js` (`LINE_OA_TRANSPORT_MODES`, `LINE_OA_ACCOUNT_ACTIONS`) |
| FR-048-004 | `apps/server/src/app/api/line-oa/accounts/[id]/route.js`, `apps/server/src/modules/line-oa-studio/domain/line-oa-account.js` |
