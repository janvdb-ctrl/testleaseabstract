/**
 * Lease Abstraction Agent — obligations domain types.
 * Used by the property obligations overview dashboard.
 */

/** How the tenant must satisfy the obligation (asset type). Flow 2. */
export type ObligationType = "document" | "photo" | "acknowledgement" | "payment";

/** Fulfillment / lifecycle state (Flow 2). */
export type ObligationStatus =
  | "draft"
  | "pending"
  | "fulfilled"
  | "overdue"
  | "flagged"
  | "waived";

/** Recurrence options (detail drawer + table). */
export type ObligationRecurrence =
  | "Once"
  | "Annual"
  | "Semi-annual"
  | "Monthly"
  | "Quarterly"
  | "As-needed";

/** A single lease obligation row for a property / tenant. */
export interface Obligation {
  id: string;
  /** Display name shown in the table and detail drawer. */
  name: string;
  type: ObligationType;
  /** ISO 8601 date string (date-only), e.g. `2026-04-15`. */
  dueDate: string;
  recurrence: ObligationRecurrence;
  status: ObligationStatus;
  /**
   * Last tenant submission: ISO date, em dash when none, or short note
   * (e.g. dispute) per Flow 2.
   */
  lastSubmission: string | null;
  /** Extracted lease text; read-only in UI. */
  sourceClause: string;
  /** What the tenant must submit (editable). */
  evidenceRequired: string;
}

/** Editable fields in the Flow 2 detail drawer (mirrors PATCH body). */
export interface ObligationDrawerDraft {
  name: string;
  type: ObligationType;
  dueDate: string;
  recurrence: ObligationRecurrence;
  status: ObligationStatus;
  evidenceRequired: string;
}

/** Property context for the dashboard header and future API scoping. */
export interface PropertySummary {
  id: string;
  name: string;
}

/** Sidebar row status indicator (Flow 2 — tenant list). */
export type TenantSidebarBadge =
  | { kind: "complete" }
  | { kind: "attention"; count: number }
  | { kind: "critical"; count: number };

/** Tenant row without derived badge (API + static mock rows). */
export interface TenantSidebarRowBase {
  id: string;
  name: string;
  /** e.g. "Suite 1204" */
  unitLabel: string;
  /** Full property / site address */
  addressLine: string;
}

/** Sidebar row including derived status badge (Flow 2). */
export interface TenantSidebarItem extends TenantSidebarRowBase {
  badge: TenantSidebarBadge;
}

/** Aggregates for summary cards (can be computed client- or server-side). */
export interface ObligationStats {
  total: number;
  overdue: number;
  fulfilled: number;
  pending: number;
}

/** Flow 2 metrics row — derived from the selected tenant's obligations. */
export interface ObligationMetrics {
  total: number;
  fulfilled: number;
  pending: number;
  overdueFlagged: number;
}

