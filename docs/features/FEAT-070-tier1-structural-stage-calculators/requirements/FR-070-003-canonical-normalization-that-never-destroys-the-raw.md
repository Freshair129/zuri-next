---
id: FR-070-003
title: "Canonical normalization that never destroys the raw value"
delivery: implemented
legacy: [FR-114]
relations:
  specified_by: [CMP-208]
---

# FR-070-003 — Canonical normalization that never destroys the raw value

The system SHALL return every normalized value as the pair `{ raw, canonical, kind }`,
where `raw` is the input unchanged. It SHALL normalize Unicode/whitespace (NFC plus one
explicit Thai vowel fold NFC misses, plus five invisible whitespace code points `\s`
does not match), dates (Thai and Gregorian digits, Buddhist and Gregorian years, ISO
output), Thai phone numbers (to E.164, replacing the leading `0` rather than keeping it
alongside `+66`), e-mail (domain lowercased, local part untouched per RFC 5321) and
organisation names (legal-wrapper stripped lexically, exported for Stage 8 to import
rather than re-implement). It SHALL decline (never guess) the six business-configured
categories — currency, unit, product code, country/region, timezone, identifier format
— and SHALL return `canonical: null` with a named reason (`ambiguous`, `invalid`,
`unsupported`) for anything it cannot decide, never a plausible-looking guess.

## Acceptance criteria

- AC-070-003-01 — Given the date `25/8/26` (2526 BE or 2026 CE, forty-three years apart), when normalized, then `canonical` is `null` with reason `ambiguous`, and neither reading appears anywhere in the result.
- AC-070-003-02 — Given the two Thai spellings of "สำ" (SARA AM vs. NIKHAHIT+SARA AA), when each is normalized, then the two `raw` values remain genuinely unequal (even under NFC) but produce the same `canonical` form.
- AC-070-003-03 — Given a caller declares `era: 'BE'`, when a two-digit year is normalized, then it resolves rather than declining as ambiguous.
- AC-070-003-04 — Given `currency`, `unit`, `product_code`, `country` or `identifier` as `kind`, when normalized, then `canonical: null` with reason `unsupported` is returned for each.

## Implementation

- apps/server/src/modules/knowledge/normalization.js

## Verification

- TC-070-003 — Normalization never guesses an undecidable value (see [verification.md](../verification.md))
