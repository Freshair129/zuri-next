---
id: RB-004
title: LINE ingress, channel ownership and canary
status: draft
owner: operations
legacy: [docs/runbooks/LINE-PHASE1-CANARY.md, docs/deployment/docker-ngrok.md (public URL and webhook), ADR-061 activation notes, ADR-100 owner note, ADR-106, CLAUDE.md LINE overlay notes]
relations:
  decided_by: [ADR-095, ADR-087, ADR-091]
---

# RB-004 — LINE ingress, channel ownership and canary

Operates the LINE path of SRV-001, SRV-002 and SRV-003.
Invariant: one reply owner per LINE event (BR-056).

## 1. Ingress topology

```text
LINE Platform ─► public HTTPS origin (tunnel or reverse proxy, Host preserved)
             ─► web: POST /api/line-oa/accounts/{accountId}/webhook
```

- Signature is verified before parsing (including empty verification requests); the
  destination must match the account's server-owned connection.
- 2xx acknowledges durable capture of each event (sanitized evidence marked
  `ADMITTING`); admission to CRM and the job ledger continues after the acknowledgement
  and is reconciled on restart.
- Only one process may receive a channel's webhook. If another agent/tunnel currently
  answers a channel, it keeps the channel until the switch in §3.

## 2. Prerequisites for a server-owned account

1. LINE server overlay active (worker token, reply-sealing key, credential mount or
   secret store configured) — RB-005 §0.
2. Required migrations applied — RB-002.
3. The account exists in LINE OA Studio in CLOUD transport / SERVER execution, with the
   channel credential written from the browser at AAL2 (write-only) and validated.
4. A model-provider key for the Business is saved and validated (write-only); without
   it jobs end `EXECUTION_FAILED` and nothing is sent.
5. Business knowledge grounding configured for the account.

## 3. Switch a channel to the server (one step)

Save/confirm the model key **and** repoint the webhook in the LINE developer console
together, after pausing or stopping the previous receiver. Doing only one of the two
either answers nothing or answers every customer twice. Then enable the account's
server ownership (owner/publisher versioned action) and confirm the handoff in the
Studio.

## 4. Verify and recover

- Send one message from a test account; confirm: evidence captured, conversation and
  inbound message rows, a job created, executed, sent, and the outbound message row;
  one correlation id joins them (audit payload).
- Failed jobs are counted with their `errorCode` on the Studio conversation surface.
- `UNKNOWN` sends (acceptance could not be established) are shown for acknowledgement;
  never resend them blindly; never convert an ambiguous reply to a push.
- Do not change ownership, pause or roll back while jobs are `SENDING`, `UNKNOWN` or a
  push retry is pending.

## 5. Opting accounts into the Conversation Runtime

Deploy SRV-003 (overlay + profile, dedicated core token), confirm
`/readyz`, then opt an account in with the versioned configure-execution action. Only
verified direct conversations meeting runtime eligibility enter the runtime cohort;
others stay `SERVER`. Roll back by opting the account out; jobs already admitted keep
their cohort.

## 6. Legacy phase-1 binding canary (dry run)

For a Business still on the phase-1 binding path: generate the dry-run canary plan from
untracked input (project, Tenant, Business, binding, provider/model, fresh golden and
isolation report hashes). It must report `mode: DRY_RUN`, `ready: true`,
`EVIDENCE_VERIFIED`, and no capabilities. Live activation is a separate operator
procedure (dedicated role, one versioned mutation, one canary). Receipt states are
never promoted: `ACCEPTED_BY_LINE` ≠ displayed ≠ read.

## 7. Rollback — routing first

1. Pause the account / disable server ownership (fences waiting work; stale leases
   cannot send).
2. Point the webhook back to the previous owner only after in-flight sends settle.
3. Preserve evidence, jobs and knowledge; never delete them as a rollback action.
4. Rotate or revoke credentials in the secret store if indicated; never write them
   into an incident record.
