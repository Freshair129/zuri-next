---
id: FEAT-094
title: Connect LINE OA yourself
type: cross-domain-feature
owner: DOM-LOA
runtime: SRV-001
participants:
  - domain: DOM-INT
    part: FEAT-094-P01
    role: "Credential vault for LINE channels"
  - domain: DOM-IAM
    part: FEAT-094-P02
    role: "Credential-write step-up gate and rate limits"
  - domain: DOM-INT
    part: FEAT-094-P03
    role: "Channel validation and installation-wide claim"
  - domain: DOM-LOA
    part: FEAT-094-P04
    role: "Self-serve wizard and DRAFT account"
  - domain: DOM-LOA
    part: FEAT-094-P05
    role: "Webhook registration and derived quiescence"
status: draft
delivery: implemented
legacy: [FEAT-036, FR-223, FR-224, FR-225, FR-226, FR-227, FR-228]
relations:
  depends_on: [API-142, API-143, API-144, API-145, API-161, API-138, API-141, API-123, API-121]
  decided_by: [ADR-046, ADR-047]
---

# FEAT-094 — Connect LINE OA yourself

## Summary

A Business owner connects a LINE Official Account from the browser with no operator
and no host file: after a TOTP step-up they enter the Channel ID and Channel secret
once in a Thai wizard; the server proves them with LINE, claims the bot for this
installation, stores the secret write-only in the credential vault and mints short-lived
tokens itself, creates a DRAFT account, sets and tests the webhook through LINE's API,
and decides on its own whether the old transport has gone quiet before server
transport is enabled.

## Scope

**In:** the credential vault and lifecycle for LINE channels; the credential-write
step-up gate and rate limits; the connect wizard and DRAFT account creation; the
installation-wide channel claim; webhook registration; derived legacy-transport
quiescence on ENABLE_SERVER.
**Out:** other credential kinds (FEAT-054); operator-mediated claim takeover
(future); conversation transport itself (FEAT-093).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-LOA |
| Runtime owner | SRV-001 |

| Part | Title | Owner | Runtime | FRs |
|---|---|---|---|---|
| FEAT-094-P01 | Credential vault for LINE channels | DOM-INT | SRV-001 | FR-094-001, FR-094-002, FR-094-003 |
| FEAT-094-P02 | Credential-write step-up gate and rate limits | DOM-IAM | SRV-001 | FR-094-004, FR-094-005 |
| FEAT-094-P03 | Channel validation and installation-wide claim | DOM-INT | SRV-001 | FR-094-006, FR-094-007 |
| FEAT-094-P04 | Self-serve wizard and DRAFT account | DOM-LOA | SRV-001 | FR-094-008 |
| FEAT-094-P05 | Webhook registration and derived quiescence | DOM-LOA | SRV-001 | FR-094-009, FR-094-010 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-094-001](requirements/FR-094-001-secrets-live-only-behind-the-secretstoreport.md) | Secrets live only behind the SecretStorePort | FEAT-094-P01 |
| [FR-094-002](requirements/FR-094-002-versioned-lifecycle-with-validation-before-activation.md) | Versioned lifecycle with validation before activation | FEAT-094-P01 |
| [FR-094-003](requirements/FR-094-003-revocation-and-restore-fence-the-account.md) | Revocation and restore fence the account | FEAT-094-P01 |
| [FR-094-004](requirements/FR-094-004-every-credential-write-requires-aal2.md) | Every credential write requires AAL2 | FEAT-094-P02 |
| [FR-094-005](requirements/FR-094-005-credential-writes-are-rate-limited.md) | Credential writes are rate-limited | FEAT-094-P02 |
| [FR-094-006](requirements/FR-094-006-the-server-proves-the-channel-with-line.md) | The server proves the channel with LINE before storing anything | FEAT-094-P03 |
| [FR-094-007](requirements/FR-094-007-one-line-bot-one-live-connection-per.md) | One LINE bot, one live connection per installation | FEAT-094-P03 |
| [FR-094-008](requirements/FR-094-008-the-thai-wizard-connects-and-creates-a.md) | The Thai wizard connects and creates a DRAFT account | FEAT-094-P04 |
| [FR-094-009](requirements/FR-094-009-a-publisher-registers-and-tests-the-webhook.md) | A publisher registers and tests the webhook through LINE | FEAT-094-P05 |
| [FR-094-010](requirements/FR-094-010-enable-server-derives-legacy-transport-quiescence-for.md) | ENABLE_SERVER derives legacy-transport quiescence for vault-backed accounts | FEAT-094-P05 |
| [NFR-094-001](requirements/NFR-094-001-credential-write-rate-limits.md) | Credential write rate limits | — |
| [NFR-094-002](requirements/NFR-094-002-credential-transport-hygiene.md) | Credential transport hygiene | — |
| [NFR-094-003](requirements/NFR-094-003-quiescence-window.md) | Quiescence window | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
