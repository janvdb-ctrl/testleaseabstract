/** Stable SWR cache keys for Flow 2 dashboard. */

export const swrKeys = {
  propertyTenants: (propertyId: string) => ["property-tenants", propertyId] as const,
  tenantObligations: (tenantId: string) => ["tenant-obligations", tenantId] as const,
  tenantActivation: (tenantId: string) => ["tenant-activation", tenantId] as const,
};
