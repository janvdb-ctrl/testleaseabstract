"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import type {
  ObligationDrawerDraft,
  PropertySummary,
  TenantSidebarItem,
} from "@/types/lease";
import { ActivateBar } from "@/components/ActivateBar";
import { ObligationsTable } from "@/components/ObligationsTable";
import { TenantSidebar } from "@/components/TenantSidebar";
import {
  activateTenantObligations,
  deactivateTenantObligations,
  fetchPropertyTenants,
  fetchTenantActivation,
  fetchTenantObligations,
  patchObligation,
  waiveObligation,
} from "@/lib/api/lease-api";
import {
  FLOW1_PLACEHOLDER_TENANT_ID,
  readPendingTenantFromSessionStorage,
} from "@/lib/flow1-dashboard";
import { swrKeys } from "@/lib/swr-keys";
import { mockLeaseSummaryLine } from "@/mocks/dashboard";

export interface ObligationsDashboardLayoutProps {
  property: PropertySummary;
}

function DashboardLoadingFallback() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--colour-neutral-100)] font-neue-plak-text text-fs-16 text-[var(--colour-neutral-60)]">
      Loading dashboard…
    </div>
  );
}

function ObligationsDashboardLayoutInner({ property }: ObligationsDashboardLayoutProps) {
  const searchParams = useSearchParams();
  const tenantParam = searchParams.get("tenant");

  const { mutate } = useSWRConfig();
  const [selectedId, setSelectedId] = useState("");

  const [flow1ExtraTenants, setFlow1ExtraTenants] = useState<TenantSidebarItem[]>([]);

  useEffect(() => {
    if (tenantParam === FLOW1_PLACEHOLDER_TENANT_ID) {
      const pending = readPendingTenantFromSessionStorage();
      setFlow1ExtraTenants(pending ? [pending] : []);
    } else {
      setFlow1ExtraTenants([]);
    }
  }, [tenantParam]);

  const {
    data: tenantsData,
    error: tenantsError,
    isLoading: isLoadingTenants,
  } = useSWR(property.id ? swrKeys.propertyTenants(property.id) : null, () =>
    fetchPropertyTenants(property.id),
  );

  const tenants = useMemo(() => {
    const base = tenantsData ?? [];
    const merged = [...base];
    for (const e of flow1ExtraTenants) {
      if (!merged.some((t) => t.id === e.id)) merged.push(e);
    }
    return merged;
  }, [tenantsData, flow1ExtraTenants]);

  useEffect(() => {
    if (!tenants.length) return;
    setSelectedId((prev) => {
      if (tenantParam && tenants.some((t) => t.id === tenantParam)) {
        return tenantParam;
      }
      if (prev && tenants.some((t) => t.id === prev)) return prev;
      return tenants[0]!.id;
    });
  }, [tenants, tenantParam]);

  const selected = useMemo(() => tenants.find((t) => t.id === selectedId), [tenants, selectedId]);

  const {
    data: obligationsData,
    error: obligationsError,
    isLoading: isLoadingObligations,
  } = useSWR(selectedId ? swrKeys.tenantObligations(selectedId) : null, () =>
    fetchTenantObligations(selectedId),
  );

  const { data: activated = false } = useSWR(
    selectedId ? swrKeys.tenantActivation(selectedId) : null,
    () => fetchTenantActivation(selectedId),
  );

  const obligations = obligationsData ?? [];
  const subtitle = selected ? mockLeaseSummaryLine(selected.name, selected.unitLabel) : "";

  async function invalidateTenantData() {
    if (!selectedId || !property.id) return;
    await Promise.all([
      mutate(swrKeys.tenantObligations(selectedId)),
      mutate(swrKeys.propertyTenants(property.id)),
    ]);
  }

  async function handleSaveObligation(obligationId: string, draft: ObligationDrawerDraft) {
    await patchObligation(obligationId, draft);
    await invalidateTenantData();
  }

  async function handleWaiveObligation(obligationId: string) {
    await waiveObligation(obligationId);
    await invalidateTenantData();
  }

  async function handleActivate() {
    if (!selectedId) return;
    await activateTenantObligations(selectedId);
    await mutate(swrKeys.tenantActivation(selectedId));
  }

  async function handleDeactivate() {
    if (!selectedId) return;
    await deactivateTenantObligations(selectedId);
    await mutate(swrKeys.tenantActivation(selectedId));
  }

  return (
    <div className="flex min-h-0 w-full flex-1 flex-col md:min-h-screen md:flex-row">
      <div className="flex w-full shrink-0 flex-col md:w-[320px]">
        {isLoadingTenants ? (
          <aside
            className="flex w-full shrink-0 flex-col border-b border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r"
            aria-busy="true"
            aria-label="Loading tenants"
          >
            <div className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-16">
              <div className="h-4 w-24 animate-pulse rounded bg-[var(--colour-neutral-80)]" />
              <div className="mt-ls-8 h-3 w-40 animate-pulse rounded bg-[var(--colour-neutral-80)]" />
            </div>
            <div className="flex flex-1 flex-col gap-ls-8 p-ls-12">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="flex gap-ls-12 rounded-card border border-[var(--colour-neutral-80)] px-ls-12 py-ls-12"
                >
                  <div className="h-10 w-10 shrink-0 animate-pulse rounded-full bg-[var(--colour-neutral-80)]" />
                  <div className="min-w-0 flex-1 space-y-ls-8">
                    <div className="h-4 w-3/4 max-w-[160px] animate-pulse rounded bg-[var(--colour-neutral-80)]" />
                    <div className="h-3 w-full max-w-[200px] animate-pulse rounded bg-[var(--colour-neutral-80)]" />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        ) : tenantsError ? (
          <aside className="w-full border-b border-[var(--colour-semantic-danger-100)] bg-[var(--colour-semantic-danger-50)] p-ls-16 md:w-[320px] md:border-r">
            <p className="text-fs-14 text-[var(--colour-semantic-danger-100)]">
              Could not load tenants. Check the API or network.
            </p>
          </aside>
        ) : (
          <TenantSidebar tenants={tenants} selectedId={selectedId} onSelect={setSelectedId} />
        )}
      </div>

      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <div className="min-h-0 flex-1 overflow-y-auto px-ls-24 py-ls-32 md:px-ls-32 lg:px-ls-40 lg:py-ls-48">
          {selected ? (
            <>
              {obligationsError && !tenantsError ? (
                <p
                  className="mb-ls-16 rounded-card border border-[var(--colour-semantic-danger-100)] bg-[var(--colour-semantic-danger-50)] px-ls-16 py-ls-12 text-fs-14 text-[var(--colour-semantic-danger-100)]"
                  role="alert"
                >
                  Could not refresh obligations. Try again.
                </p>
              ) : null}
              <ObligationsTable
                key={selected.id}
                property={property}
                primaryTitle={selected.name}
                subtitle={subtitle}
                obligations={obligations}
                isLoading={isLoadingObligations}
                onSaveObligation={handleSaveObligation}
                onWaiveObligation={handleWaiveObligation}
              />
            </>
          ) : !isLoadingTenants && !tenants.length ? (
            <div className="p-ls-24 text-fs-16 text-[var(--colour-neutral-60)]">No tenants to display.</div>
          ) : null}
        </div>
        {selected ? (
          <ActivateBar
            tenantName={selected.name}
            activated={activated}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />
        ) : null}
      </div>
    </div>
  );
}

export function ObligationsDashboardLayout(props: ObligationsDashboardLayoutProps) {
  return (
    <Suspense fallback={<DashboardLoadingFallback />}>
      <ObligationsDashboardLayoutInner {...props} />
    </Suspense>
  );
}
