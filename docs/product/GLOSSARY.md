---
title: Glossary
status: draft
owner: product
legacy: [docs/appendices/F-glossary.md v1.2.0, docs/DOMAIN-MODEL.md, ADR-076]
---

# Glossary

Product terms with the Thai word used in the UI where one exists. Domain-specific
language is defined in each `domains/<slug>/DOMAIN.md`; this list covers terms used
across domains.

## Scope and organization

| Term | Thai (UI) | Meaning |
|---|---|---|
| Portfolio | เครือ / กลุ่มธุรกิจ (UI label "Group") | Root of the hierarchy: a group of businesses under one owner. Shown only when a second business exists |
| Tenant | องค์กร (UI label "Organization") | Isolation and data-sharing boundary. Businesses in one Tenant may share CRM; never a branch |
| Legal entity | นิติบุคคล | A registered company (registration, tax id) owned by one Tenant |
| Business | ธุรกิจ / ร้าน | An operating company or unit; the node a person selects to enter the operating shell |
| Branch | สาขา | A location under a Business; never a Tenant |
| Workspace | พื้นที่งาน | An operating unit under a Business that groups Projects (legacy UI called it "Space") |
| Collaboration workspace | — | Top-level place a Profile-only person can join before any Business grant (backed by Portfolio) |
| Scope chain | — | Portfolio → Tenant → Business → Workspace → Project |
| Human code | รหัสอ่านได้ | Stable readable identifier (`PRJ-…`, `BUS-…`); never a primary key |
| External id / ExternalRef | รหัสจากระบบอื่น | An identifier issued by an outside system, stored as a mapping, never a key |

## People and access

| Term | Thai (UI) | Meaning |
|---|---|---|
| Person | บุคคล | The canonical principal (customer, staff or owner) |
| Profile | โปรไฟล์ | A person's own account data; exists before any Business access |
| Membership | สมาชิก | An access grant of a Person to a Tenant or Business with a role and per-domain grants; has a lifecycle (ACTIVE → REVOKED) |
| RoleBinding | — | A scoped capability grant (e.g. LINE OA publisher) |
| PlatformGrant | — | Time-boxed installation-operator authority |
| Installation operator | ผู้ดูแลระบบ | Runs the installation; not a Business role |
| Team | ทีม | Organizational grouping of people; never grants access |
| Employment | การจ้างงาน | HR assignment; independent of Membership |
| Viewer | — | The server-resolved identity and authority of the current request |
| AAL2 / step-up | ยืนยันตัวตนเพิ่ม | Second-factor assurance (TOTP or passkey) required for sensitive acts |
| Segregation of duties | แบ่งแยกหน้าที่ | Two different people must record and confirm a money or stock fact |

## Work and planning

| Term | Thai (UI) | Meaning |
|---|---|---|
| Project | โปรเจกต์ | An outcome-oriented effort; may mix execution modes |
| Workstream | สายงาน | A parallel stream with an execution mode, progress strategy and weight |
| Execution mode | โหมดการทำงาน | One of seven canonical modes (Software Sprint, Data Migration, B2B Sales, B2C Campaign, Product Launch, Operations, Business Expansion) |
| WorkContainer / WorkItem | กลุ่มงาน / รายการงาน | Method-specific container (sprint, stage, wave …) and smallest tracked unit |
| Milestone / Gate | หมุดหมาย / ด่านตรวจ | Weighted checkpoint / must-pass condition; an open required gate caps progress at 99 % |
| Dependency / Handoff Contract | ความสัมพันธ์งาน | A typed edge between work items, only with a declared handoff contract |
| Progress strategy / roll-up | วิธีคิดความคืบหน้า / ความคืบหน้ารวม | Mode-specific calculator; project = Σ(workstream % × weight) / Σ(weight) |
| Business goal / Key Result / WIG | เป้าหมาย / ผลลัพธ์หลัก | Goals with derived progress; at most two Wildly Important Goals per Business |

## Intake and data

| Term | Thai (UI) | Meaning |
|---|---|---|
| Envelope (PlanEnvelope, ExecutionPlanBundle, intake envelope) | ซองข้อมูล / ซองแผนงาน | Strict JSON contract every surface converts to before the intake pipeline |
| Dry run / preview | ทดลองนำเข้า / พรีวิว | Read-only validation showing inserts, updates and conflicts before commit |
| Receipt | ใบรับ | Idempotent record of a committed intake, replayable without re-applying |
| AuditEvent | บันทึกเหตุการณ์ | Append-only record of a significant change, with scope columns |
| Snapshot | สำเนาสำรอง | Provider-agnostic JSON export of domain data; restore always previews and confirms |
| Raw external record | หลักฐานดิบ | Immutable evidence of data acquired from an outside system |
| Pipeline ledger | — | Shared run/step/record event ledger for governed data pipelines |
| Satang | สตางค์ | Money unit stored as an integer (THB × 100) |
| ATP | ยอดพร้อมขาย | Available-to-promise = on-hand − committed − live quote reservations |

## Channels, AI and knowledge

| Term | Thai (UI) | Meaning |
|---|---|---|
| LINE OA account | บัญชี LINE OA | One LINE Official Account connected to a Business; several per Business are allowed |
| Admission | — | Durable capture of a verified webhook event before acknowledgement |
| Conversation job | — | Durable unit of LINE answer work with lease, version and executor cohort |
| Executor cohort | — | Which runtime executes a job (`SERVER` or `CONVERSATION_RUNTIME`), fixed at admission |
| Reply owner | — | The single process allowed to answer a given LINE event |
| Conversation session | เซสชันสนทนา | A sitting of one conversation, split by an idle gap |
| Grounded answer | คำตอบอ้างอิง | An answer whose evidence was verified against published knowledge |
| Context composer | — | Assembles bounded prompt context from memory, knowledge and business facts, with a receipt |
| MSP | — | Tier-2 memory and session authority (external system) |
| GKS | — | Tier-3 canonical knowledge authority (external system) |
| GenesisBlockDB | — | Tier-4 six-lane retrieval substrate (external system) |
| Corpus generation | — | An immutable published version of a Business's knowledge corpus |
| Knowledge candidate | — | A reviewed, locator-only Q&A proposed for admission to knowledge |
| Vault (memory) | — | An authorized memory partition resolved per turn from server policy |
| Secret reference (`secretRef`) | — | Opaque pointer to a credential in the configured secret store |
| PRP | — | Private Runtime Platform: an operator-run model runtime reached with a Business client key |
| Cold archive | คลังหลักฐานแชต | Encrypted, owner-retrievable store of swept chat content kept as dispute evidence |
