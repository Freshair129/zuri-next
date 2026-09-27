---
id: SDD-063
title: "Evidence-grounded answering and supply-chain tools — design"
---

# SDD-063 — Evidence-grounded answering and supply-chain tools design

- **Components:**
  - `CMP-160` — `grounded-business-answer.js`.
  - `CMP-164` — undeclared/not yet implemented (§9).
  - `CMP-179` — `tools/smartgift-inventory-tools.js`, thin
    adapters over `@/modules/inventory` and `@/modules/commerce`.
- **Data owned:** none — every tool reads/writes through Inventory's
  (`Product`, `StockMovement`, `ProductRecipe`, reservations, work orders)
  and Commerce's (`priceLandedInventoryQuote`) own services.
- **Contracts exposed:** none as HTTP (in-process tool descriptors only).
- **Contracts consumed:** Inventory's `availableToPromiseFor`,
  `createReservation`, `openCustomizationWorkOrder`,
  `openKittingWorkOrder`, `shelfLifeAudit`, `productByFlowAccountSku`;
  Commerce's `priceLandedInventoryQuote`.
- **Main sequence (grounded answer):** 1. `selectRegisteredQuery` classifies
  the question. 2. `knowledge.query` fetches the bounded evidence. 3. No
  evidence ⇒ deterministic "not found" text. 4. Evidence present ⇒
  `model.generate` is called with `{question, evidence, contextPacket}`.
  5. `verifyCandidate` checks numbers/codes/risky claims against the
  evidence; unsupported ⇒ `deterministicFallback`; supported ⇒ the model's
  own text.
- **Failure modes:** provider throws (non-Ollama) ⇒ deterministic fallback,
  `verification.reason: 'provider-fallback'`; provider throws (Ollama) ⇒
  `OLLAMA_PROVIDER_NOT_READY` propagates; `MSP_INJECTION_RECEIPT_UNKNOWN`
  always propagates (an external model call may already have happened —
  retrying could duplicate it).

## Implementation map

| Requirement | Current code (legacy repo path) |
|---|---|
| FR-063-001 | `apps/server/src/modules/agent/grounded-business-answer.js`, `apps/server/src/modules/agent/index.js` |
| FR-063-002 | *(none — declared only)* |
| FR-063-003 | `apps/server/src/modules/agent/tools/smartgift-inventory-tools.js`, `apps/server/src/modules/commerce/application/pricing-inventory-service.js` |
