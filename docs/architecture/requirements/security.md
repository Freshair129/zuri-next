---
title: System security and privacy requirements (SEC-SYS)
status: draft
owner: architecture
legacy_source: docs/PRD-SDD-v1.0.md §2.3 (zuri-ai @ 9e5b104e)
---

# SEC-SYS — System security and privacy requirements

Numbering mirrors the legacy row (`SEC-nnn` ⇐ `SEC-nnn`). Two legacy rows are
not re-declared: **legacy:SEC-004** (a false "no customer PII" claim, burnt in the
legacy registry) and **legacy:SEC-025** (Edge Device credential boundary, retired by
ADR-095).
Their numbers stay unused. `Status: declared` marks an approved control not yet
implemented.

## Scope and isolation

### SEC-001 — Cross-scope access is refused
Every read and write SHALL be checked against the caller's authorized
Tenant/Business/Workspace scope and SHALL refuse cross-scope access. Where existence
of a foreign resource could leak, the refusal SHALL be indistinguishable from
not-found (404-shaped).
Applies to: all domains
Relations: decided_by: ADR-086
Legacy: SEC-001

### SEC-002 — Imported plans execute nothing
Every envelope SHALL be validated by a strict schema that rejects unknown properties;
nothing in an imported plan SHALL be executed.
Applies to: DOM-PRJ, DOM-AGT, DOM-INV, DOM-AST
Relations: decided_by: ADR-098
Legacy: SEC-002

### SEC-003 — Append-only audit for significant mutations
Every significant mutation SHALL write an `AuditEvent` in the same transaction; audit
events SHALL be append-only (never updated or deleted by the application) and SHALL
exclude tokens, secrets and customer content.
Applies to: all domains
Legacy: SEC-003

### SEC-020 — Knowledge never deduplicates across tenants or embeds secrets
Knowledge deduplication SHALL compare only within one Tenant (the Tenant is part of
the ingestion identity). Secrets SHALL be redacted before parsing and SHALL never be
embedded, indexed, logged or written to a quarantine record. Source authenticity SHALL
be verified where the channel allows; transport and sensitive storage SHALL be
encrypted.
Applies to: DOM-KNW
Legacy: SEC-021

### SEC-030 — Conversation content reaches knowledge only as approved candidates
Customer conversation content SHALL never become GKS or retrieval-substrate content
except as a locator-only question-and-answer candidate approved by a Business OWNER or
LINE OA publisher and admitted as a text source, with Zero-PII enforced at candidate
creation and again at classification. A LINE answer SHALL read only the Business's
published corpus generation under the job's server-derived scope, never a substrate
store directly and never a scope from a request, prompt or model output.
Status: declared.
Applies to: DOM-KNW, DOM-AGT, DOM-CRM
Relations: decided_by: ADR-090
Legacy: SEC-032

## Identity, sessions and credentials

### SEC-007 — Pre-shell identity fails closed
Principal, role, platform grant, visible Businesses and domains SHALL come only from
a trusted server session plus persisted authority. A missing or invalid session SHALL
return 401 before any scope query; an identity-adapter failure SHALL return 503; there
SHALL be no seeded-owner or client identity bypass at runtime.
Applies to: DOM-IAM
Legacy: SEC-008

### SEC-013 — Onboarding and invites require trusted identity
Profile, invite and membership mutations SHALL fail closed without trusted identity.
Invite tokens SHALL be single-use, expiring, stored as hashes and audited.
Applies to: DOM-IAM
Legacy: SEC-014

### SEC-017 — IAM fails closed on ambiguity
External subjects, cookies, payloads, prompts, model output and tool arguments SHALL
never establish or widen authority. Live Session/Membership/RoleBinding state SHALL be
checked before protected work; audit payloads SHALL exclude tokens, secrets and
customer content.
Applies to: DOM-IAM, DOM-AGT
Legacy: SEC-018

### SEC-005 — Enterprise API requires a Tenant-bound key
Every enterprise API route SHALL require a Tenant-bound API access key, stored as a
digest, listed as metadata only, revocable with effect on the next request.
Applies to: DOM-IAM, DOM-PRJ
Legacy: SEC-006

### SEC-018 — Service-account keys are Tenant-bound and hash-stored
A data-plane service-account key SHALL authenticate only the Tenant it is bound to and
SHALL never widen to installation-operator authority. The raw secret SHALL exist only
in the mint response; only its SHA-256 hash and a short non-reconstructing prefix are
stored. Revocation takes effect on the next request.
Applies to: DOM-IAM, DOM-INT
Legacy: SEC-019

### SEC-021 — Plugin authorization is a separate public-client boundary
Plugin authorization SHALL use PKCE (S256) authorization codes that are single-use and
hash-stored; access tokens SHALL be opaque, 15-minute and hash-stored; a replayed code
SHALL be refused and SHALL revoke the session it minted; client id, redirect URI and
installation SHALL match an allowlist exactly. Consent SHALL require an explicit POST
carrying the session, a session-bound anti-CSRF token and a signed, 5-minute request
token; `GET` SHALL render only. All responses are `no-store`; no error echoes a code,
token or internal message.
Applies to: DOM-IAM
Legacy: SEC-022

### SEC-024 — Erasure follows offboarding
Principal erasure SHALL be refused (409) while the principal holds any non-revoked
Membership, RoleBinding or PlatformGrant in the Tenant; when it proceeds it SHALL
delete the principal's credentials and disable access. Erasure SHALL never revoke
grants itself.
Status: declared.
Applies to: DOM-IAM, DOM-CRM
Legacy: SEC-026

### SEC-025 — Operator access is time-boxed and its use audited
Every non-bootstrap installation-operator grant SHALL carry a mandatory expiry of at
most 90 days, honoured even while the row is ACTIVE; renewal SHALL be a new row.
Reading the installation-wide audit stream or previewing/restoring a whole-installation
backup SHALL each record one operator-action audit event.
Applies to: DOM-IAM, DOM-PLT
Legacy: SEC-027

### SEC-026 — Access history is authorized like the grant it describes
Access history SHALL be readable only by the owner of the Business/Tenant in scope,
the subject themself, or the installation operator. A scope the caller does not own
and a scope that does not exist SHALL return the same 404.
Applies to: DOM-IAM
Legacy: SEC-028

### SEC-027 — MFA secrets are sealed at rest
A TOTP secret SHALL be stored only as authenticated ciphertext bound to its person and
factor row, under a key the database does not hold. Without a valid key, production
SHALL answer 503 before any factor is read or written; opening SHALL refuse legacy
plaintext, unknown key versions, a value bound to another row and any tampering. No
secret appears outside the one-time enrollment response.
Applies to: DOM-IAM
Legacy: SEC-029

### SEC-019 — Operator console fails closed
Operator-only (platform control) pages SHALL render content only after the trusted
viewer satisfies the installation-operator predicate; unauthorized HTML SHALL contain
no programme data. Labels, visible domains or Business ownership SHALL NOT be
operator authority.
Applies to: DOM-PLT, DOM-IAM
Legacy: SEC-020

## Secrets and channel credentials

### SEC-028 — Channel and provider credentials are write-only
Channel and model-provider credential material SHALL never appear in an API response,
log, audit payload, error message or cause, backup snapshot, ORM column or client
state beyond one input's lifetime. It SHALL be displayed only as a mask plus the last
four characters of a non-secret identifier. Store functions SHALL run with pinned
search paths under dedicated writer/reader roles; envelope-store ciphertext and its
key-encryption key SHALL be excluded from backup export.
Applies to: DOM-INT, DOM-LOA
Legacy: SEC-030

### SEC-031 — Secret kind cannot be confused
Resolving a secret reference under the wrong `secretKind` SHALL fail exactly like a
wrong-store resolution (no distinguishable error). A connection holding a credential
of one kind SHALL refuse a write of another kind before any secret reaches a store.
Applies to: DOM-INT
Legacy: SEC-033

### SEC-008 — Public LINE knowledge access is server-only and deny-by-default
LINE-facing knowledge reads SHALL use a server-owned Tenant/Business binding, no
public service-role key, explicit database grants plus row-level security for exposed
tables, allow-listed fields and queries, and SHALL treat prompt data as untrusted.
Secrets, PII, cost, margin and invoice data SHALL be excluded from prompts, logs and
responses.
Applies to: DOM-AGT, DOM-KNW
Legacy: SEC-009

### SEC-009 — Production LINE reads need database scope and verified binding
Private-schema base grants SHALL be revoked from public, anonymous, authenticated and
service roles; the runtime SHALL reject privileged credentials and client-selected
scope; credential/destination hashes SHALL be compared in constant time; inactive or
expired bindings SHALL return no data.
Applies to: DOM-AGT
Relations: decided_by: ADR-086
Legacy: SEC-010

### SEC-010 — Activation tooling never echoes credentials
Activation tooling SHALL never persist or echo credentials, full connection URLs,
authorization headers, reply tokens or raw customer data. Database mutation probes
SHALL always roll back; canary readiness SHALL default to dry-run and have no
binding-update or send capability.
Applies to: DOM-AGT
Legacy: SEC-011

### SEC-011 — Only a dedicated operator role can activate a binding
Activation secrets SHALL live only in environment/secret store; a dedicated operator
database role SHALL update only the exact binding and append events; runtime, data-API
and service roles SHALL NOT be able to activate. Receipt ingestion SHALL reject raw
destination, authorization, reply token, message content and PII.
Applies to: DOM-AGT
Legacy: SEC-012

### SEC-014 — Production LINE runtime refuses unsafe credential sources
Production SHALL refuse a local file vault, a raw model credential in the environment,
client-selected Tenant/Business/connection ids, and ambiguous, missing, expired,
unauthorized or unavailable secrets. At most one active primary LINE-LLM connection
SHALL exist per Tenant/Business (database invariant); rotation, revocation and
rollback SHALL be audited without secrets or PII.
Applies to: DOM-INT, DOM-AGT
Legacy: SEC-015

### SEC-015 — Integration management never exposes secret material
Integration management SHALL refuse client-selected scope/authority, store only an
opaque secret-store reference, audit a redacted summary and fail closed on resolver
failure, ambiguous connection or unauthorized scope. The management UI SHALL NOT be
able to activate LINE routing or send a canary.
Applies to: DOM-INT
Legacy: SEC-016

### SEC-035 — Third-party OAuth and webhook boundary (Notion)
OAuth state SHALL be unpredictable, actor/scope-bound, hash-only, expiring and
consumed once; OAuth codes and access/refresh tokens SHALL never appear in logs,
post-callback URLs, browser responses or ordinary metadata. A webhook verification
token SHALL be encrypted at rest, accepted only when none is configured, revealed once
behind operator step-up (AAL2) and replaced only by an audited AAL2 reset; event
webhooks SHALL fail closed unless the signature is a constant-time HMAC-SHA256 match
over the original bounded request bytes.
Applies to: DOM-INT
Legacy: SEC-037

## Memory and agent context

### SEC-012 — Private memory retrieval is policy-before-retrieval
No client, model, prompt or thread label SHALL select a memory vault; the authorized
vault set SHALL be resolved from server policy before any retrieval; identity or
Membership revocation SHALL deny the next turn; row-level security remains defence in
depth and user-editable metadata is never authorization input.
Applies to: DOM-AGT, DOM-IAM
Relations: decided_by: ADR-088
Legacy: SEC-013

### SEC-016 — Market translation fails closed on provenance scope
Client or payload fields SHALL NOT select or widen Tenant, Business or connection
scope; raw records SHALL be resolved only through a repository bound to explicit
trusted scope, with explicit null Business distinguished from omitted scope.
Applies to: DOM-MKI, DOM-INT
Legacy: SEC-017

## Files and evidence

### SEC-006 — Local file operations are scope- and root-contained
Every local file operation SHALL authorize Tenant/Business/Project scope and enforce
containment in the mounted root, rejecting absolute paths, traversal and
symlink/junction/reparse escape. OS "reveal" SHALL be a local-only capability; a
hosted request SHALL never launch a server process.
Applies to: DOM-PRJ
Legacy: SEC-007

### SEC-022 — Asset intake fails closed before parsing
Asset intake SHALL fail closed before evidence parsing or entity lookup when viewer,
Tenant, Business, file, Person, Project or transport binding is untrusted or out of
scope. Files SHALL be type/size/content checked and may be quarantined; URLs, OCR/model
output, workbook cells, QR codes, LINE payload fields and client scope SHALL never
authorize access or approval.
Applies to: DOM-AST
Legacy: SEC-023

### SEC-023 — Asset evidence stays server-confined
Scope SHALL be authorized before bytes, model or entity disclosure; content SHALL be
verified (not extension); object/provider/channel credentials SHALL stay out of client
bundles, responses, logs, audits and workbooks; storage SHALL be private with
provider-side retention off; malformed provider output SHALL be rejected without
changing review/readiness state.
Applies to: DOM-AST
Legacy: SEC-024

## Personal data (PDPA)

### SEC-004 — Per-Business consent before CRM sharing
Sharing a customer across Businesses in a Tenant SHALL require a recorded per-Business
consent attestation with an audit trail.
Status: partial — attestation and audit exist on the customer record; redaction,
provider terms, retention and gating of AI processing are open.
Applies to: DOM-CRM
Legacy: SEC-005

### SEC-029 — Every copy of conversation content has retention and erasure
Every copy of a person's conversation content (CRM record, raw channel evidence, trace
inputs, memory session events, episodic memory, knowledge candidates, cold archive)
SHALL have a retention window and an erasure path; a Tenant MAY shorten but never
lengthen a window; a tier outside the core counts as erased only after acknowledging
it, with the pending state visible. Erasure MAY be deferred only for the cold archive
under an OWNER-recorded legal hold. Episodic/cross-thread memory SHALL additionally
require the customer's consent and a direct audience.
Status: declared.
Applies to: DOM-CRM, DOM-AGT, DOM-KNW, DOM-INT
Legacy: SEC-031

### SEC-032 — Cold chat archive is encrypted and owner-retrievable only
The chat evidence archive SHALL be encrypted at rest (AES-256-GCM) under a per-customer
data key wrapped by a dedicated archive key-encryption key that is never the general
secret KEK, never stored in the database or repository, and has an owner-held offline
backup. Each archive file SHALL have a hash-chained manifest row. Retrieval SHALL be
allowed only to an OWNER at AAL2 with a case reference and SHALL be audited; no agent,
model, knowledge corpus or memory reads the archive. A customer's data key SHALL be
destroyed on last-line expiry or erasure unless an OWNER-recorded legal hold applies.
Status: encryption implemented; legal hold declared.
Applies to: DOM-CRM
Legacy: SEC-034

## Self-hosted inference (declared)

### SEC-033 — Inference destinations and credentials are confined
Private inference destinations SHALL be operator-allowlisted and validated at
connection time over authenticated transport, with no redirects or SSRF; credentials
SHALL stay within the write-only secret and transport boundary. A browser SHALL never
supply a runtime URL.
Status: declared.
Applies to: DOM-AGT, DOM-INT
Legacy: SEC-035

### SEC-034 — Inference processing scope and cache isolation
Processing permission and trusted Tenant/Business/conversation authority SHALL bound
every prompt and cache-reuse boundary; selecting a self-hosted provider SHALL never
imply cloud consent, on-premise residency, shared private memory or an unauthorized
provider fallback.
Status: declared.
Applies to: DOM-AGT
Legacy: SEC-036
