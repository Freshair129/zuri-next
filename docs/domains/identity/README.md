---
id: DOM-IAM
title: Identity & Access
status: approved
relations:
  decided_by: []
---

# DOM-IAM — Identity & Access

## Purpose

Who a principal is, what session or credential currently speaks for them, and
what they may see or do. Owns external-identity resolution (channel subject →
`Person`), the persisted session/credential lifecycle, the one shared
policy-enforcement point used by web/API/agent/tool paths, the viewer gate
(role, visible/owned Businesses, per-Business domain visibility), Membership
and RoleBinding as withdrawable grants, the request-identity family for
non-browser callers (SoT data-plane, Enterprise API, plugin, edge device,
agent harness), MFA/passkey step-up, and PDPA erasure. Absorbs the legacy
`people` module's HR/employment behavior (Employment records), because
`people` carried no charter of its own and its HR write path exists only to
avoid conflating "has access" with "works here" — a question this domain
already owns the authoritative answer to (Membership).

Does not run agent turns, ingest messages, or decide product/business rules
for a domain it is not; it answers "who is this, what may they see, what may
they do", nothing else.

## Ubiquitous language

| Term | Meaning |
|---|---|
| Person | The one canonical human principal. Provider subjects, LINE user ids, emails and API identifiers are external attributes mapped through a namespace — never a primary key (BR-047). |
| Membership | A withdrawable **grant** (not a membership fact) of Tenant- or Business-scoped role and per-domain visibility, with its own provenance (who, why, source) and its own end (revoked/suspended, by whom, why). |
| RoleBinding | A generic, Business- (or Tenant-, since ADR-025 D4) scoped capability assignment (e.g. `PRODUCT_OWNER`, `CUSTOMER_DATA_REVIEWER`, `PROCUREMENT_BUYER`), independent of `Membership.role`. |
| Employment | An HR assignment record (title, type, lifecycle) — never an authorization input. Answers "who works here", never "who may log in here". |
| Viewer | The resolved authorization snapshot for a request: role, `visibleBusinessIds`, `ownedBusinessIds`, `domainsByBusinessId`, `platformGrant`. Recomputed every request from server-held state. |
| Session | The live, revocable server-side row behind a signed browser cookie. The cookie is transport only. |
| Request identity | Any of the five non-Person-session ways a caller authenticates: `SotDataPlaneKey`, `ApiAccessKey`, `PluginSession`, `EdgeDeviceCredential`, `HarnessCredential`. Each is scoped narrower than a Person viewer and never produces `isOperator`. |
| Profile | An identity fact about `Person` (name, phone, completion marker) — never an authorization grant (BR-061). |
| Workspace collaboration | The `Portfolio`-scoped membership/invite layer (`WorkspaceMembership`/`AccessInvite` PORTFOLIO scope), deliberately never read by `resolveViewer`. |
| Operator / Superadmin | `PlatformGrant` capabilities (`OPERATOR`, `SUPERADMIN`) held by a Person, resolved fresh per request from the server-held store, never inferred from role or ownership. |

## Owned data

| Entity | One line |
|---|---|
| Person | The canonical human principal; nullable-until-Profile name/phone fields, erasure markers. |
| ExternalIdentity | Compatibility record binding a `(tenant, provider, providerSubject)` — e.g. LINE — to one Person. |
| ChannelIdentity | Forward channel-binding contract with explicit pending/verified/revoked lifecycle. |
| IdentityLinkToken | Single-use nonce binding an unauthenticated channel subject to an existing Person. |
| ExternalRef | Generic `(system, value)` → internal entity id mapping so an external id is never a key. |
| Membership | The one access grant: Tenant/Business scope, role, per-domain visibility, provenance and end. One writer (identity), enforced by a preflight ratchet. |
| RoleBinding | Business- or Tenant-scoped capability assignment (`roleKey`), independent lifecycle, SoD conflict tracking. |
| Employment | HR assignment (title, type, status) over a Person at a Business; never read by `resolveViewer`. |
| PersonCredential | scrypt password hash for local credential login. |
| PasswordResetToken | Single-use, hash-bound, one-hour password reset token. |
| Session | Revocable server-side row behind the signed `zuri_session` cookie; assurance level and step-up window. |
| MfaFactor | TOTP/passkey-adjacent factor; `secret` holds an AES-256-GCM envelope, never plaintext (ADR-028). |
| PasskeyCredential | FIDO2/WebAuthn credential for a Person. |
| RateLimitBucket | Fixed-window counters for the credential-write rate limit. |
| PlatformGrant | Server-held capability store (`OPERATOR`, `SUPERADMIN`); time-boxed, revocable, audited. |
| WorkspaceMembership | Portfolio-scoped collaboration membership; never read by `resolveViewer` (BR-061). |
| AccessInvite | Scoped (PORTFOLIO/TENANT/BUSINESS) single-use invitation; generalises the legacy `WorkspaceInvite`. |
| SotDataPlaneKey | Tenant-bound bearer credential for the SoT external data plane. |
| ApiAccessKey | Tenant-bound bearer credential for the Enterprise API. |
| PluginInstallation / PluginAuthorizationCode / PluginSession | Public-client OAuth-style plugin delegation: installation, single-use code, 15-minute opaque session. |
| EdgeDeviceCredential | Business-scoped bearer credential a Zuri Edge Device presented. **Retired surface (ADR-095 D1/D3): schema and historical rows preserved; no route mints, lists or revokes one any longer.** |
| HarnessCredential | Person- and installation-bound, report-only credential for an agent harness. **Retired surface (ADR-095 D1/D3): schema and historical rows preserved; pairing/reporting routes removed.** |

## Business rules

### BR-011 — Membership has exactly one writer
Owner: DOM-IAM
`membership.create`, `.update` and `.delete` may appear only inside
`src/modules/identity/`; no other module lane may write the table directly,
enforced by a preflight ratchet (ADR-023 D8).

### BR-012 — A request identity never upgrades to another identity's authority
Owner: DOM-IAM
`Session`, `SotDataPlaneKey`, `ApiAccessKey`, `PluginSession`,
`EdgeDeviceCredential` and `HarnessCredential` are five distinct, narrower-than-
Person identities. Each is checked ahead of, never instead of, the session
seam; none may satisfy a check written for another (`isOperator`,
`ownsBusiness`, `isApiAccessFor`); a plugin session never inherits a platform
`DEV` grant.

### BR-013 — Authorization is recomputed from server-held state every request
Owner: DOM-IAM
`resolveAuthorizationContext`/`authorizeScope` resolve Person, scope, active
Membership/RoleBinding and platform grant fresh per request; no request
payload, prompt, model output or tool argument may widen what is resolved
(ADR-022 D4).

### BR-014 — Employment never contributes to visibility or permission
Owner: DOM-IAM
`resolveViewer` and the rest of `src/modules/identity/` never read
`Employment`; system access is derived **from** `Membership`, never the
reverse (ADR-024 D1).

## Public contracts

- `API-088` — `GET /api/entry`, `GET /api/viewer` (viewer-scoped read model)
- `API-087` — `/api/auth/login`, `/api/auth/logout`, `/api/auth/signup`, `/api/auth/reset-password`, `/api/auth/step-up`
- `API-089`, `API-095` — `/api/auth/mfa/**`, `/api/auth/webauthn/**`
- `API-091` — `/api/platform/users/**` (roster, memberships, password-resets, offboard)
- `API-086` — `/api/platform/access-history`, `/api/platform/businesses/[businessId]/grants`
- `API-090` — `/api/onboarding/**`
- `API-096` — `/api/workspace-invites/**`, `/api/workspace-memberships`
- `API-092` — `/api/plugin/auth/**`
- `API-093` — `/api/profile`

Retired (ADR-095 D1, 2026-09-24 — routes removed from the tree; `EdgeDeviceCredential`/`HarnessCredential` schema and historical rows preserved per D3): `/api/platform/edge-devices/credentials/**`, `/api/edge/pairing/**`, `/api/platform/harness-pairing/**`, `/api/platform/harness-devices/**`.
- EVT (audit only, written through the shared `recordAudit` helper into project-manager's `AuditEvent` — see `BR-081`)

Full method/path/auth/error detail: [contracts.md](contracts.md).

## Capabilities

| CAP | Meaning |
|---|---|
| `isOperator` | Holds an ACTIVE, unexpired `PlatformGrant{capability: OPERATOR}` or `SUPERADMIN`. |
| `isSuperadmin` | Holds an ACTIVE, unexpired `PlatformGrant{capability: SUPERADMIN}`. |
| `ownsBusiness` / `ownsTenant` | Holds an ACTIVE OWNER-scoped Membership at that Business/Tenant (or a Superadmin/enumerated grant). |

## Depends on

- `DOM-PRJ` (project-manager) `AuditEvent` — identity's access-history read
  models (`FR-033-001`, `FR-033-002`) read a table project-manager owns
  (sanctioned read-slice pattern, `ADR-026` D5).
- `DOM-PRJ` `Business`/`Tenant`/`Workspace`/`Project` ancestry for scope
  resolution and referential invariants (`ADR-023` D4).
- `DOM-CRM` `Person` shared-write exception during linking, erasure and
  onboarding (`legacy:CHARTER` "Known shared-write exceptions").

## Legacy sources

- `docs/domains/identity/CHARTER.md`
- `docs/PRD-SDD-v1.0.md` (FR-029-004, 022, 031, 038, 042, 044, 061, 062, 066, 067,
  076, 094–096, 102, 104, 107, 120–123, 144, 191–200, 220, 222)
- `docs/FEATURES.md` (FEAT-029, 027, 028, 029, 030, 035 [split])
- `docs/decisions/ADR-{017,027,033,045,077,078,079,080,082,088}-*.md`
- `docs/decisions/ADR-110-RETIRE-EDGE-DEVICE-AND-HARNESS-SURFACES.md` (not
  assigned to this group, but read directly: it retires `legacy:FR-144`,
  `legacy:FR-220`, `legacy:FR-222` from this domain's live scope — confirmed
  against the worktree, where none of `edge-device-credential.js`,
  `edge-pairing*.js`, `harness-credential.js`, `harness-pairing*.js` or their
  routes exist any longer)
- `apps/server/prisma/schema.prisma` (identity-owned models)

<!-- BEGIN GENERATED: feature-index -->

## Feature index (generated)

### Owned features (11)

| Feature | Title | Delivery | Requirements |
|---|---|---|---|
| [FEAT-023](../../features/FEAT-023-entry-and-viewer-gate/feature.md) | Entry & Viewer Gate | live | 2 |
| [FEAT-024](../../features/FEAT-024-authorization-membership-roles-and-domain-visibility/feature.md) | Authorization — Membership, Roles & Domain Visibility | live | 5 |
| [FEAT-025](../../features/FEAT-025-onboarding-and-account-creation/feature.md) | Onboarding & Account Creation | live | 5 |
| [FEAT-026](../../features/FEAT-026-credential-and-operator-bootstrap/feature.md) | Credential & Operator Bootstrap | live | 2 |
| [FEAT-027](../../features/FEAT-027-sot-data-plane-service-account/feature.md) | SoT Data-Plane Service Account | live | 1 |
| [FEAT-028](../../features/FEAT-028-plugin-authentication-and-capability-discovery/feature.md) | Plugin Authentication & Capability Discovery | building | 1 |
| [FEAT-029](../../features/FEAT-029-production-iam-boundary/feature.md) | Production IAM Boundary | building | 6 |
| [FEAT-030](../../features/FEAT-030-access-grant-lifecycle/feature.md) | Access Grant Lifecycle | implemented | 3 |
| [FEAT-031](../../features/FEAT-031-org-employment-and-legal-entity/feature.md) | Org Employment & Legal Entity | implemented | 3 |
| [FEAT-032](../../features/FEAT-032-access-invite-sod-and-operator-lifecycle/feature.md) | Access Invite, SoD & Operator Lifecycle | implemented | 5 |
| [FEAT-033](../../features/FEAT-033-audit-access-evidence/feature.md) | Audit Access Evidence | implemented | 2 |

### Participating in cross-domain features (2)

| Feature | Part | Role | Feature owner |
|---|---|---|---|
| [FEAT-094](../../features/FEAT-094-connect-line-oa-yourself/feature.md) | FEAT-094-P02 | Credential-write step-up gate and rate limits | DOM-LOA |
| [FEAT-095](../../features/FEAT-095-chat-record-memory-tiers-and-retention/feature.md) | FEAT-095-P07 | Erasure propagation beyond Tier 1 (declared) | DOM-CRM |

### Hosted by services (1)

- [SRV-001](../../services/SRV-001-web/SERVICE.md)

### Classification (ADR-107)

Subdomain: **generic** · Role: **foundation** — declared in `registry/domains.yaml`.

### Context map (3)

| Direction | Context | Pattern | Evidence | Note |
|---|---|---|---|---|
| upstream of | all | open-host-service | BR-002, ADR-100, ARCH-001 | The one policy-enforcement point; every web, API, agent and tool path resolves its viewer here. |
| downstream of | DOM-PRJ | open-host-service | BR-001, BR-002, BR-003, ARCH-001 | Scope chain (Portfolio → Tenant → Business → Workspace → Project) and the audited-write seam every record hangs from. |
| upstream of | DOM-PLT | conformist | ARCH-001 | Operator-only projections read every domain as is and own nothing. |

<!-- END GENERATED -->
