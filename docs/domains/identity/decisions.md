# Identity — decisions

All ten legacy ADRs assigned to this domain are still in force. None are
superseded or retired.

### ADR-019 — Production viewer session and viewer-scoped entry read model
Owner: DOM-IAM
Relations: owned_by: DOM-IAM
Legacy: ADR-017

**Status:** Accepted, implemented.

**Context (≤5 lines):** The FR-023-002 routing proof loaded `GET /api/viewer` and
the broad `GET /api/scope` independently and intersected them in the browser —
disclosure happened before the client hid anything. `resolveViewer()` needed a
server-authenticated principal instead of a seeded-owner/local-demo fallback.

**Decision:**
- Added `GET /api/entry`: one atomic, viewer-scoped read model behind a
  trusted `SessionPort` seam (`AUTHENTICATED` / `UNAUTHENTICATED`), returning
  only selectable Businesses and the minimum ancestry to render them.
- `POST /api/auth/login` verifies `PersonCredential` (scrypt) and issues a
  signed, expiring HttpOnly `zuri_session` cookie only on success; no
  local-demo or seeded-owner path remains.
- `GET /api/entry` never returns memberships, hidden Business ids, unrelated
  ancestry or client-editable authorization claims.
- `GET /api/scope` remains an internal, separately gated administration
  interface; `/businesses` never combines it with `/api/entry`.

**Consequences:**
- Business Routing has one fetch and cannot infer hidden rows from a broad
  inventory.
- Production callers without a trusted session fail closed; API errors never
  reveal whether a hidden Business/Person/session exists.
- A later provider choice can replace `SessionPort` without touching RBAC or
  the entry DTO.

### ADR-020 — Profile-first and Workspace-first onboarding
Owner: DOM-IAM

Legacy: ADR-027

**Status:** Accepted, implemented (FEAT-025).

**Context:** Sending every newly resolved viewer straight to Business Routing
forces a new member to create or select operating data before a Tenant Owner
can invite them. Profile, Workspace (Portfolio), Organization (Tenant),
Business, Space (schema Workspace) and Project are five different concepts
that keep getting collapsed into one word.

**Decision:**
- Profile is the first setup step over `Person`, not an authorization grant;
  a Profile-only member may remain in Waiting Room indefinitely.
- Product hierarchy (Workspace → Organization → Business → Project →
  Workstream) and technical grouping (Space, inside a Business) are two
  different lists; Space never appears as a step the user must take, but a
  Business-scoped Default Space is still created as required infrastructure.
- `WorkspaceMembership` is a distinct Portfolio-scoped collaboration contract,
  never merged into Tenant/Business `Membership`; it widens nothing
  (`resolveViewer` never reads it).
- A Tenant/Workspace Owner pulls a Profile-only person into work through a
  scoped, expiring, single-use invite; the client never chooses its own role.

**Consequences:**
- A member can wait indefinitely without manufacturing Business data.
- Workspace collaboration is grantable without widening Tenant/Business
  authority.
- Existing FR-023-002/entry routes remain a verified compatibility slice.

### ADR-021 — Customer scope and Product Owner authority
Owner: DOM-IAM

Legacy: ADR-033

**Status:** Candidate — generic RBAC contract implemented; bounded customer
projection applied under a separately gated migration mission.

**Context:** The generic scope model (Portfolio → Tenant → Business,
WorkspaceMembership vs Membership, per-Business domain visibility) did not
yet define a Business-scoped "Product Owner" responsibility distinct from
full Business ownership.

**Decision:**
- Product Owner is a generic, Business-scoped `RoleBinding` (`roleKey =
  PRODUCT_OWNER`), many-to-many between Person and Business, never a
  replacement for `Membership.role` or a global principal role.
- Platform identity, Workspace membership, Tenant employment and Business
  ownership are five separate authority layers that may coexist on one Person
  but never substitute for each other.
- The server resolves role bindings from trusted session/persisted state
  only; client-supplied tenant/business/role claims are never authorization
  inputs.
- `CUSTOMER_DATA_REVIEWER` is a separate, similarly Business-scoped
  RoleBinding for the customer-data duplicate-review queue.

**Consequences:**
- A person covering two Businesses holds two `RoleBinding` rows; revoking one
  never revokes the others.
- Consumers must ask "may this principal do X *for this Business*" and may
  never infer it from `OWNER`, `isPlatform`/`DEV`, WorkspaceMembership or
  ancestry alone.

### ADR-022 — Canonical Identity and Access Management boundary
Owner: DOM-IAM

Legacy: ADR-045

**Status:** Approved, Phase 0 implemented (FEAT-030).

**Context:** Web, LINE, API/MCP, agent and tool paths each authenticated and
authorized differently; authentication was token-centric, Membership had no
lifecycle, and there was no single shared policy-enforcement point — seams
could disagree after revocation or when a client/model supplied
scope-looking fields.

**Decision:**
- `Person.id` is the only canonical human principal id; every external
  subject (LINE, OIDC, email) is a namespaced attribute, never a primary key.
- A successful login creates a persisted `Session` (hash of the opaque token,
  expiry, assurance, status); every protected request revalidates the live
  row; expiry, revocation, deleted Person or inactive Membership denies the
  next request.
- Only `ACTIVE` Membership rows contribute to visibility, staff
  classification or authorization.
- The identity domain owns `resolveAuthorizationContext()`/`authorizeScope()`
  as the one policy-enforcement point every trusted request, agent turn,
  action gate and tool invocation must resolve before protected work; the
  context is immutable for the turn and cannot be widened by payload, prompt,
  model output or tool arguments.
- LINE signature verification proves event origin only; a server-owned
  onboarding/linking flow resolves the Person, never raw channel claims.

**Consequences:**
- Web, API, LINE, agent and tool paths share one policy vocabulary.
- Session revocation is effective across process restarts once they share the
  database.
- MFA, recovery, device management and hosted-provider rollout remain later
  phases, not represented as complete by this decision.

### ADR-023 — Membership is a grant with a lifecycle, not a membership fact
Owner: DOM-IAM

Legacy: ADR-077

**Status:** Accepted, implemented (FEAT-031).

**Context:** `Membership` could be created by three services in two lanes but
withdrawn by nothing — no writer ever set `status`, and the only removal path
was a hard delete that destroyed the evidence a grant had existed.
`businessId IS NULL` meant "every Business in the Tenant" to one reader and
"refuse" to another, and `ON DELETE SET NULL` promoted a deleted Business's
members to the whole Tenant.

**Decision:**
- `Membership` carries its own provenance (`grantedByPersonId`, `grantReason`,
  `grantSource`, `expiresAt`) and its own end (`revokedAt`,
  `revokedByPersonId`, `revokeReason`); rows are never deleted.
- Four lifecycle operations — `suspendMembership`, `reinstateMembership`,
  `revokeMembership`, `offboardPerson` — each require a reason, cascade to
  dependent `RoleBinding` rows, and refuse 409 `LAST_OWNER` rather than
  stranding a Business with no live owner.
- `scopeType` (`TENANT`/`BUSINESS`) replaces the implicit null-as-wildcard
  reading, held by a database CHECK; `ON DELETE RESTRICT` replaces `SET NULL`
  on the Business/Workspace/Project ancestry columns.
- `Membership` gets exactly one writer, inside `src/modules/identity/`,
  enforced by a preflight ratchet (`membership-writer`).
- A declared status/enum value nothing ever writes is a new preflight
  failure class (`unreachable-state`).

**Consequences:**
- An owner can suspend, reinstate or revoke a grant with a reason; deleting a
  Business now fails while grants exist, on purpose.
- Erasure refuses 409 `PRINCIPAL_HAS_LIVE_GRANTS` while any grant is live —
  offboarding is a prerequisite of erasure, not something erasure silently
  performs.

### ADR-024 — Employment is not Membership, and a legal entity lives inside a Tenant
Owner: DOM-IAM

Legacy: ADR-078

**Status:** Accepted, implemented (FEAT-032).

**Context:** The HR roster read `Membership` directly, so a tenant-wide OWNER
grant looked like an employee, a suspended Membership made staff vanish from
the roster, and a LINE-originated Person with no Membership could never
appear. Separately, `LegalEntity` had no `tenantId` at all — two Businesses in
different Tenants could reference the same legal entity — and
`Branch.taxBranchCode` conflated an operating site with a legal entity's VAT
registration.

**Decision:**
- `Employment` is a new, additive HR record (`employeeNo`, `title`,
  `employmentType`, lifecycle `status`); `resolveViewer` and the rest of
  identity never read it, enforced by a source-scanning test. `people-service`
  derives `hasSystemAccess` **from** `Membership`, never the reverse.
- `LegalEntity.portfolioId` becomes `LegalEntity.tenantId`, with the same
  `UNIQUE(id, tenantId)` + composite-FK pattern as `Business`; a Business may
  reference a LegalEntity only in its own Tenant.
- `TaxRegistrationBranch` is split out of `Branch.taxBranchCode`; `Branch`
  gains `kind` (`SITE`/`WAREHOUSE`/`KITCHEN`/`OFFICE`) so it can say what it
  is independently of whether it has a tax registration.
- Creating a `LegalEntity` stays an installation-operator act; Tenant
  ownership is sufficient only to register an additional
  `TaxRegistrationBranch` on an entity the Tenant already administers.

**Consequences:**
- A suspended staff member stays listed as staff whose access is suspended; a
  shareholder with no employment relationship stops appearing as one.
- A warehouse is a first-class Branch with no tax identity of its own.

### ADR-025 — Access invite, segregation of duties, and the operator lifecycle
Owner: DOM-IAM

Legacy: ADR-079

**Status:** Accepted, implemented (FEAT-033); mint/accept HTTP routes for
TENANT/BUSINESS scope and an `issueOperatorGrant` CLI/route are separable
follow-on work not yet shipped.

**Context:** There was no Business-level invitation (only immediate
`addBusinessMembership` by exact code/email); segregation of duties was a
comment in `rbac.js`, not a control (`PROCUREMENT_BUYER` held both order and
receipt permissions, and a payment recorder could verify their own payment);
and this installation could mint exactly one non-renewable, non-expiring
operator grant with no record of its use.

**Decision:**
- `AccessInvite` generalises `WorkspaceInvite` to PORTFOLIO/TENANT/BUSINESS
  scope; TENANT/BUSINESS acceptance creates a `Membership` only through
  `grantBusinessMembership`, binding to the accepting session's `personId`,
  never resolved from the invited email.
- `ROLE_CONFLICTS` declares `SALES_REP`/`PAYMENT_VERIFIER` and
  `PROCUREMENT_BUYER`/`GOODS_RECEIVER`; `assignRoleBinding` refuses 409
  `ROLE_CONFLICT` unless a Tenant owner passes `sodOverride: { reason }`.
  `applyPaymentAction`/`postGoodsReceipt` refuse self-verification/self-post,
  **including for a Business OWNER**, unless `selfVerifyAttested: true` is
  passed and recorded in the audit payload.
- `issueOperatorGrant` requires an existing standing operator, a mandatory
  reason and `expiresAt` capped at 90 days; renewal supersedes the prior
  ACTIVE grant in the same transaction. `assertOperatorAndRecordUse` records
  one `OPERATOR_ACTION` audit event per successful audit-read or backup
  preview/restore; a denied attempt writes nothing.
- The resolver expands a TENANT-scoped `RoleBinding` to every ACTIVE Business
  in that Tenant, independent of `visibleBusinessIds`.

**Consequences:**
- Three-way match is possible in procurement; revenue integrity holds at the
  transaction, not only at role assignment.
- This installation can recover from a lost operator credential without
  hand-written SQL, and the operator's own use of that power is itself
  audited.

### ADR-026 — Audit events carry their own scope, and an owner can read their own access history
Owner: DOM-IAM

Legacy: ADR-080

**Status:** Accepted, implemented (FEAT-033).

**Context:** `AuditEvent` had no `tenantId`/`businessId`/`reason` columns —
scope lived only inside `payloadJson` for whichever writer thought to include
it — and `GET /api/audit` was operator-only, so a Business OWNER could never
read who was granted access to their own Business.

**Decision:**
- `AuditEvent` gains seven nullable columns (`tenantId`, `businessId`,
  `reason`, `beforeJson`, `afterJson`, `requestId`, `sessionId`); only the
  Membership/RoleBinding lifecycle services and `access-invite-service.js`
  populate them going forward — no retroactive backfill (append-only,
  `SEC-003`).
- `listAccessHistory({ businessId | tenantId | personId })` reads exactly one
  scope, authorized by `ownsBusiness`/`ownsTenant`/self/operator, 404-shaped
  identically for an unowned and a nonexistent scope.
- `listBusinessAccess({ businessId })` reads current-state `Membership` rows
  (every status) with granting/revoking person joined in — not a replay of
  the event stream.
- `actorId` stays a UUID; a display name is resolved at read time, never
  denormalized onto the row.

**Consequences:**
- An owner can finally answer "who has access to my Business, and who put
  them there". Rows written before this migration stay silent on scope by
  design; a full retrofit across every `recordAudit` call site is named
  follow-up work, not performed here.

### ADR-027 — Explicit Superadmin authority
Owner: DOM-IAM
Relations: decided_by: ADR-025
Legacy: ADR-082

**Status:** Accepted (owner-approved 2026-09-13), implemented (FEAT-033,
FEAT-033).

**Context:** An `isOperator` grant resolves as DEV with every Business
visible but no owned Business or Tenant, so the installation operator could
not administer owner-only screens (Users & Permissions). Adding Membership
rows cannot compose that authority.

**Decision:**
- `SUPERADMIN` is a separate `PlatformGrant` capability; only the trusted
  browser session port supplies it to the viewer resolver, read fresh from
  the server store every request. Plugin/API/device identities never inherit
  it.
- A Superadmin resolves `isSuperadmin: true`, `isPlatform: true`,
  `isOperator: true`, with all real Tenant/Business/Portfolio ids enumerated
  each request — future scopes enter automatically while the grant is live.
- Existing scoped guards, MFA/step-up, segregation-of-duties and lifecycle
  rules are unchanged; issuance/revocation go through a local CLI requiring
  exact identity, a reason and a maximum 90-day expiry, audited atomically.
- **Amendment (2026-09-13):** a live OPERATOR may additionally revoke one
  explicitly selected Membership grant or end one Employment record with a
  reason (HR Remove), without gaining any other owner-only authority.

**Consequences:** Cross-tenant administrative authority exists without
silently broadening every OPERATOR or introducing a hardcoded email bypass.

### ADR-028 — MFA factor secrets are sealed at rest
Owner: DOM-IAM

Legacy: ADR-088

**Status:** Accepted, implemented (FEAT-030).

**Context:** `MfaFactor.secret` stored the base32 TOTP secret in the clear —
readable by a leaked database credential, a support-class read or any backup
export, and writable by anyone who could reach the table, which would let
them pass step-up as that person. TOTP cannot be hashed (verification needs
the secret back).

**Decision:**
- `MfaFactor.secret` holds `mfa.v<keyVersion>.<nonce>.<tag>.<ciphertext>`
  (AES-256-GCM), AAD-bound to `[table, keyVersion, personId, factorId]`, so a
  value copied to another factor or Person fails authentication rather than
  opening.
- Keys come from deployment configuration (`ZURI_MFA_SECRET_KEY` +
  `_VERSION`, retired keys as `_V<n>`); in production a missing/malformed
  current key refuses every MFA operation with 503 before any read/write.
- Rows written before this change are migrated by an explicit, idempotent
  sweep (`scripts/seal-mfa-factor-secrets.mjs`), never by re-encrypt-on-read
  (which would leave an indefinite plaintext-accepting reader alive).
- `mfa-secret-seal.js` is the one file that creates a cipher over the column,
  importing only `node:crypto`, so a later shared credential vault can
  replace its body without touching a caller.

**Consequences:** A backup export now carries sealed values; restoring under
a different key fails that deployment's factors closed (revoke and
re-enroll), never open.
