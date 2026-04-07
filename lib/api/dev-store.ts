import type { Obligation } from "@/types/lease";
import type { ObligationDrawerDraft } from "@/types/lease";
import {
  buildTenantSidebarItems,
  mockObligationsByTenantId,
} from "@/mocks/dashboard";

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

/** Mutable copy of mock obligations for dev API routes. */
let obligationsByTenantId: Record<string, Obligation[]> = deepClone(mockObligationsByTenantId);

const activationByTenantId: Record<string, boolean> = {};

export function devGetObligationsSnapshot(): Record<string, Obligation[]> {
  return obligationsByTenantId;
}

export function devGetTenantSidebarItems() {
  return buildTenantSidebarItems(obligationsByTenantId);
}

export function devGetObligationsForTenant(tenantId: string): Obligation[] {
  return obligationsByTenantId[tenantId] ?? [];
}

export function devFindTenantIdForObligation(obligationId: string): string | null {
  for (const [tenantId, rows] of Object.entries(obligationsByTenantId)) {
    if (rows.some((o) => o.id === obligationId)) return tenantId;
  }
  return null;
}

export function devPatchObligation(obligationId: string, draft: ObligationDrawerDraft): Obligation | null {
  const tenantId = devFindTenantIdForObligation(obligationId);
  if (!tenantId) return null;
  const rows = obligationsByTenantId[tenantId] ?? [];
  const idx = rows.findIndex((o) => o.id === obligationId);
  if (idx === -1) return null;
  const prev = rows[idx]!;
  const next: Obligation = {
    ...prev,
    name: draft.name.trim() || prev.name,
    type: draft.type,
    dueDate: draft.dueDate,
    recurrence: draft.recurrence,
    status: draft.status,
    evidenceRequired: draft.evidenceRequired,
  };
  obligationsByTenantId = {
    ...obligationsByTenantId,
    [tenantId]: rows.map((o, i) => (i === idx ? next : o)),
  };
  return next;
}

export function devWaiveObligation(obligationId: string): Obligation | null {
  const tenantId = devFindTenantIdForObligation(obligationId);
  if (!tenantId) return null;
  const rows = obligationsByTenantId[tenantId] ?? [];
  const idx = rows.findIndex((o) => o.id === obligationId);
  if (idx === -1) return null;
  const prev = rows[idx]!;
  const next: Obligation = { ...prev, status: "waived" };
  obligationsByTenantId = {
    ...obligationsByTenantId,
    [tenantId]: rows.map((o, i) => (i === idx ? next : o)),
  };
  return next;
}

export function devActivateTenant(tenantId: string): void {
  activationByTenantId[tenantId] = true;
}

export function devDeactivateTenant(tenantId: string): void {
  activationByTenantId[tenantId] = false;
}

export function devIsTenantActivated(tenantId: string): boolean {
  return activationByTenantId[tenantId] ?? false;
}
