---
id: FEAT-046
title: Conversation intelligence
type: domain-feature
owner: DOM-CRM
runtime: SRV-001
status: draft
delivery: building
legacy: [FEAT-014, FR-126, FR-127, FR-128]
relations:
  depends_on: [FEAT-041, FEAT-043]
  decided_by: [ADR-039]
---

# FEAT-046 — Conversation intelligence

## Summary

A derived-intelligence layer over LINE conversations: per-conversation analysis runs
(contact type, engagement state, call-to-action, tags, summary), an AI-inferred
advisory Customer profile, and a per-Business Daily Sales Brief pushed over LINE.
Everything here is derived and recomputable from retained Messages; none of it is
identity. Only the analysis record exists in code today.

## Scope

**In:** ConversationAnalysis persistence and consent-gated reads (built); CustomerProfile
and DailyBrief (declared).
**Out:** the model/worker that produces analyses (DOM-AGT, not built); ad-revenue
attribution (the legacy `sourceAdId` is dropped until an Ad model exists); identity or
channel merging (DOM-IAM remains identity truth, FR-029-001).

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-CRM |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-046-001](requirements/FR-046-001-record-a-conversation-analysis-run.md) | Record a conversation analysis run | — |
| [FR-046-002](requirements/FR-046-002-read-analyses-behind-inbox-visibility-and-consent.md) | Read analyses behind inbox visibility and consent | — |
| [FR-046-003](requirements/FR-046-003-advisory-ai-inferred-customer-profile-declared.md) | Advisory AI-inferred Customer profile (declared) | — |
| [FR-046-004](requirements/FR-046-004-daily-sales-brief-declared.md) | Daily Sales Brief (declared) | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
