---
id: FR-081-003
title: "LINE `#sku` command, verified sender only, preview before write"
delivery: implemented
legacy: [FR-210, BR-042]
relations:
  specified_by: [SDD-081]
  decided_by: [ADR-074]

---

# FR-081-003 — LINE `#sku` command, verified sender only, preview before write

The system SHALL wrap the server-owned LINE worker's answer port so a DIRECT-chat
text beginning with `#sku` is answered by this command before the model, acting
only when the sender's LINE channel identity is verified and the resolved viewer
holds Inventory write authority in that account's Business — for anyone else
(unverified, customer, no write authority, group/room) the message SHALL fall
through unchanged. `#sku` with `key: value` lines (Thai or English, items separated
by `---`; an 8/12/13/14-digit run under บาร์โค้ด is declared a GTIN, refused by its
own check digit on a typo) SHALL build the FR-081-001 envelope (channel LINE_OA,
correlation `line:<account>:<event>`) and reply with the preview. `#sku ยืนยัน
<code>` SHALL commit and `#sku ยกเลิก <code>` SHALL cancel, both only for the person
who previewed; every refusal SHALL become a Thai reply, never a failed job; no
model output SHALL ever reach a write.

## Acceptance criteria

- AC-081-003-01 — Given a message from an unverified sender, when it begins with `#sku`, then it falls through to the normal (model) answer, not the command.
- AC-081-003-02 — Given a verified sender without Inventory write authority, when they send `#sku`, then it falls through unchanged.
- AC-081-003-03 — Given person A previewed a batch, when person B sends `#sku ยืนยัน <code>` for that same preview, then it is refused — only the previewer may confirm.
- AC-081-003-04 — Given a barcode value with an invalid check digit typed under บาร์โค้ด, when parsed, then it is refused by the GTIN check-digit rule with a Thai reply, not silently accepted as a different identifier kind.

## Implementation

- `apps/server/src/modules/inventory/import/catalog-line-command.js`, `apps/server/src/modules/agent/line-catalog-command.js`, `apps/server/src/app/api/line-oa/worker/route.js`

## Verification

- TC-081-004 — LINE #sku parsing, authority fall-through, confirm/cancel ownership (see [verification.md](../verification.md))
