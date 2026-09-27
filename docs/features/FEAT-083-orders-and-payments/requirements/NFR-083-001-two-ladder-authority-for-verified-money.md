---
id: NFR-083-001
title: "Two-ladder authority for verified money"
delivery: building
legacy: []
---

# NFR-083-001 — Two-ladder authority for verified money

Recording a payment and verifying/rejecting it require two distinct capabilities
(`commerce.order.write` vs `commerce.payment.verify`); no single role binding alone
lets the same actor both submit and self-verify a payment. Measured by
`fr163-payment.test.js`'s authority coverage.
