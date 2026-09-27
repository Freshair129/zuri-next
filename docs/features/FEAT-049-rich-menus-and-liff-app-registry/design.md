---
id: SDD-049
title: "Rich menus and LIFF app registry — design"
---

# SDD-049 — Rich menus and LIFF app registry design

- **Components:** `CMP-115` (`line-oa-rich-menu-service.js`)
  · `CMP-112` (`line-oa-rich-menu.js`, pure bounds/vocabulary
  rules) · `CMP-113` (`line-oa-rich-menu-jobs.js`, the ledger
  and worker orchestration) · `CMP-114`
  (`line-oa-rich-menu-publish.js`) · `CMP-107`
  (`line-oa-liff-app-service.js`) · `CMP-106`
  (`line-oa-liff-app.js`).
- **Data owned:** `LineOaRichMenu`, `LineOaRichMenuVersion`,
  `LineOaRichMenuJob`, `LineOaLiffApp`.
- **Contracts exposed:** `API-135`, `API-133`,
  `API-134`, `API-130`, `API-129`,
  `EVT-003`.
- **Contracts consumed:** Integration's rich-menu port
  (`server-line-rich-menu-transport.js`, FR-091-006); `FileAsset`
  reference validation (`FR-017-002, FR-017-003, FR-017-004, FR-017-005, FR-017-006, FR-017-007, FR-017-008`).
- **Main sequence:** 1. publisher saves/freezes a draft. 2. publisher queues a
  job with the frozen version's id and the menu's version. 3. worker claims
  the oldest due job under lease and epoch fence. 4. worker walks
  create → upload image → done (or apply) through the Integration port. 5.
  acceptance updates version/job state and appends one audit row.
- **Failure modes:** ambiguous create/upload → `UNKNOWN`, publisher
  acknowledgement required; permanent provider rejection → `FAILED` with
  `errorCode`; stale lease → reclaimed by the next tick.

## Implementation map

| Requirement | Current code |
|---|---|
| FR-049-001 | `apps/server/src/modules/line-oa-studio/domain/line-oa-rich-menu.js`, `application/line-oa-rich-menu-service.js` |
| FR-049-002 | `apps/server/src/modules/line-oa-studio/domain/line-oa-rich-menu.js` |
| FR-049-003 | `apps/server/src/modules/line-oa-studio/application/line-oa-rich-menu-jobs.js`, `application/server-line-rich-menu-runtime.js` |
| FR-049-004 | `apps/server/src/modules/line-oa-studio/domain/line-oa-rich-menu-publish.js`, `apps/server/src/platform/integrations/providers/line/server-line-rich-menu-transport.js` |
| FR-049-005 | `apps/server/src/modules/line-oa-studio/domain/line-oa-liff-app.js`, `application/line-oa-liff-app-service.js` |
| FR-049-006 | `apps/server/src/modules/line-oa-studio/application/line-oa-rich-menu-jobs.js` (LIFF resolution at queue/execution time) |
