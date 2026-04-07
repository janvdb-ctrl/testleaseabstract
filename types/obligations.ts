/**
 * Obligation domain — canonical data model (Flow 2 spec).
 * DB columns use snake_case; this file uses camelCase for TypeScript.
 */

export type UUID = string;

/** `type` — how the tenant satisfies the obligation. */
export enum ObligationType {
  Document = "document",
  Photo = "photo",
  Acknowledgement = "acknowledgement",
  Payment = "payment",
}

/** `recurrence` — schedule for due dates and reminders. */
export enum ObligationRecurrence {
  Once = "Once",
  Annual = "Annual",
  SemiAnnual = "Semi-annual",
  Monthly = "Monthly",
  Quarterly = "Quarterly",
  AsNeeded = "As-needed",
}

/** `status` — lifecycle and enforcement state. */
export enum ObligationStatus {
  Draft = "draft",
  Pending = "pending",
  Fulfilled = "fulfilled",
  Overdue = "overdue",
  Flagged = "flagged",
  Waived = "waived",
}

/** `agent_verification_result` — outcome of agent review on submissions. */
export enum AgentVerificationResult {
  Pass = "pass",
  Fail = "fail",
  Pending = "pending",
}

/**
 * Events stored in `audit_log` (timestamped).
 * Spec: created, edited, activated, reminder sent, submission received, verified, rejected, waived.
 */
export type ObligationAuditEventType =
  | "created"
  | "edited"
  | "activated"
  | "reminder_sent"
  | "submission_received"
  | "verified"
  | "rejected"
  | "waived";

export interface ObligationAuditEvent {
  /** ISO 8601 timestamp */
  at: string;
  type: ObligationAuditEventType;
  /** Human-readable detail, actor name, or note */
  detail?: string;
  /** Structured metadata (e.g. reminder id, file ref) */
  meta?: Record<string, unknown>;
}

/**
 * Full obligation row — matches spec data model.
 *
 * | Field | Spec column |
 * |-------|-------------|
 * | id | id |
 * | tenantId | tenant_id |
 * | leaseAbstractionId | lease_abstraction_id |
 * | name | name |
 * | type | type |
 * | dueDate | due_date |
 * | recurrence | recurrence |
 * | status | status |
 * | sourceClause | source_clause |
 * | evidenceRequired | evidence_required |
 * | lastSubmissionDate | last_submission_date |
 * | lastSubmissionFileRef | last_submission_file_ref |
 * | agentVerificationResult | agent_verification_result |
 * | agentVerificationNotes | agent_verification_notes |
 * | auditLog | audit_log |
 * | createdBy | created_by |
 * | createdAt | created_at |
 */
export interface Obligation {
  id: UUID;
  tenantId: UUID;
  leaseAbstractionId: UUID;
  name: string;
  type: ObligationType;
  /** Date-only ISO string (`YYYY-MM-DD`). */
  dueDate: string;
  recurrence: ObligationRecurrence;
  status: ObligationStatus;
  /** Raw lease text; read-only in UI (or manual-add placeholder). */
  sourceClause: string;
  /** Free text: what the tenant must submit. */
  evidenceRequired: string;
  /** Most recent tenant submission date; null if none. */
  lastSubmissionDate: string | null;
  /** Storage key / URI for last submission asset. */
  lastSubmissionFileRef: string | null;
  agentVerificationResult: AgentVerificationResult;
  agentVerificationNotes: string | null;
  auditLog: ObligationAuditEvent[];
  /** `"system"` or landlord display name. */
  createdBy: string;
  /** ISO 8601 timestamp */
  createdAt: string;
}
