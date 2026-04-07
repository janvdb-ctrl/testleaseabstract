import type { TenantSidebarItem } from "@/types/lease";

/** Stable id for a tenant created in Flow 1 until the API persists the record. */
export const FLOW1_PLACEHOLDER_TENANT_ID = "tenant-flow1-draft";

export const FLOW1_PENDING_TENANT_SESSION_KEY = "leaseAbstraction.flow1.pendingTenant";

export function buildPendingTenantSidebarItem(input: {
  tenantName: string;
  unitSpace: string;
  propertyName: string;
}): TenantSidebarItem {
  return {
    id: FLOW1_PLACEHOLDER_TENANT_ID,
    name: input.tenantName.trim(),
    unitLabel: input.unitSpace.trim(),
    addressLine: `${input.propertyName} — pending sync`,
    badge: { kind: "attention", count: 0 },
  };
}

export function readPendingTenantFromSessionStorage(): TenantSidebarItem | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(FLOW1_PENDING_TENANT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TenantSidebarItem;
  } catch {
    return null;
  }
}

export function writePendingTenantToSessionStorage(tenant: TenantSidebarItem): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(FLOW1_PENDING_TENANT_SESSION_KEY, JSON.stringify(tenant));
}

export function clearPendingTenantSessionStorage(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(FLOW1_PENDING_TENANT_SESSION_KEY);
}
