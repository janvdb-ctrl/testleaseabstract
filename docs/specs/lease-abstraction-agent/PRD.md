# PRD — LeasePilot (Lease Abstraction Agent)

> **Version:** 0.3
> **Last updated:** May 2026
> **Status:** Active development — MVP in progress

---

## Problem

Landlords managing commercial properties have no reliable way to track
and enforce tenant obligations from lease agreements. They forget to
send reminders, miss deadlines, and lose money when obligations like
insurance certificates, maintenance contracts, or rent payments go
untracked. Lease agreements vary widely in format and specificity,
making manual tracking impossible at scale. When something goes wrong
— an insurance lapse, a missed inspection — the landlord often finds
out too late.

Existing tools (Prophia, MRI Contract Intelligence, Lextract) solve
the abstraction problem but not the enforcement problem. They extract
obligations and send a notification email. Nobody builds the full
action loop.

---

## Users

- **Primary:** Landlords and property managers managing commercial
  properties
- **Secondary:** Tenants — interact via email or SMS only, no login
  required

---

## Solution

An agentic lease compliance management system that:

1. Extracts obligations from any lease document (lease abstraction)
2. Presents extracted obligations to the landlord for review and
   activation
3. Runs an automated action loop — reminders, tenant communication,
   document collection, verification, and escalation
4. Only pulls the landlord in when the agent cannot resolve something
   on its own

**The moat is not abstraction.** Claude and any LLM can abstract a
lease with a good prompt. The moat is the action layer: the state
machine, the communication loop, the verification logic, and the
audit trail. Abstraction alone is Prophia. The action layer is what
nobody else is building.

---

## Core flows

Detailed specs for each flow are in `docs/specs/`:

| Flow | File | Description |
|------|------|-------------|
| Flow 0 | `flow-0-tenant-onboarding.md` | Tenant record creation |
| Flow 1 | `flow-1-lease-upload.md` | Lease upload and abstraction |
| Flow 2 | `flow-2-obligations-dashboard.md` | Dashboard, review, activation |
| Flow 3 | `flow-3-action-loop.md` | Agent action loop |

---

## Example flow — end to end

1. Landlord uploads a lease. Agent extracts obligations and stages
   them for review.
2. Landlord reviews, edits if needed, and activates.
3. Agent emails tenant 30 days before a COI is due.
4. Tenant asks why. Agent replies citing the lease clause.
5. Tenant submits a COI. Agent verifies coverage, expiry, and
   additional insured.
6. COI passes. Agent marks fulfilled, files the document, and
   auto-schedules the next annual renewal from the extracted expiry
   date.
7. If the COI fails verification twice, agent escalates — CCs the
   landlord into the thread, sets status to Flagged.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Agent | Google ADK + Claude Sonnet/Opus (Python) |
| Backend | TypeScript + Node.js |
| Frontend | Next.js + Tailwind CSS |
| Database | PostgreSQL |
| Email | Gmail monitored inbox (oakleaseagent@gmail.com) |
| File storage | S3 (uploaded before Anthropic processing) |
| Hosting | Vercel (frontend) |

---

## Agent architecture

Three coordinated components:

- **Root / orchestrator agent** — manages the daily check cycle,
  reads the Tasks table, dispatches sub-agents
- **Scheduler sub-agent** — handles cron-based triggers, generates
  follow-up tasks, appends to the Tasks table
- **Notification-verification coordinator** — handles all tenant
  communication, document verification, and state classification

Tenant messages never reach the root agent directly. All inbound
tenant communication is handled exclusively by the
notification-verification coordinator, with a tightly scoped system
prompt that prevents prompt injection and database manipulation.

### Tasks table

Every agent action writes a record to the Tasks table:

| Status | Meaning |
|--------|---------|
| `done` | Action completed, no follow-up needed |
| `in_progress` | Action taken, waiting for tenant response |
| `requires_follow_up` | Schedule a trigger at a future date |

When a workflow reaches a terminal state (fulfilled, escalated,
waived, non-compliant), all in-flight `in_progress` rows are
flipped to `done`.

---

## Obligation types

| Type | How it fires | Examples |
|------|-------------|---------|
| Schedule-based | On a date or recurrence | COI renewal, HVAC inspection, rent payment |
| Logic-based | When a condition becomes true | Rent escalation, lease expiry within 120 days |
| Event-based | When an external event occurs | Tenant emails saying repair is done |

The unified notification schedule applies to **schedule-based
obligations only**. Event and logic-based obligations fire on their
trigger, not the schedule.

---

## Agent state machine

Each day the agent checks the Tasks table for obligations requiring
action. For each one, it reads the full message thread and any
uploaded documents, classifies the current state, and acts.

| State | Condition | Agent action | Loop count |
|-------|-----------|-------------|------------|
| 1 — No contact | No prior thread | Send first follow-up | No change |
| 2 — No response | Follow-up sent, no reply | Send next in schedule | +1 |
| 3 — Escalated | Max loops reached | CC landlord, observer mode | — |
| 4 — Wrong document | Submission failed verification | Reject with specific reason | +1 |
| 5 — Question | Tenant message, no doc | Answer citing lease clause | No change (Q&A count +1) |

**Escalation triggers** (any one is sufficient):
- Loop count reaches `escalationThreshold` (default 3, configurable per obligation)
- Q&A count reaches 2 without a document submitted
- Tenant explicitly disputes after the agent's one dispute reply
- Tenant specifically asks to speak to a human (LLM intent detection — mentioning landlord name alone does not trigger)
- Verification confidence is uncertain (agent cannot decide)

**Escalation model:** CC, not handoff. The agent CCs the landlord
into the existing thread, enters observer mode, and continues to
monitor. If the tenant submits a document after escalation, the
agent still verifies it and can transition flagged to fulfilled.

---

## Dispute resolution

A dispute occurs when a tenant actively disagrees with a verification
outcome or obligation requirement. This is distinct from escalation
(non-response).

Dispute signals:
- Explicit disagreement ("this is wrong", "I already did this")
- Claim that submitted documentation was correct
- Challenge to lease interpretation or obligation scope
- Request to reverse or re-review a verification decision

**Agent behaviour:** classify the dispute type, reply once with a
specific reasoned response citing the lease clause. If tenant still
disagrees after one reply, escalate immediately. If the dispute is
ambiguous or outside agent competence (lease interpretation, legal
liability), skip the one reply and escalate directly.

Dispute categories by obligation type:
- **COI:** coverage amount below threshold, wrong named insured, policy expired, excluded liability type
- **Maintenance:** disputes responsibility, claims work already completed, disputes the deadline
- **Payment:** wrong amount, payment already made but not credited, disputes late fee, disputes grace period

---

## Verification

When a document is submitted, the agent compares it against the
obligation requirements and classifies the outcome:

| Confidence | Outcome | Action |
|------------|---------|--------|
| Positive | Meets all criteria | Mark fulfilled, store file, auto-schedule next cycle |
| Negative | Clearly fails | Reject with specific reason, ask to resubmit, loop +1 |
| Uncertain | Agent cannot decide | Escalate to landlord with assessment |

Auto-scheduling: on a pass, extract the document expiry date and
use it as the next cycle due date, overriding the recurrence
calculation.

Full verification criteria by obligation type are in
`docs/specs/verification-criteria.md`.

---

## Obligation statuses

| Status | Set by | Landlord action? |
|--------|--------|-----------------|
| Draft | System on abstraction | No — reviewing |
| Active | System on activation | No |
| Pending | Agent on first follow-up | No |
| Fulfilled | Agent on successful verification | No |
| Overdue | System at T+1 | Optional — can send message |
| Flagged | Agent at escalation | Yes — must act |
| Waived | Landlord manually | No |
| Non-compliant | Landlord manually | No — goes to legal |

Key rule: Overdue means the agent is still working. Flagged means
the agent has stopped and the landlord must decide.

Landlord options at Flagged: Send message / Approve (manual
override) / Waive / Flag non-compliant.

---

## Notification schedule

Universal schedule for schedule-based obligations:

| Timing | What fires | Status |
|--------|-----------|--------|
| T minus 30 days | Reminder 1 | Pending |
| T minus 14 days | Reminder 2 | — |
| T minus 3 days | Reminder 3 | — |
| T minus 0 | Day-of notification | — |
| T plus 1 day | Overdue notice 1 | Overdue |
| T plus 3 days | Overdue notice 2 | — |
| T plus 7 days | Overdue notice 3 | — |
| Loop = max | Escalation | Flagged |

Windows already passed at activation are skipped silently.

---

## Standard obligations library

Pre-loaded library of 25-30 most common commercial lease obligations.
Agent maps extracted obligations to standards during abstraction,
inheriting verification criteria, recurrence defaults, and evidence
requirements. Full library in `docs/specs/obligations-library.md`.

---

## MVP / V1 / V2 scope

### MVP — prove the loop (current focus)

Goal: one real landlord, one real property, real leases in the
system. The agent completes a full loop — first follow-up through
to verified fulfilled document — without landlord intervention.

In scope:

| Feature | Notes |
|---------|-------|
| Lease upload and abstraction | PDF, DOCX, scanned image |
| Obligations dashboard — review and activation | |
| COI follow-up loop | Full T-30 to T+7 plus verification |
| Maintenance follow-up loop | HVAC, pest control, fire alarm, roof |
| Agent state machine (5 states) | |
| Document verification — COI and maintenance | |
| Dispute resolution (one reply plus escalate) | |
| Escalation via landlord CC | |
| Audit trail (Tasks table) | |
| Email communication (Gmail) | |
| Frontend — leases, dashboard, messages | |

Out of scope for MVP:
- Rent payment verification
- Financial reporting obligations
- SMS / A2P 10DLC
- Attachment viewing in dashboard
- Calendar sync
- Accounting sync

---

### V1 — full commercial product

Goal: everything Blake rated Important or Most Important beyond MVP.
Sufficient to charge for and onboard a commercial property
management firm.

| Feature | Source |
|---------|--------|
| Rent payment verification — cross-check against rent schedule, late fee notice | Blake Tier 1 |
| Financial reporting obligations | Blake Tier 1 |
| Rent commencement reminder | Blake Tier 2 |
| Rent escalation notice (logic-based trigger) | Blake Tier 2 |
| Lease expiration / renewal option reminder | Blake Tier 2 |
| Security deposit tracking | Blake Tier 2 |
| SMS / A2P 10DLC — preferred contact method per tenant | |
| Attachment viewing in dashboard | |
| Landlord send message from dashboard (any status) | |
| Messages tab — thread view per obligation | |
| Calendar sync — Google Calendar / Outlook | Blake Integration |
| Gmail monitoring — connect landlord inbox | Blake Integration |
| Re-open waived obligation | |
| Lease audit — periodic compliance review | Blake Date-Driven |

---

### V2 — platform

Goal: connect LeasePilot to Oak Network payment infrastructure.
Programmable payments as the enforcement mechanism.

| Feature | Notes |
|---------|-------|
| Conditional escrow tied to obligations | Saquib V2 idea |
| Escrow release on agent-verified fulfillment | Connects to Oak payment rails |
| USDC / stablecoin escrow via Bridge | |
| Vendor management — W9s, COIs, lien waivers | Blake Tier 2 |
| Estoppel certificate requests | Blake Tier 3 |
| SNDA requests | Blake Tier 3 |
| Accounting sync — Yardi, MRI, AppFolio | Blake Integration |
| Multi-modality — SMS, WhatsApp, voicemail | Saquib architecture note |

---

## Security boundaries

- Tenant messages never reach the root agent
- Notification-verification sub-agent has explicit prompt
  restrictions on all database read/write
- S3 storage is decoupled from Anthropic processing — files are
  never lost if the API is temporarily unavailable
- Q&A responses are scoped to lease clause citations and obligation
  data only
- Agent detects and ignores prompt injection attempts via tenant
  message content

---

## Goals

- **Primary:** speed of execution — get a thin slice live, learn,
  iterate
- **North star:** speed of network capture. The abstraction layer is
  table stakes. The moat is built by getting landlords and their
  leases into the system before anyone else validates the same idea.

## Success metric

A real landlord has activated obligations for at least one tenant,
and the agent has completed at least one full loop — first follow-up
through to verified fulfilled document — without landlord
intervention.
