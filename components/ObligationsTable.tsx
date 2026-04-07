"use client";

import { useEffect, useMemo, useState } from "react";
import type { Obligation, ObligationDrawerDraft, PropertySummary } from "@/types/lease";
import { DetailDrawer } from "@/components/DetailDrawer";
import { MetricsRow } from "@/components/MetricsRow";
import { ObligationStatusPill } from "@/components/ObligationStatusPill";
import {
  applyDrawerDraftToObligation,
  EMPTY_OBLIGATION_DRAWER_DRAFT,
  obligationToDrawerDraft,
} from "@/utils/obligations-drawer";
import { sortObligationsForDisplay } from "@/utils/obligations-sort";

export interface ObligationsTableProps {
  property: PropertySummary;
  /** Main heading — e.g. selected tenant name (Flow 2). */
  primaryTitle: string;
  /** Supporting line — e.g. lease summary (placeholder). */
  subtitle?: string;
  /** Obligations from GET /tenants/:tenantId/obligations (or SWR cache). */
  obligations: Obligation[];
  isLoading: boolean;
  onSaveObligation: (obligationId: string, draft: ObligationDrawerDraft) => Promise<void>;
  onWaiveObligation: (obligationId: string) => Promise<void>;
}

function formatDisplayDate(isoDate: string): string {
  const d = new Date(isoDate + "T12:00:00");
  if (Number.isNaN(d.getTime())) return isoDate;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatLastSubmission(value: string | null): string {
  if (value === null || value === "") return "—";
  return value;
}

const obligationTypeLabels: Record<Obligation["type"], string> = {
  document: "Document",
  photo: "Photo",
  acknowledgement: "Acknowledgement",
  payment: "Payment",
};

function typeLabel(type: Obligation["type"]): string {
  return obligationTypeLabels[type];
}

function rowBackgroundClass(row: Obligation): string {
  if (row.status === "overdue") {
    return "bg-[var(--colour-obligation-overdue-row)]";
  }
  if (row.status === "flagged") {
    return "bg-[color:var(--colour-status-on-hold-50)]/40";
  }
  return "odd:bg-[var(--colour-neutral-100)] even:bg-[color:var(--colour-neutral-80)]/[0.12]";
}

export function ObligationsTable({
  property,
  primaryTitle,
  subtitle,
  obligations: obligationsProp,
  isLoading,
  onSaveObligation,
  onWaiveObligation,
}: ObligationsTableProps) {
  const [obligations, setObligations] = useState<Obligation[]>(obligationsProp);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [draft, setDraft] = useState<ObligationDrawerDraft>(EMPTY_OBLIGATION_DRAWER_DRAFT);
  useEffect(() => {
    setObligations(obligationsProp);
  }, [obligationsProp]);

  const displayRows = useMemo(() => sortObligationsForDisplay(obligations), [obligations]);

  const detailRow = detailId ? obligations.find((o) => o.id === detailId) ?? null : null;

  function openDetail(row: Obligation) {
    setDetailId(row.id);
    setDraft(obligationToDrawerDraft(row));
  }

  function closeDetail() {
    setDetailId(null);
    setDraft(EMPTY_OBLIGATION_DRAWER_DRAFT);
  }

  async function saveDetail() {
    if (!detailId || !detailRow) return;
    await onSaveObligation(detailId, draft);
    closeDetail();
  }

  async function markWaived() {
    if (!detailId) return;
    await onWaiveObligation(detailId);
    closeDetail();
  }

  return (
    <div className="flex flex-col gap-ls-32 font-neue-plak-text">
      <header className="border-b border-[var(--colour-neutral-80)] pb-ls-24">
        <p className="text-fs-14 font-semibold uppercase leading-lh-24 tracking-[0.06em] text-[var(--colour-neutral-60)]">
          Lease Abstraction Agent
        </p>
        <p className="mt-ls-4 text-fs-14 font-regular leading-lh-24 text-[var(--colour-neutral-60)]">
          {property.name}
        </p>
        <h1 className="mt-ls-8 text-fs-40 font-semibold leading-lh-48 text-[var(--colour-neutral-15)]">
          {primaryTitle}
        </h1>
        <p className="mt-ls-12 max-w-4xl text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
          {subtitle ?? "Obligations overview — all requirements for this property."}
        </p>
      </header>

      <MetricsRow obligations={obligations} isLoading={isLoading} />

      <div className="space-y-ls-16">
        <div className="overflow-hidden rounded-card border border-[var(--colour-neutral-80)] bg-[var(--colour-neutral-100)]">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1100px] table-fixed border-collapse text-left">
              <colgroup>
                <col className="w-[22%]" />
                <col className="w-[10%]" />
                <col className="w-[11%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[15%]" />
                <col className="w-[18%]" />
              </colgroup>
              <thead>
                <tr className="bg-[var(--colour-neutral-5)]">
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Obligation name
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Due date
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Recurrence
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Status
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Last submission
                  </th>
                  <th
                    scope="col"
                    className="border-b border-[var(--colour-neutral-80)] px-ls-16 py-ls-12 text-fs-14 font-semibold uppercase leading-lh-20 tracking-wide text-[var(--colour-neutral-100)]"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody
                className={isLoading ? "opacity-70" : undefined}
                aria-busy={isLoading ? "true" : undefined}
              >
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <tr key={`sk-${i}`} className="border-b border-[var(--colour-neutral-80)]">
                        <td className="px-ls-16 py-ls-12" colSpan={7}>
                          <div className="h-5 w-full animate-pulse rounded bg-[var(--colour-neutral-80)]" />
                        </td>
                      </tr>
                    ))
                  : displayRows.map((row) => {
                      const selected = detailId === row.id;
                      return (
                        <tr
                          key={row.id}
                          tabIndex={0}
                          onClick={() => openDetail(row)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              openDetail(row);
                            }
                          }}
                          data-detail-open={selected ? "true" : "false"}
                          className={`cursor-pointer border-b border-[var(--colour-neutral-80)] transition-colors hover:brightness-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--colour-highlight-blue-100)] ${selected ? "ring-1 ring-inset ring-[var(--colour-highlight-blue-100)]" : ""} ${rowBackgroundClass(row)}`}
                        >
                          <td className="px-ls-16 py-ls-12 text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-15)]">
                            {row.name}
                          </td>
                          <td className="px-ls-16 py-ls-12 text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
                            {typeLabel(row.type)}
                          </td>
                          <td className="px-ls-16 py-ls-12 text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
                            {formatDisplayDate(row.dueDate)}
                          </td>
                          <td className="px-ls-16 py-ls-12 text-fs-16 font-regular leading-lh-24 text-[var(--colour-neutral-30)]">
                            {row.recurrence}
                          </td>
                          <td className="px-ls-16 py-ls-12 align-middle">
                            <ObligationStatusPill status={row.status} />
                          </td>
                          <td className="px-ls-16 py-ls-12 text-fs-14 font-regular leading-lh-20 text-[var(--colour-neutral-30)]">
                            {formatLastSubmission(row.lastSubmission)}
                          </td>
                          <td className="px-ls-16 py-ls-12 align-middle">
                            <button
                              type="button"
                              className="kad-btn-secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetail(row);
                              }}
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
          </div>

          {detailRow ? (
            <DetailDrawer
              variant="inline"
              obligationId={detailRow.id}
              sourceClause={detailRow.sourceClause}
              draft={draft}
              onDraftChange={setDraft}
              onSave={saveDetail}
              onMarkWaived={markWaived}
              onCancel={closeDetail}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
