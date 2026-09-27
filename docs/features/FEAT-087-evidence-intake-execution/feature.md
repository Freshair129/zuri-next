---
id: FEAT-087
title: Evidence intake execution — cloud storage, extraction, review, workbook/Sheet, LINE handoff
type: domain-feature
owner: DOM-AST
runtime: SRV-001
status: approved
delivery: live
legacy: [FEAT-016]
relations:
  depends_on: []
  decided_by: [ADR-079]
---

# FEAT-087 — Evidence intake execution — cloud storage, extraction, review, workbook/Sheet, LINE handoff

## Summary

Executes the evidence half of FEAT-086's intake envelope: private cloud storage
for Asset photos/receipts/payment/warranty evidence, provider-neutral OCR/Vision
extraction that produces a reconstructable candidate a human must separately review,
Excel-workbook and bounded Google Sheets snapshot import/export through the same
canonical row adapter, and a trusted LINE OA/LIFF FileAsset handoff — all converging
on the same `AssetIntakeEnvelope` writer up to `READY_FOR_REGISTRATION`, never past
it.

## Scope

**In:** provider-neutral private object storage (`put`/`get`/`remove`), content
verification before provider invocation (size/magic-bytes/hash), OCR/Vision candidate
extraction with confidence and provenance, human ACCEPT/CORRECT/REJECT review,
bounded Excel/Google Sheets snapshot convergence and export, idempotent draft
correlation.

**Out:** creating a `RegisteredAsset` or assigning an Asset ID (FEAT-086);
edge-executed extraction (retired — see crosswalk); live/two-way Google Sheets sync;
LINE signature/byte-fetch (stays with zuri-cli, the transport owner); Procurement or
Finance mutation.

## Ownership

| Role | Value |
|---|---|
| Feature owner | DOM-AST |
| Runtime owner | SRV-001 |

## Requirements

| ID | Requirement | Part |
|---|---|---|
| [FR-087-001](requirements/FR-087-001-verified-private-cloud-evidence-upload.md) | Verified private cloud evidence upload | — |
| [FR-087-002](requirements/FR-087-002-candidate-extraction-and-mandatory-human-review.md) | Candidate extraction and mandatory human review | — |
| [FR-087-003](requirements/FR-087-003-excel-and-google-sheets-bounded-snapshot-convergence.md) | Excel and Google Sheets bounded snapshot convergence | — |
| [NFR-087-001](requirements/NFR-087-001-idempotent-draft-correlation.md) | Idempotent draft correlation | — |
| [NFR-087-002](requirements/NFR-087-002-no-secret-credential-disclosure.md) | No secret/credential disclosure | — |

Design: [design.md](design.md) · Verification: [verification.md](verification.md)

## Open issues

Tracked outside this repository ([ADR-106](../../governance/decisions.md) D8).
