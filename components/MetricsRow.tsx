"use client";

import { useMemo } from "react";
import type { Obligation } from "@/types/lease";
import { computeObligationMetrics } from "@/utils/obligations-metrics";

export interface MetricsRowProps {
  /** Current obligations for the selected tenant (includes local edits). */
  obligations: Obligation[];
  /** True while GET /tenants/:tenantId/obligations is in flight. */
  isLoading?: boolean;
}

type MetricAccent = "neutral" | "fulfilled" | "pending" | "overdue";

function metricAccentClasses(accent: MetricAccent): string {
  switch (accent) {
    case "fulfilled":
      return "border-l-[color:var(--colour-status-success-100)]";
    case "pending":
      return "border-l-[color:var(--colour-highlight-blue-100)]";
    case "overdue":
      return "border-l-[color:var(--colour-semantic-danger-100)]";
    default:
      return "border-l-[color:var(--colour-neutral-30)]";
  }
}

function MetricCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: MetricAccent;
}) {
  return (
    <article
      className={`rounded-card border border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] p-ls-24 ${metricAccentClasses(accent)} border-l-4 shadow-none`}
    >
      <p className="text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-60)]">
        {label}
      </p>
      <p className="mt-ls-12 text-fs-32 font-semibold leading-lh-40 text-[var(--colour-neutral-15)]">{value}</p>
    </article>
  );
}

function MetricCardSkeleton() {
  return (
    <article className="rounded-card border border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)] p-ls-24">
      <div className="h-4 w-28 animate-pulse rounded bg-[var(--colour-neutral-80)]" />
      <div className="mt-ls-12 h-10 w-16 animate-pulse rounded bg-[var(--colour-neutral-80)]" />
    </article>
  );
}

export function MetricsRow({ obligations, isLoading }: MetricsRowProps) {
  const m = useMemo(() => computeObligationMetrics(obligations), [obligations]);

  if (isLoading) {
    return (
      <section
        className="grid grid-cols-1 gap-ls-16 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Obligation metrics"
        aria-busy="true"
      >
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
        <MetricCardSkeleton />
      </section>
    );
  }

  return (
    <section
      className="grid grid-cols-1 gap-ls-16 sm:grid-cols-2 xl:grid-cols-4"
      aria-label="Obligation metrics"
    >
      <MetricCard label="Total obligations" value={m.total} accent="neutral" />
      <MetricCard label="Fulfilled" value={m.fulfilled} accent="fulfilled" />
      <MetricCard label="Pending" value={m.pending} accent="pending" />
      <MetricCard label="Overdue / flagged" value={m.overdueFlagged} accent="overdue" />
    </section>
  );
}
