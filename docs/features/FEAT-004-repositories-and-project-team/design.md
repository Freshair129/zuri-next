---
id: SDD-004
title: "Project repositories & project team — design"
---

# SDD-004 — Project repositories & project team design

- **Components:** CMP-028 (`listRepositories`, `createRepository`, `updateRepository`, `linkRepository`, `unlinkRepository`), CMP-026 (`listProjectTeam`, `addProjectTeamMember`, `changeProjectTeamRole`, `removeProjectTeamMember`), CMP-024 (`assertRepositoryWritable`, `assertProjectWritable`).
- **Data owned:** Repository (`businessId?`), ProjectRepository (`role`, `pathScope`, `branch`). Membership is IAM-owned and only written through its contract.
- **Contracts exposed:** API-071, API-072, API-074, API-073, API-066.
- **Contracts consumed:** IAM `grantBusinessMembership`, `revokeMembership` (FR-030-001); viewer predicates.
- **Main sequence (link):** 1. load Project and Repository 2. authorize both governing Businesses 3. insert link 4. audit.
- **Failure modes:** unowned either side → 404; ownerless Repository → 403 naming missing owner; duplicate member → 400.
- **Operations:** `scripts/backfill-repository-business.mjs` assigns owners from unanimous Project links.

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-004-001 | apps/server/src/modules/project-manager/application/repository-service.js; apps/server/src/app/api/repositories/**; apps/server/src/app/(pm)/repositories/page.jsx; apps/server/src/app/(pm)/projects/[projectId]/repositories/page.jsx |
| FR-004-002 | repository-service.js; apps/server/src/modules/project-manager/application/project-authorization.js (`assertRepositoryWritable`); apps/server/src/lib/validation/entities.js; apps/server/scripts/backfill-repository-business.mjs |
| FR-004-003/004 | apps/server/src/modules/project-manager/application/project-team-service.js; apps/server/src/app/api/projects/[id]/team/route.js; apps/server/src/app/(pm)/projects/[projectId]/team/page.jsx |
