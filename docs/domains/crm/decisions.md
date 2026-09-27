# Decisions — DOM-CRM
### ADR-038 — Conversation threads are per channel thread; unified identity is not CRM's
Owner: DOM-CRM
Status: approved (narrowed on migration: the Edge-side live console of the source ADR is retired by ADR-095)
Context: LINE groups, rooms and 1:1 chats carry different platform ids (`groupId`, `roomId`, `userId`). Without a scoping rule a group and a direct chat can leak context into each other, and cross-channel identity could be "solved" by merging CRM rows.
Decision:
- A CRM Conversation is keyed by `(tenantId, channel, channelAccountId, externalThreadId)`; the platform thread id is an attribute inside that unique key, never a primary or foreign key.
- Group/room threads and direct threads are distinct conversations; CRM never merges them.
- Cross-channel identity federation (LINE id + other channel ids → Person) belongs to identity (DOM-IAM) and to MSP's unified thread authority, not to CRM; CRM stores the resolved Person link on Customer.
- The supervisor console is the web inbox (FEAT-092); the Edge-hosted monitor/dispatcher of the source ADR is not carried forward.
Consequences:
- Memory rules that depend on audience (group vs direct) can rely on the conversation's thread kind (FEAT-095).
- A second channel (Facebook, web chat) adds rows under its own `channel`, not a new model.
Legacy: ADR-044

### ADR-039 — Legacy ERD shapes are prior art for derived CRM intelligence
Owner: DOM-CRM
Status: approved
Context: The owner asked to reuse feature tables from the previous product's ERD. Several legacy patterns violate this system's rules (external ids as keys, phone-based identity merge, one flat tenant column).
Decision:
- The legacy ERD is read for shapes only; nothing is migrated from it.
- Three derived shapes are adopted under CRM: CustomerProfile (on Customer), ConversationAnalysis (on Conversation), DailyBrief (per Business per day). CRM owns the rows and their single writers; the agent runtime only produces content.
- Borrowed tables inherit scope from the aggregate they describe; they add no new scope column (DailyBrief carries a denormalized tenantId).
- External ids never become keys (analysis keys on `Conversation.id`); phone-based identity merge is refused; `sourceAdId` is dropped until an Ad model exists.
- These rows are derived, advisory and recomputable; deleting them is always safe; PDPA erasure removes them.
Consequences:
- FEAT-046 exists; `Employee`, `AuditLog`, legacy `Task` (project half) and wallet/tier fields are refused.
- No surface may show a number that disagrees with recomputation from Messages.
Legacy: ADR-054

### ADR-040 — Sales tasks are a CRM activity, not a project task
Owner: DOM-CRM
Status: approved
Context: The legacy `Task` table mixed sales follow-ups, calendar items and mini-projects. Project work already exists as `Project`/`Workstream`/`WorkItem` (DOM-PRJ).
Decision:
- `SalesTask` is a CRM record: Business-scoped, optionally linked to a same-Tenant Customer and Conversation, optionally assigned to a Person with an ACTIVE covering Membership, code `TSK-YYYYMMDD-NNN`.
- Types add LINE_MESSAGE and QUOTE; URGENT moves from status to priority; SINGLE/RANGE schedule kinds kept; the PROJECT kind and milestones are refused.
- Reads need Business visibility + `customer` domain (404 otherwise); writes need Business OWNER or the `SALES_REP` binding (403 otherwise).
- Status machine OPEN→IN_PROGRESS→DONE, OPEN|IN_PROGRESS→CANCELLED, closed→OPEN only via REOPEN; every action compare-and-swap on `version`, one audit row, no deletion; overdue/due-today computed on read (Asia/Bangkok).
Consequences:
- LINE intake of a sales task must be a converter onto this writer, not a second writer.
- Reminders, calendar/Notion sync and revenue attribution need their own decisions.
Legacy: ADR-064

### ADR-041 — The CRM record, agent memory and the Context Composer are split by role
Owner: DOM-CRM
Status: approved
Context: A LINE conversation was held in several places (CRM, MSP session ledger, MSP episodic/passport memory, traces) with no stated role, retention or consent per copy, and prompts were assembled ad hoc.
Decision:
- CRM `Conversation`/`Message` (+ attachments and events) is the business record: written first in the admission transaction, read by inbox, receipts, commerce linkage and legal retention; it never depends on MSP being reachable.
- Retention is declared per data class with installation defaults (raw LINE payload 90 days, message bodies/attachments 24 months, trace payloads 90 days, MSP session content 90 days); a Tenant may shorten, never lengthen.
- MSP projection stays OFF until MSP ships thread and erase tools; projections are receipted; the session tier needs the account's `memoryPolicy` not OFF, episodic/passport/cross-thread memory also needs consent GRANTED and a DIRECT audience; group/room turns never reach private memory.
- Non-text content is recorded now (content kind, attachment without bytes, conversation events); none creates an answer job; unsend tombstones.
- Erasure is transactional inside Tier 1 and leaves durable, acknowledged work for tiers outside it; an external tier is never assumed erased.
- One agent-lane Context Composer module assembles every model prompt and records a references-only ContextReceipt.
Consequences:
- FEAT-095 is the delivery vehicle; CRM sweeps only its own class, other classes need their owners' sweepers.
- Consent gains a second meaning (memory gating) without gating recording.
Legacy: ADR-091

### ADR-042 — Swept chat content moves to an encrypted local cold archive
Owner: DOM-CRM
Status: approved
Context: The 24-month retention sweep destroyed the only copy of what a customer and the business said, removing evidence needed for disputes.
Decision:
- Only `MESSAGE_BODY_AND_ATTACHMENTS` is archived; raw payloads, traces and MSP content stay delete-only.
- Archive before tombstone and fail closed per Tenant: write, flush, read back and hash-verify, then insert the manifest and tombstone in one transaction.
- The archive is a local write-once directory on a separate disk, mounted through its own compose overlay.
- Content is gzip JSON Lines sealed with AES-256-GCM per Customer data key, wrapped by a dedicated archive KEK; manifests form a per-Tenant hash chain.
- Archived messages are kept 10 years then destroyed (key when a Customer's last line expires, file when all its lines expire).
- PDPA erasure destroys the Customer's archive key unless an owner-recorded legal hold (reason, end date) is active.
- No browsing: retrieval is per Customer, owner at AAL2, with a case reference, audited `ARCHIVE_RETRIEVED`; a monthly offline copy is verified against manifest hashes.
Consequences:
- FEAT-047; a sweep can skip a Tenant when storage is unavailable; the archive KEK needs its own offline backup.
Legacy: ADR-093

### ADR-043 — A LINE conversation is split into idle-bounded sessions
Owner: DOM-CRM
Status: approved
Context: One long-lived LINE conversation mixed many sittings; the inbox, traces and archive retrieval had no unit smaller than the whole thread, and MSP's session id cannot be the record's key while MSP may be off.
Decision:
- CRM owns `ConversationSession`, the session of the business record; MSP's session id is stored beside it when present.
- Assignment by idle time between messages (message time), decided inside the admission transaction and serialized per conversation; replies join their inbound message's session; events take the open session or none; no sweeper — `closedAt` is written when the next session opens; existing rows are backfilled by the same rule.
- Timeout 30 minutes by default, 10–120 per LINE Official Account; no midnight cut.
- Message, ConversationEvent and LineConversationJob carry the session id; traces reach it through the job's turn; the inbox shows a divider.
- Once memory is on, a prompt may carry only the current session's exchanges and summaries of earlier ones.
- Model residency is a separate schedule, not a session effect (the business-hours option was chosen; its device half is retired with Edge execution, see FEAT-051).
Consequences:
- FEAT-042 and FEAT-051.
Legacy: ADR-094
