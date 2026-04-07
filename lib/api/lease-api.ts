import { apiFetch } from "@/lib/api/client";
import {
  normalizeObligation,
  normalizeObligationList,
  normalizeTenantList,
} from "@/lib/api/normalize";
import type { Obligation, ObligationDrawerDraft } from "@/types/lease";
import type { TenantSidebarItem } from "@/types/lease";

export async function fetchPropertyTenants(propertyId: string): Promise<TenantSidebarItem[]> {
  const json = await apiFetch<unknown>(`/properties/${propertyId}/tenants`);
  return normalizeTenantList(json);
}

export async function fetchTenantObligations(tenantId: string): Promise<Obligation[]> {
  const json = await apiFetch<unknown>(`/tenants/${tenantId}/obligations`);
  return normalizeObligationList(json);
}

export async function patchObligation(
  obligationId: string,
  draft: ObligationDrawerDraft,
): Promise<Obligation> {
  const json = await apiFetch<Record<string, unknown>>(`/obligations/${obligationId}`, {
    method: "PATCH",
    body: JSON.stringify({
      name: draft.name,
      type: draft.type,
      due_date: draft.dueDate,
      recurrence: draft.recurrence,
      status: draft.status,
      evidence_required: draft.evidenceRequired,
    }),
  });
  return normalizeObligation(json);
}

export async function waiveObligation(obligationId: string): Promise<Obligation> {
  const json = await apiFetch<Record<string, unknown>>(`/obligations/${obligationId}/waive`, {
    method: "POST",
    body: JSON.stringify({}),
  });
  return normalizeObligation(json);
}

export async function activateTenantObligations(tenantId: string): Promise<void> {
  await apiFetch<unknown>(`/tenants/${tenantId}/obligations/activate`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

export async function fetchTenantActivation(tenantId: string): Promise<boolean> {
  const json = await apiFetch<{ activated?: boolean }>(`/tenants/${tenantId}/activation`);
  return Boolean(json.activated);
}

export async function deactivateTenantObligations(tenantId: string): Promise<void> {
  await apiFetch<unknown>(`/tenants/${tenantId}/obligations/deactivate`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}
