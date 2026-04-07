import type { Obligation, ObligationRecurrence, ObligationStatus, ObligationType } from "@/types/lease";
import type { TenantSidebarBadge, TenantSidebarItem } from "@/types/lease";

/** Accepts camelCase or snake_case obligation payloads from the API. */
export function normalizeObligation(raw: Record<string, unknown>): Obligation {
  const dueDate = (raw.dueDate ?? raw.due_date) as string;
  const lastSubmission = (raw.lastSubmission ?? raw.last_submission ?? raw.last_submission_note) as
    | string
    | null
    | undefined;

  return {
    id: String(raw.id),
    name: String(raw.name ?? ""),
    type: raw.type as ObligationType,
    dueDate,
    recurrence: (raw.recurrence ?? raw.recurrence_rule) as ObligationRecurrence,
    status: raw.status as ObligationStatus,
    lastSubmission: lastSubmission === undefined ? null : lastSubmission,
    sourceClause: String(raw.sourceClause ?? raw.source_clause ?? ""),
    evidenceRequired: String(raw.evidenceRequired ?? raw.evidence_required ?? ""),
  };
}

export function normalizeObligationList(payload: unknown): Obligation[] {
  if (!payload || typeof payload !== "object") return [];
  const list = Array.isArray(payload)
    ? payload
    : (payload as { obligations?: unknown }).obligations ??
      (payload as { data?: unknown }).data;
  if (!Array.isArray(list)) return [];
  return list.map((row) => normalizeObligation(row as Record<string, unknown>));
}

function normalizeBadge(raw: unknown): TenantSidebarBadge {
  if (!raw || typeof raw !== "object") {
    return { kind: "attention", count: 0 };
  }
  const o = raw as Record<string, unknown>;
  const kind = o.kind as string;
  if (kind === "complete") return { kind: "complete" };
  if (kind === "critical") return { kind: "critical", count: Number(o.count ?? 0) };
  return { kind: "attention", count: Number(o.count ?? 0) };
}

export function normalizeTenantSidebarItem(raw: Record<string, unknown>): TenantSidebarItem {
  return {
    id: String(raw.id),
    name: String(raw.name ?? ""),
    unitLabel: String(raw.unitLabel ?? raw.unit_label ?? ""),
    addressLine: String(raw.addressLine ?? raw.address_line ?? ""),
    badge: normalizeBadge(raw.badge),
  };
}

export function normalizeTenantList(payload: unknown): TenantSidebarItem[] {
  if (!payload || typeof payload !== "object") return [];
  const list = Array.isArray(payload)
    ? payload
    : (payload as { tenants?: unknown }).tenants ?? (payload as { data?: unknown }).data;
  if (!Array.isArray(list)) return [];
  return list.map((row) => normalizeTenantSidebarItem(row as Record<string, unknown>));
}
